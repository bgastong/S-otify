import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "../Footer/Footer";
import { expect, test, describe, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("Footer", () => {
  test("renders team members", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByText("Gastón Berhau")).toBeInTheDocument();
    expect(screen.getByText("Fabrizio Brollo")).toBeInTheDocument();
    expect(screen.getByText("Valentín Bustamante")).toBeInTheDocument();
    expect(screen.getByText("Lucas Ortiz")).toBeInTheDocument();
  });

  test("renders GitHub link", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    const githubLinks = screen.getAllByRole("link", { name: /github/i });

    expect(githubLinks[0]).toHaveAttribute(
      "href",
      "https://github.com/bgastong/S-otify",
    );
  });
});
