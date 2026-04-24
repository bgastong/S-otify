const BASE_URL = "https://TU_URL.mockapi.io/songs";

export async function getAllSongs(page = 1, search = "") {
  const url = new URL(BASE_URL);
  url.searchParams.set("page", page);
  url.searchParams.set("limit", 10);
  if (search) url.searchParams.set("name", search);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Error al obtener las canciones");
  return res.json();
}
