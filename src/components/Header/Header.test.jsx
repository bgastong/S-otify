import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";
import { songsService } from "../../services/songsService";
import { AuthProvider } from "../../context/AuthContext";

vi.mock("../../services/songsService", () => ({
  songsService: {
    getSongs: vi.fn(),
  },
}));

vi.mock("../../services/authService", () => ({
  me: vi.fn().mockRejectedValue(new Error("No session")),
  login: vi.fn(),
  register: vi.fn(),
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
    localStorage.clear();
    songsService.getSongs.mockResolvedValue([]);
  });

  const renderHeader = (props = {}) =>
    render(
      <MemoryRouter>
        <AuthProvider>
          <Header {...props} />
        </AuthProvider>
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

it("Abre el panel de autenticación al presionar Ingresar", async () => {
  const user = userEvent.setup();

  renderHeader();

  await user.click(
    screen.getByRole("button", { name: "auth.account" }),
  );

  expect(screen.getByText("auth.login")).toBeInTheDocument();
  expect(screen.getByText("auth.register")).toBeInTheDocument();
});

  it("Carga géneros desde songsService", async () => {
    songsService.getSongs.mockResolvedValue([
      { id: 1, genre: "Rock" },
      { id: 2, genre: "Pop" },
    ]);

    renderHeader();

    await waitFor(() => {
      expect(songsService.getSongs).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
      });
    });
  });
});