import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import LayoutShell from "./LayoutShell";

describe("LayoutShell Component", () => {
  test("Renderiza children correctamente", () => {
    render(
      <LayoutShell>
        <div data-testid="child">Contenido</div>
      </LayoutShell>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Contenido")).toBeInTheDocument();
  });

  test("Aplica la clase main al contenedor", () => {
    render(<LayoutShell><span>test</span></LayoutShell>);

    const main = document.querySelector("main");
    expect(main).toBeInTheDocument();
  });

  test("Permite múltiples children", () => {
    render(
      <LayoutShell>
        <div>Child 1</div>
        <div>Child 2</div>
      </LayoutShell>
    );

    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });
});