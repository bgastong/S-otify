import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Player from "../Player/Player";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("Player", () => {
  test("renderiza el titulo y artista", () => {
    render(
      <Player title="Mi Cancion" artist="Mi Artista" audioUrl="test.mp3" />,
    );

    expect(screen.getByText("Mi Cancion")).toBeInTheDocument();
    expect(screen.getByText("Mi Artista")).toBeInTheDocument();
  });

  test("muestra mensaje por defecto si no hay cancion", () => {
    render(<Player />);

    expect(screen.getByText("player.noSongSelected")).toBeInTheDocument();
  });

  test("renderiza slider de volumen", () => {
    render(<Player audioUrl="test.mp3" />);

    const sliders = screen.getAllByRole("slider");

    expect(sliders.length).toBeGreaterThan(0);
  });

  test("muestra mensaje de aviso", () => {
    render(<Player notice="Error de audio" audioUrl="test.mp3" />);

    expect(screen.getByText("Error de audio")).toBeInTheDocument();
  });
});
