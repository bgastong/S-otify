import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";
import { songsService } from "../../services/songsService";

vi.mock("../../services/songsService", () => ({
  songsService: {
    getSongs: vi.fn(),
    searchSongs: vi.fn(),
  },
}));

vi.mock("../../components/SongCard/SongCard", () => ({
  default: ({ song }) => (
    <article>
      <h3>{song.name}</h3>
      <p>{song.artist}</p>
    </article>
  ),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

class IntersectionObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

describe("Home", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.IntersectionObserver = IntersectionObserverMock;
  });

  const songsMock = [
    { id: 1, name: "Numb", artist: "Linkin Park", genre: "Rock" },
    { id: 2, name: "Bohemian Rhapsody", artist: "Queen", genre: "Rock" },
  ];

  const renderHome = (props = {}) =>
    render(
      <MemoryRouter>
        <Home {...props} />
      </MemoryRouter>,
    );

  it("muestra el contenido principal del home", () => {
    songsService.getSongs.mockResolvedValue([]);

    renderHome();

    expect(screen.getByText("home.title")).toBeInTheDocument();
    expect(screen.getByText("home.subtitle")).toBeInTheDocument();
    expect(screen.getByText("home.sectionTitle")).toBeInTheDocument();
  });

  it("muestra canciones obtenidas desde la API simulada", async () => {
    songsService.getSongs.mockResolvedValue(songsMock);

    renderHome();

    expect((await screen.findAllByText("Numb")).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Bohemian Rhapsody").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Queen").length).toBeGreaterThan(0);
    expect(songsService.getSongs).toHaveBeenCalled();
  });

  it("muestra mensaje vacío cuando la API no devuelve canciones", async () => {
    songsService.getSongs.mockResolvedValue([]);

    renderHome();

    expect(await screen.findByText("home.emptyMessage")).toBeInTheDocument();
  });

  it("usa searchSongs cuando recibe searchTerm", async () => {
    songsService.searchSongs.mockResolvedValue([
      { id: 2, name: "Bohemian Rhapsody", artist: "Queen", genre: "Rock" },
    ]);

    renderHome({ searchTerm: "Queen" });

    expect(await screen.findByText("Bohemian Rhapsody")).toBeInTheDocument();

    expect(songsService.searchSongs).toHaveBeenCalledWith("Queen", {
      page: 1,
      limit: 20,
      genre: "",
    });
  });

  it("muestra error si falla la carga de canciones", async () => {
    songsService.getSongs.mockRejectedValue(new Error("Error API"));

    renderHome();

    expect(await screen.findByText("home.errorMessage")).toBeInTheDocument();
  });

  it("ejecuta retry y muestra canciones luego de reintentar", async () => {
    const user = userEvent.setup();

    songsService.getSongs
      .mockRejectedValueOnce(new Error("Error API"))
      .mockResolvedValueOnce(songsMock);

    renderHome();

    const retryButton = await screen.findByRole("button", {
      name: /reintentar|retry|common.retry/i,
    });

    await user.click(retryButton);

    await waitFor(() => {
      expect(screen.getAllByText("Numb").length).toBeGreaterThan(0);
    });
  });
});