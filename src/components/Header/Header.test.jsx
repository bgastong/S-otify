import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi } from "vitest";
import Header from "./Header";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: "es", changeLanguage: vi.fn() },
  }),
}));

vi.mock("../../services/songsService", () => ({
  songsService: {
    getSongs: vi.fn(async () => []),
  },
}));

describe("Header Component", () => {
  const defaultProps = {
    searchTerm: "",
    onSearchChange: vi.fn(),
    onFilterChange: vi.fn(),
    currentGenre: "",
  };

  test("Renderiza el logo y nombre de la app", () => {
    render(
      <MemoryRouter>
        <Header {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByText("Sñotify")).toBeInTheDocument();
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
  });

  test("Renderiza los links de navegación en desktop", () => {
    render(
      <MemoryRouter>
        <Header {...defaultProps} />
      </MemoryRouter>
    );

    const nav = document.querySelector("nav");
    expect(nav).toBeInTheDocument();
  });

  test("Renderiza el input de búsqueda en desktop", () => {
    render(
      <MemoryRouter>
        <Header {...defaultProps} />
      </MemoryRouter>
    );

    // Hay dos inputs (mobile y desktop) - usamos getAllBy y tomamos el visible en desktop
    const inputs = screen.getAllByPlaceholderText("home.searchPlaceholder");
    const desktopInput = inputs[0]; // El primero es el de desktop (hidden md:flex)
    expect(desktopInput).toBeInTheDocument();
  });

  test("Llama a onSearchChange al escribir en el input", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Header {...defaultProps} />
      </MemoryRouter>
    );

    const inputs = screen.getAllByPlaceholderText("home.searchPlaceholder");
    const desktopInput = inputs[0];
    await user.type(desktopInput, "test");

    // onSearchChange se llama por cada caracter tipeado
    expect(defaultProps.onSearchChange).toHaveBeenCalledTimes(4);
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith("t");
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith("e");
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith("s");
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith("t");
  });

  test("Renderiza botones de idioma", () => {
    render(
      <MemoryRouter>
        <Header {...defaultProps} />
      </MemoryRouter>
    );

    const langButtons = screen.getAllByTitle(/Español|English/);
    expect(langButtons).toHaveLength(2);
  });
});