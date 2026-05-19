import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import SongDetails from "./SongDetails";

const mockSong = {
  id: "1",
  name: "Test Song",
  artist: "Test Artist",
  genre: "Pop",
  image: "test-cover.jpg",
  duration: "3:30",
};

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

vi.mock("../../services/songsService", () => ({
  songsService: {
    getSongById: vi.fn(async (id) => id === mockSong.id ? mockSong : null),
  },
}));

describe("SongDetails Component", () => {
  it("Renderiza correctamente los detalles de la canción", async () => {
    render(
      <MemoryRouter initialEntries={[`/details/${mockSong.id}`]}>
        <Routes>
          <Route path="/details/:id" element={<SongDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: mockSong.name })).toBeInTheDocument();
    expect(screen.getAllByText(mockSong.artist).length).toBeGreaterThan(0);
    expect(screen.getAllByText(mockSong.genre).length).toBeGreaterThan(0);
    expect(screen.getAllByAltText(mockSong.name)[0]).toHaveAttribute("src", mockSong.image);
  });

screen.debug()
  it("Llama onSelectSong al hacer click en el botón de reproducción", async () => {
    const onSelectSong = vi.fn();

    render(
      <MemoryRouter initialEntries={[`/details/${mockSong.id}`]}>
        <Routes>
          <Route path="/details/:id" element={<SongDetails onSelectSong={onSelectSong} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: mockSong.name })).toBeInTheDocument();

    const playButton = screen.getByRole("button", {
      name: /details.play/i,
    });

    await userEvent.click(playButton);

    expect(onSelectSong).toHaveBeenCalledWith(mockSong, { autoplay: true });
  });
});