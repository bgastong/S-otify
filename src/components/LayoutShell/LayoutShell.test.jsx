import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LayoutShell from "./LayoutShell";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("LayoutShell Component", () => {
  const renderLayout = (children, props = {}) =>
    render(
      <MemoryRouter>
        <LayoutShell {...props}>{children}</LayoutShell>
      </MemoryRouter>,
    );

  it("Renderiza children correctamente", () => {
    renderLayout(<div>Contenido de prueba</div>);

    expect(screen.getByText("Contenido de prueba")).toBeInTheDocument();
  });

  it("Renderiza navegación principal", () => {
    renderLayout(<div>Contenido</div>);

    expect(screen.getByTitle("nav.home")).toBeInTheDocument();
    expect(screen.getByTitle("nav.favorites")).toBeInTheDocument();
  });

  it("Permite múltiples children", () => {
    renderLayout(
      <>
        <p>Primer child</p>
        <p>Segundo child</p>
      </>,
    );

    expect(screen.getByText("Primer child")).toBeInTheDocument();
    expect(screen.getByText("Segundo child")).toBeInTheDocument();
  });

  it("Muestra canción seleccionada en el panel derecho", () => {
    renderLayout(<div>Contenido</div>, {
      selectedSong: {
        name: "Test Song",
        artist: "Test Artist",
        genre: "Rock",
        album: "Test Album",
        image: "test.jpg",
      },
    });

    expect(screen.getAllByText("Test Song").length).toBeGreaterThan(0);
    expect(screen.getByText("Test Artist")).toBeInTheDocument();
  });
});