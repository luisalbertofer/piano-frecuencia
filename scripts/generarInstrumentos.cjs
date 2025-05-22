const fs = require("fs");
const path = require("path");

const samplesPath = path.join(__dirname, "../public/samples/audio");
const outputPath = path.join(__dirname, "../src/data");

// 🎵 Mapeo para nombre en español
const nombreMusical = {
  "C": "do", "C#": "do♯",
  "D": "re", "D#": "re♯",
  "E": "mi",
  "F": "fa", "F#": "fa♯",
  "G": "sol", "G#": "sol♯",
  "A": "la", "A#": "la♯",
  "B": "si"
};

// 🎯 Obtener número MIDI
const notaAMidi = (nota) => {
  const match = nota.match(/^([A-G])(#?)(\d)$/);
  if (!match) return null;
  const [_, letra, alter, octava] = match;
  const semitonos = {
    C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11
  };
  return (parseInt(octava) + 1) * 12 + semitonos[letra] + (alter === "#" ? 1 : 0);
};

// 🎼 Calcular frecuencia desde MIDI
const midiAFreq = (midi) => {
  return +(440 * Math.pow(2, (midi - 69) / 12)).toFixed(2);
};

// 🔁 Recorre cada carpeta de instrumento
fs.readdirSync(samplesPath).forEach((folder) => {
  const folderPath = path.join(samplesPath, folder);
  if (!fs.statSync(folderPath).isDirectory()) return;

  const archivos = fs.readdirSync(folderPath).filter(f => f.endsWith(".mp3"));
  const samplerData = {};
  const notesData = [];

  archivos.forEach(file => {
    const match = file.match(/^([A-Ga-g])(#|s)?(\d)\.mp3$/);
    if (!match) return;

    const [_, nota, alter, octava] = match;
    const notaBase = nota.toUpperCase();
    const alteracion = alter === "s" ? "#" : (alter || "");
    const notaFinal = `${notaBase}${alteracion}${octava}`;

    // 🔁 Archivo para Sampler
    samplerData[notaFinal] = file;

    // 🎼 Datos de nota
    const midi = notaAMidi(notaFinal);
    const freq = midiAFreq(midi);
    const nombre = nombreMusical[notaBase + alteracion] || notaFinal;

    notesData.push({ note: notaFinal, freq, name: nombre });
  });

  const safeName = folder.replace(/-/g, "_");
  const samplerJs = `const ${safeName} = ${JSON.stringify(samplerData, null, 2)};\n\nexport default ${safeName};\n`;
  const notesJs = `export const notes_${safeName} = ${JSON.stringify(notesData, null, 2)};\n`;

  fs.writeFileSync(path.join(outputPath, `${folder}.js`), samplerJs);
  fs.writeFileSync(path.join(outputPath, `notes_${folder}.js`), notesJs);

  console.log(`✅ Generado: ${folder}.js y notes_${folder}.js (${notesData.length} notas)`);
});
