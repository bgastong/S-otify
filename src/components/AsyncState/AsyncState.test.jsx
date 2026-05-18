import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import AsyncState from "./AsyncState";

describe("AsyncState component", () => {
  it("muestra el mensaje de loading", () => {
    render(<AsyncState loading={true} />);

    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });

  it("muestra el mensaje de error", () => {
    render(<AsyncState error="Error al cargar canciones" />);

    expect(
      screen.getByText("Error al cargar canciones")
    ).toBeInTheDocument();
  });

  it("muestra el mensaje cuando no hay resultados", () => {
    render(<AsyncState isEmpty={true} />);

    expect(
      screen.getByText("No hay resultados.")
    ).toBeInTheDocument();
  });

  it("ejecuta onRetry cuando el usuario hace click en reintentar", async () => {
    const user = userEvent.setup();

    const onRetry = vi.fn();

    render(
      <AsyncState
        error="Error al cargar canciones"
        onRetry={onRetry}
      />
    );

    const button = screen.getByRole("button", {
      name: /reintentar/i,
    });

    await user.click(button);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});