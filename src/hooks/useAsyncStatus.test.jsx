import { renderHook, act } from "@testing-library/react";
import useAsyncStatus from "./useAsyncStatus";

describe("useAsyncStatus hook", () => {
  it("inicia con loading en false", () => {
    const { result } = renderHook(() => useAsyncStatus());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("ejecuta una tarea correctamente", async () => {
    const { result } = renderHook(() => useAsyncStatus());

    const mockTask = vi.fn(async () => "datos");

    let response;

    await act(async () => {
      response = await result.current.runTask(mockTask);
    });

    expect(mockTask).toHaveBeenCalled();

    expect(response).toBe("datos");

    expect(result.current.loading).toBe(false);

    expect(result.current.error).toBe(null);
  });

  it("maneja errores correctamente", async () => {
    const { result } = renderHook(() => useAsyncStatus());

    const mockTask = vi.fn(async () => {
      throw new Error("Error API");
    });

    await act(async () => {
      await result.current.runTask(
        mockTask,
        "Error al cargar canciones"
      );
    });

    expect(result.current.loading).toBe(false);

    expect(result.current.error).toBe(
      "Error al cargar canciones"
    );
  });
});