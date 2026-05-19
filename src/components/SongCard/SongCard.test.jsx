import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import SongCard from "../SongCard/SongCard";

describe("Song Card Component", () => {
  const song = {
    id: "1",
    name: "Test Song",
    artist: "Test Artist",
    genre: "Pop",
    image: "test-cover.jpg",
  };

  it("Renderiza correctamente los datos de la canción dentro de un Router", async () => {
    render(
      <MemoryRouter>
        <SongCard song={song} />
      </MemoryRouter>
    );

    expect(screen.getByText(song.name)).toBeInTheDocument();
    expect(screen.getByText(song.artist)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("Llama a onSelectSong al hacer click", async () => {
    const onSelectSong = vi.fn();

    render(
      <MemoryRouter>
        <SongCard song={song} onSelectSong={onSelectSong} />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button"));
    expect(onSelectSong).toHaveBeenCalledWith(song);
  });
});
