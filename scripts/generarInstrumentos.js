const fs = require("fs");
const path = require("path");

// Ruta base a las carpetas de instrumentos
const samplesPath = path.join(__dirname, "../public/samples/audio");

// Regex para extraer notas válidas como C4, D#5, etc.
const notaRegex = /^([A-Ga-g])([#s]?)(\d)\.mp3$/;

function formatearNota(nombre) {
  const match = nombre.match(notaRegex);
  if (!match) return null;
  const [_, nota, alteracion, octava] = match;
  const cleanNote = nota.toUpperCase() + (alteracion === "s" ? "#" : alteracion) + octava;
  return cleanNote;
}

fs.readdirSync(samplesPath).forEach((folder) => {
  const folderPath = path.join(samplesPath, folder);
  const outputPath = path.join(__dirname, `../src/data/${folder}.js`);

  if (!fs.statSync(folderPath).isDirectory()) return;

  const archivos = fs.readdirSync(folderPath).filter(file => file.endsWith(".mp3"));
  const notas = {};

  archivos.forEach((file) => {
    const clave = formatearNota(file);
    if (clave) {
      notas[clave] = file;
    }
  });

  const contenido = `const ${folder.replace(/-/g, "_")} = ${JSON.stringify(notas, null, 2)};\n\nexport default ${folder.replace(/-/g, "_")};\n`;

  fs.writeFileSync(outputPath, contenido);
  console.log(`✅ Generado: ${folder}.js (${Object.keys(notas).length} notas)`);
});
