import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";
import { songsService } from "../../services/songsService";

vi.mock("../../services/songsService", () => ({
  songsService: {
    getSongs: vi.fn(),
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      language: "es",
      changeLanguage: vi.fn(),
    },
  }),
}));

describe("Header Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    songsService.getSongs.mockResolvedValue([]);
  });

  const renderHeader = (props = {}) =>
    render(
      <MemoryRouter>
        <Header {...props} />
      </MemoryRouter>,
    );

it("Renderiza el nombre de la app", () => {
  renderHeader();

  expect(screen.getByText("SÑOTIFY")).toBeInTheDocument();
  expect(screen.queryByAltText("Sñotify")).not.toBeInTheDocument();
});

  it("Renderiza el input de búsqueda en desktop", () => {
    renderHeader();

    expect(
      screen.getByPlaceholderText("home.searchPlaceholder"),
    ).toBeInTheDocument();
  });

  it("Llama a onSearchChange al escribir en el input", async () => {
    const onSearchChange = vi.fn();
    const user = userEvent.setup();

    renderHeader({ onSearchChange });

    await user.type(
      screen.getByPlaceholderText("home.searchPlaceholder"),
      "Queen",
    );

    expect(onSearchChange).toHaveBeenCalled();
  });

  it("Renderiza botones de idioma", () => {
    renderHeader();

    expect(screen.getByText("ES")).toBeInTheDocument();
    expect(screen.getByText("GB")).toBeInTheDocument();
  });

  it("Carga géneros desde songsService", async () => {
    songsService.getSongs.mockResolvedValue([
      { id: 1, genre: "Rock" },
      { id: 2, genre: "Pop" },
    ]);

    renderHeader();

    expect(songsService.getSongs).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
    });
  });
});