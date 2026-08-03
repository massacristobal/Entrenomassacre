// Genera data/exercises-es.json para EntrenoMassa a partir de
// https://github.com/hasaneyldrm/exercises-dataset
//
// Uso: parado en la raíz de tu repo EntrenoMassa, corre:
//   node build-exercise-db.js
// Requiere Node 18+ (usa fetch nativo). Necesita internet.

const fs = require('fs');
const path = require('path');

const RAW_BASE = 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main';

async function main() {
  console.log('Descargando data/exercises.json (puede tardar unos segundos)...');
  const res = await fetch(`${RAW_BASE}/data/exercises.json`);
  if (!res.ok) throw new Error(`Fetch falló: ${res.status}`);
  const data = await res.json();
  console.log(`${data.length} ejercicios descargados. Recortando a lo esencial en español...`);

  const trimmed = data.map(ex => ({
    id: ex.id,
    name: ex.name,
    category: ex.category,
    body_part: ex.body_part,
    equipment: ex.equipment,
    target: ex.target,
    muscle_group: ex.muscle_group,
    secondary_muscles: ex.secondary_muscles || [],
    instructions_es: ex.instructions?.es || '',
    steps_es: ex.instruction_steps?.es || [],
    // apuntamos directo al repo original en vez de copiar los archivos binarios
    image: `${RAW_BASE}/${ex.image}`,
    gif_url: `${RAW_BASE}/${ex.gif_url}`,
  }));

  const outDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'exercises-es.json');
  fs.writeFileSync(outPath, JSON.stringify(trimmed));

  const sizeMB = (fs.statSync(outPath).size / 1024 / 1024).toFixed(2);
  console.log(`Listo: ${outPath} (${trimmed.length} ejercicios, ${sizeMB} MB)`);
  console.log('Ahora haz commit + push de data/exercises-es.json a tu repo EntrenoMassa.');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
