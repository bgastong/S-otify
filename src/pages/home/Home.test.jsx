import { render, screen, waitFor } from "@testing-library/react";
import { describe, beforeEach, expect, it, vi } from "vitest";
import Home from "./Home";
import { songsService } from "../../services/songsService";
import userEvent from "@testing-library/user-event";

const cancionesMock = [
  {
    id: 1,
    title: "Numb",
    artist: "Linkin Park",
  },
  {
    id: 2,
    title: "Bohemian Rhapsody",
    artist: "Queen",
  },
];

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

vi.mock("../../components/SongCard/SongCard", () => ({
  default: ({ song }) => (
    <article>
      <h3>{song.title}</h3>
      <p>{song.artist}</p>
    </article>
  ),
}));

vi.mock("../../services/songsService", () => ({
  songsService: {
    getSongs: vi.fn(() => Promise.resolve(cancionesMock)),
    searchSongs: vi.fn(() => Promise.resolve(cancionesMock)),
  },
}));

describe("Home", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el contenido principal del home", async () => {
    render(<Home />);

    expect(screen.getByText("home.eyebrow")).toBeInTheDocument();
    expect(screen.getByText("home.title")).toBeInTheDocument();
    expect(screen.getByText("home.subtitle")).toBeInTheDocument();

    await waitFor(() => {
      expect(songsService.getSongs).toHaveBeenCalled();
    });
  });

  it("muestra canciones obtenidas desde la API simulada", async () => {
    render(<Home />);

    expect(await screen.findByText("Numb")).toBeInTheDocument();
    expect(screen.getByText("Bohemian Rhapsody")).toBeInTheDocument();
    expect(screen.getByText("Queen")).toBeInTheDocument();

    expect(songsService.getSongs).toHaveBeenCalled();
  });

  it("muestra mensaje vacío cuando la API no devuelve canciones", async () => {
    songsService.getSongs.mockResolvedValueOnce([]);

    render(<Home />);

    expect(await screen.findByText("home.emptyMessage")).toBeInTheDocument();
  });

  it("usa searchSongs cuando recibe searchTerm", async () => {
    render(<Home searchTerm="Queen" />);

    expect(await screen.findByText("Bohemian Rhapsody")).toBeInTheDocument();

    expect(songsService.searchSongs).toHaveBeenCalledWith("Queen", {
      page: 1,
      limit: 10,
      genre: "",
    });
  });

  it("muestra error si falla la carga de canciones", async () => {
    songsService.getSongs.mockRejectedValueOnce(new Error("Error API"));

    render(<Home />);

    expect(await screen.findByText("home.errorMessage")).toBeInTheDocument();
  });

  it("ejecuta retry y muestra canciones luego de reintentar", async () => {
    const user = userEvent.setup();

    songsService.getSongs.mockRejectedValueOnce(new Error("Error API"));

    render(<Home />);

    const button = await screen.findByRole("button", {
      name: /reintentar/i,
    });

    songsService.getSongs.mockResolvedValueOnce([
      {
        id: 1,
        title: "Numb",
        artist: "Linkin Park",
      },
    ]);

    await user.click(button);

    expect(await screen.findByText("Numb")).toBeInTheDocument();

    expect(songsService.getSongs).toHaveBeenCalledTimes(2);
  });
});
