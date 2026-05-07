// Usage: npm run seed:songs
// Purpose: carga canciones base en MockAPI tomando metadatos desde Deezer.

const songs = [
  { name: "Buenos Tiempos", artist: "Dillom", youtubeId: "kYvM-iR6FpQ", genre: "Trap" },
  { name: "Platos Rotos", artist: "Kamada", youtubeId: "H77O0u8Nq5g", genre: "Rap" },
  { name: "Josear", artist: "Acru", youtubeId: "3u_xYVvWcUA", genre: "Rap" },
  { name: "Guchi Polo", artist: "Saramalacara", youtubeId: "Gk6f7-t6YJ8", genre: "Trap" },
  { name: "La Mezcla", artist: "Ca7riel & Paco Amoroso", youtubeId: "N_8Nf-v-QpM", genre: "Hip Hop" },
  { name: "Gorilla", artist: "Little Simz", youtubeId: "hX2_G28I_Yc", genre: "Hip Hop" },
  { name: "Doomsday", artist: "MF DOOM", youtubeId: "ayfu_mSaXgs", genre: "Hip Hop" },
  { name: "Hazard Duty Pay!", artist: "JPEGMAFIA", youtubeId: "L_vS8e7_XpU", genre: "Experimental Hip Hop" },
  { name: "Walkin", artist: "Denzel Curry", youtubeId: "fS9XN_8-Wyo", genre: "Rap" },
  { name: "El Doctorado", artist: "T&K", youtubeId: "q6t8rI0tH90", genre: "Cumbia" },
  { name: "En mi cuarto", artist: "Lara91k", youtubeId: "S0T0jR3F1gY", genre: "R&B" },
  { name: "Ego Death", artist: "Polyphia", youtubeId: "2pS6P-I_3k8", genre: "Instrumental" },
  { name: "Get Got", artist: "Death Grips", youtubeId: "HIrKSqb4H4A", genre: "Experimental Hip Hop" },
  { name: "Deal Wiv It", artist: "Mura Masa & slowthai", youtubeId: "r_v6u586nCc", genre: "Electronic" },
  { name: "Surround Sound", artist: "JID", youtubeId: "YfMhL_C9P70", genre: "Hip Hop" },
  { name: "Pulso", artist: "Nenagenix", youtubeId: "68YyK4D3g-M", genre: "Alternative" },
  { name: "Anton", artist: "Winona Riders", youtubeId: "vV-G55_4QYo", genre: "Indie Rock" },
  { name: "Fiesta de Disfraces", artist: "Mujercitas Terror", youtubeId: "mD7Z6G7F9m8", genre: "Post Punk" },
  { name: "Descreer", artist: "Buenos Vampiros", youtubeId: "zE6N_R_Xj5s", genre: "Shoegaze" },
  { name: "Hice Todo Mal", artist: "Las Liga Menores", youtubeId: "2e0A6Dq-T_w", genre: "Indie Rock" },
  { name: "Rainforest", artist: "Noname", youtubeId: "6m8L_N0_D-k", genre: "Hip Hop" },
  { name: "Road of the Lonely Ones", artist: "Madlib", youtubeId: "mE9n8G9-T_k", genre: "Hip Hop" },
  { name: "Los Pollos Hermanos", artist: "Knucks", youtubeId: "eYkH_9m_rZ8", genre: "Rap" },
  { name: "90s", artist: "El Kuelgue", youtubeId: "rO55rX2Sj3U", genre: "Alternative" },
  { name: "Cicatriz", artist: "Marilina Bertoldi", youtubeId: "P2L7rS2jL8U", genre: "Rock" },
  { name: "Tengo un Amigo", artist: "Usted Señalemelo", youtubeId: "uK1H_V5z-5k", genre: "Indie Rock" },
  { name: "Gila Monster", artist: "King Gizzard & TLW", youtubeId: "n7n657QvW-8", genre: "Psychedelic Rock" },
  { name: "Oxygen", artist: "Swans", youtubeId: "f-K86uVbL_M", genre: "Experimental Rock" },
  { name: "Peligro", artist: "Nenagenix", youtubeId: "6Z8-I_6w-iU", genre: "Alternative" },
  { name: "Mundo Disperso", artist: "Luis Alberto Spinetta", youtubeId: "R3P-P6Xv1Ew", genre: "Rock" }
];

const MOCKAPI_URL = "https://69ebb64897482ad5c528051d.mockapi.io/api/s-otify/songs";

function normalizeValue(value) {
  return String(value || "").trim().toLowerCase();
}

function isSameSong(left, right) {
  return (
    normalizeValue(left.name) === normalizeValue(right.name) &&
    normalizeValue(left.artist) === normalizeValue(right.artist)
  );
}

async function getExistingSongs() {
  const response = await fetch(`${MOCKAPI_URL}?page=1&limit=100`);
  if (!response.ok) {
    throw new Error(`No se pudo leer MockAPI: ${response.status}`);
  }
  return response.json();
}

async function updateExistingSong(id, songData) {
  const response = await fetch(`${MOCKAPI_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(songData)
  });

  if (!response.ok) {
    throw new Error(`No se pudo actualizar la cancion ${id}: ${response.status}`);
  }

  return response.json();
}

async function createSong(songData) {
  const response = await fetch(MOCKAPI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(songData)
  });

  if (!response.ok) {
    throw new Error(`No se pudo crear la cancion: ${response.status}`);
  }

  return response.json();
}

async function searchOnDeezer(artist, title) {
  try {
    const query = encodeURIComponent(`${artist} ${title}`);
    const response = await fetch(`https://api.deezer.com/search?q=${query}&limit=1`);
    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const track = data.data[0];
      return {
        image: track.album?.cover_big || track.album?.cover_medium || track.artist?.picture_big,
        album: track.album?.title,
        duration: Math.floor(track.duration / 60) + ":" + String(track.duration % 60).padStart(2, '0'),
        audioUrl: track.preview || ""
      };
    }
  } catch (e) {
    console.log(`Error buscando ${artist} - ${title}:`, e.message);
  }
  return null;
}

async function uploadSongs() {
  console.log("🎵 Starting song sync to MockAPI...\n");
  const existingSongs = await getExistingSongs();

  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    console.log(`[${i + 1}/30] Syncing: ${song.name} - ${song.artist}...`);

    const deezerData = await searchOnDeezer(song.artist, song.name);

    const songData = {
      name: song.name,
      artist: song.artist,
      youtubeId: song.youtubeId,
      genre: song.genre,
      image: deezerData?.image || "https://via.placeholder.com/300x300?text=No+Image",
      album: deezerData?.album || "Unknown Album",
      duration: deezerData?.duration || "0:00",
      audioUrl: deezerData?.audioUrl || ""
    };

    try {
      const matches = existingSongs.filter((item) => isSameSong(item, song));

      if (matches.length > 0) {
        for (const match of matches) {
          await updateExistingSong(match.id, songData);
        }
        console.log(`   ✅ Updated: ${song.name} (${matches.length})`);
      } else {
        const createdSong = await createSong(songData);
        existingSongs.push(createdSong);
        console.log(`   ✅ Created: ${song.name}`);
      }
    } catch (e) {
      console.log(`   ❌ Error: ${e.message}`);
    }

    // Rate limit - wait between requests
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("\n🎉 Done! MockAPI songs synced.");
}

uploadSongs();