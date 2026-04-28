const songs = [
  { name: "Buenos Tiempos", artist: "Dillom", youtubeId: "kYvM-iR6FpQ" },
  { name: "Platos Rotos", artist: "Kamada", youtubeId: "H77O0u8Nq5g" },
  { name: "Josear", artist: "Acru", youtubeId: "3u_xYVvWcUA" },
  { name: "Guchi Polo", artist: "Saramalacara", youtubeId: "Gk6f7-t6YJ8" },
  { name: "La Mezcla", artist: "Ca7riel & Paco Amoroso", youtubeId: "N_8Nf-v-QpM" },
  { name: "Gorilla", artist: "Little Simz", youtubeId: "hX2_G28I_Yc" },
  { name: "Doomsday", artist: "MF DOOM", youtubeId: "ayfu_mSaXgs" },
  { name: "Hazard Duty Pay!", artist: "JPEGMAFIA", youtubeId: "L_vS8e7_XpU" },
  { name: "Walkin", artist: "Denzel Curry", youtubeId: "fS9XN_8-Wyo" },
  { name: "El Doctorado", artist: "T&K", youtubeId: "q6t8rI0tH90" },
  { name: "En mi cuarto", artist: "Lara91k", youtubeId: "S0T0jR3F1gY" },
  { name: "Ego Death", artist: "Polyphia", youtubeId: "2pS6P-I_3k8" },
  { name: "Get Got", artist: "Death Grips", youtubeId: "HIrKSqb4H4A" },
  { name: "Deal Wiv It", artist: "Mura Masa & slowthai", youtubeId: "r_v6u586nCc" },
  { name: "Surround Sound", artist: "JID", youtubeId: "YfMhL_C9P70" },
  { name: "Pulso", artist: "Nenagenix", youtubeId: "68YyK4D3g-M" },
  { name: "Anton", artist: "Winona Riders", youtubeId: "vV-G55_4QYo" },
  { name: "Fiesta de Disfraces", artist: "Mujercitas Terror", youtubeId: "mD7Z6G7F9m8" },
  { name: "Descreer", artist: "Buenos Vampiros", youtubeId: "zE6N_R_Xj5s" },
  { name: "Hice Todo Mal", artist: "Las Liga Menores", youtubeId: "2e0A6Dq-T_w" },
  { name: "Rainforest", artist: "Noname", youtubeId: "6m8L_N0_D-k" },
  { name: "Road of the Lonely Ones", artist: "Madlib", youtubeId: "mE9n8G9-T_k" },
  { name: "Los Pollos Hermanos", artist: "Knucks", youtubeId: "eYkH_9m_rZ8" },
  { name: "90s", artist: "El Kuelgue", youtubeId: "rO55rX2Sj3U" },
  { name: "Cicatriz", artist: "Marilina Bertoldi", youtubeId: "P2L7rS2jL8U" },
  { name: "Tengo un Amigo", artist: "Usted Señalemelo", youtubeId: "uK1H_V5z-5k" },
  { name: "Gila Monster", artist: "King Gizzard & TLW", youtubeId: "n7n657QvW-8" },
  { name: "Oxygen", artist: "Swans", youtubeId: "f-K86uVbL_M" },
  { name: "Peligro", artist: "Nenagenix", youtubeId: "6Z8-I_6w-iU" },
  { name: "Mundo Disperso", artist: "Luis Alberto Spinetta", youtubeId: "R3P-P6Xv1Ew" }
];

const MOCKAPI_URL = "https://69ebb64897482ad5c528051d.mockapi.io/api/s-otify/songs";

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
        duration: Math.floor(track.duration / 60) + ":" + String(track.duration % 60).padStart(2, '0')
      };
    }
  } catch (e) {
    console.log(`Error buscando ${artist} - ${title}:`, e.message);
  }
  return null;
}

async function uploadSongs() {
  console.log("🎵 Starting song upload to MockAPI...\n");
  
  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    console.log(`[${i + 1}/30] Searching: ${song.name} - ${song.artist}...`);
    
    const deezerData = await searchOnDeezer(song.artist, song.name);
    
    const songData = {
      name: song.name,
      artist: song.artist,
      youtubeId: song.youtubeId,
      image: deezerData?.image || "https://via.placeholder.com/300x300?text=No+Image",
      album: deezerData?.album || "Unknown Album",
      duration: deezerData?.duration || "0:00"
    };
    
    try {
      const response = await fetch(MOCKAPI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(songData)
      });
      
      if (response.ok) {
        const created = await response.json();
        console.log(`   ✅ Uploaded: ${song.name}`);
      } else {
        console.log(`   ❌ Error: ${response.status}`);
      }
    } catch (e) {
      console.log(`   ❌ Error: ${e.message}`);
    }
    
    // Rate limit - wait between requests
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log("\n🎉 Done! All songs uploaded to MockAPI.");
}

uploadSongs();