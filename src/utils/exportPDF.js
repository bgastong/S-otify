const JSPDF_CDN_URL = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';

let jsPdfLoaderPromise = null;

function loadJsPDFFromCdn() {
  if (window.jspdf?.jsPDF) {
    return Promise.resolve(window.jspdf.jsPDF);
  }

  if (!jsPdfLoaderPromise) {
    jsPdfLoaderPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${JSPDF_CDN_URL}"]`);
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(window.jspdf?.jsPDF));
        existingScript.addEventListener('error', () => reject(new Error('No se pudo cargar jsPDF desde CDN.')));
        return;
      }

      const script = document.createElement('script');
      script.src = JSPDF_CDN_URL;
      script.async = true;
      script.onload = () => {
        if (window.jspdf?.jsPDF) {
          resolve(window.jspdf.jsPDF);
          return;
        }
        reject(new Error('jsPDF se cargó, pero no se encontró en window.jspdf.'));
      };
      script.onerror = () => reject(new Error('No se pudo cargar jsPDF desde CDN.'));
      document.head.appendChild(script);
    });
  }

  return jsPdfLoaderPromise;
}

export async function exportSongToPDF(song) {
  let JsPdfCtor;

  try {
    JsPdfCtor = await loadJsPDFFromCdn();
  } catch (error) {
    // Mantiene la app funcional aunque falle la carga externa.
    alert('No se pudo generar el PDF en este momento. Verificá tu conexión e intentá nuevamente.');
    return;
  }

  const doc = new JsPdfCtor();
  
  // Titulo
  doc.setFontSize(24);
  doc.setTextColor(29, 185, 84); // Verde Spotify
  doc.text(song.name, 20, 30);
  
  // Artista
  doc.setFontSize(16);
  doc.setTextColor(60, 60, 60);
  doc.text(song.artist, 20, 45);
  
  // Linea separadora
  doc.setDrawColor(29, 185, 84);
  doc.line(20, 55, 190, 55);
  
  // Datos
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  
  let y = 70;
  const lineHeight = 10;
  
  if (song.album) {
    doc.text(`Álbum: ${song.album}`, 20, y);
    y += lineHeight;
  }
  
  if (song.duration) {
    doc.text(`Duración: ${song.duration}`, 20, y);
    y += lineHeight;
  }
  
  if (song.genre) {
    doc.text(`Género: ${song.genre}`, 20, y);
    y += lineHeight;
  }
  
  // YouTube Link
  if (song.youtubeId) {
    y += lineHeight;
    doc.setTextColor(29, 185, 84);
    doc.text(`YouTube: https://youtube.com/watch?v=${song.youtubeId}`, 20, y);
  }
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text('Sñotify - Tu aplicación de música', 20, 280);
  
  // Guardar PDF
  doc.save(`${song.name} - ${song.artist}.pdf`);
}

export default exportSongToPDF;