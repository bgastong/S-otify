const BASE_URL = "https://TU_URL.mockapi.io/songs";

export async function getSongById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Error al obtener la canción");
  return res.json();
}
