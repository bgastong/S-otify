import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import FilterSong from "./FilterSong";

describe("FilterSong Component", () => {
  const defaultProps = {
    genres: ["Pop", "Rock", "Jazz"],
    filters: { genre: "" },
    onFilterChange: vi.fn(),
    t: (key) => key,
  };

  it("Renderiza el label y el select", () => {
    render(<FilterSong {...defaultProps} />);

    expect(screen.getByText("home.filterGenre")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("Renderiza todas las opciones de género", () => {
    render(<FilterSong {...defaultProps} />);

    const select = screen.getByRole("combobox");
    const options = screen.getAllByRole("option");

    expect(options).toHaveLength(4); // "Todos los géneros" + 3 géneros
    expect(screen.getByText("Pop")).toBeInTheDocument();
    expect(screen.getByText("Rock")).toBeInTheDocument();
    expect(screen.getByText("Jazz")).toBeInTheDocument();
  });

  it("Llama a onFilterChange al cambiar el select", async () => {
    const user = userEvent.setup();
    render(<FilterSong {...defaultProps} />);

    await user.selectOptions(screen.getByRole("combobox"), "Rock");

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  it("Mantiene el género seleccionado", () => {
    const propsWithSelectedGenre = {
      ...defaultProps,
      filters: { genre: "Rock" },
    };

    render(<FilterSong {...propsWithSelectedGenre} />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("Rock");
  });
});