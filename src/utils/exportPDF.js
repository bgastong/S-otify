import { jsPDF } from 'jspdf';

export function exportSongToPDF(song) {
  const doc = new jsPDF();
  
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