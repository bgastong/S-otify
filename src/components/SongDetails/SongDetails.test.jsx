import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import SongDetails from "./SongDetails";
import { songsService } from "../../services/songsService";

vi.mock("../../services/songsService", () => ({
  songsService: {
    getSongById: vi.fn(),
    isFavorite: vi.fn(),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("SongDetails Component", () => {
  const mockSong = {
    id: 1,
    name: "Test Song",
    artist: "Test Artist",
    genre: "Pop",
    album: "Test Album",
    duration: "3:30",
    image: "test-cover.jpg",
    audioUrl: "test-audio.mp3",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    songsService.getSongById.mockResolvedValue(mockSong);
    songsService.isFavorite.mockResolvedValue({ isFavorite: false });
  });

  const renderSongDetails = (onSelectSong = vi.fn()) => {
    render(
      <MemoryRouter initialEntries={["/details/1"]}>
        <Routes>
          <Route
            path="/details/:id"
            element={<SongDetails onSelectSong={onSelectSong} />}
          />
        </Routes>
      </MemoryRouter>,
    );

    return onSelectSong;
  };

  it("Renderiza correctamente los detalles de la canción", async () => {
    renderSongDetails();

    expect(
      await screen.findByRole("heading", { name: mockSong.name }),
    ).toBeInTheDocument();

    expect(screen.getAllByText(mockSong.artist).length).toBeGreaterThan(0);
    expect(screen.getByText(mockSong.genre)).toBeInTheDocument();
    expect(screen.getAllByText(mockSong.duration).length).toBeGreaterThan(0);
  });

  it("Llama onSelectSong al hacer click en el botón de reproducción", async () => {
    const onSelectSong = renderSongDetails();
    const user = userEvent.setup();

    expect(
      await screen.findByRole("heading", { name: mockSong.name }),
    ).toBeInTheDocument();

    const playButtons = screen.getAllByRole("button");
    const mainPlayButton = playButtons.find((button) =>
      button.textContent.includes("▶"),
    );

    await user.click(mainPlayButton);

    expect(onSelectSong).toHaveBeenCalledWith(mockSong, { autoplay: true });
  });
});