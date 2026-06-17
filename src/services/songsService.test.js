import { beforeEach, describe, expect, it, vi } from "vitest";
import { songsService } from "./songsService";

const okResponse = (data = []) => ({
  ok: true,
  status: 200,
  json: () => Promise.resolve(data),
});

describe("songsService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("searchSongs usa una sola request con el parametro search codificado", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        okResponse([{ id: 1, title: "Duki", artist: "Duki" }]),
      );
    vi.stubGlobal("fetch", fetchMock);

    await songsService.searchSongs("duki", { page: 1, limit: 10 });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const requestUrl = new URL(fetchMock.mock.calls[0][0]);
    expect(`${requestUrl.pathname}${requestUrl.search}`).toBe(
      "/api/songs?search=duki&page=1&limit=10",
    );
  });

  it("searchSongs codifica caracteres especiales del valor de search", async () => {
    const fetchMock = vi.fn().mockResolvedValue(okResponse([]));
    vi.stubGlobal("fetch", fetchMock);

    await songsService.searchSongs("duki remix", { page: 1, limit: 10 });

    const requestUrl = new URL(fetchMock.mock.calls[0][0]);
    expect(`${requestUrl.pathname}${requestUrl.search}`).toBe(
      "/api/songs?search=duki%20remix&page=1&limit=10",
    );
  });
});
