const fs = require("fs");
const path = require("path");

// Mapeo de nombres de expansión a prefijos OCR que aparecen en las cartas físicas
const EXPANSION_MAP = {
  Ancestros: "Ancestros",
  "Trono Compartido": "Trono",
  "Pacto Secreto": "Pacto S",
  "Hermandad en Berin": "Hermandad",
  Cataclismo: "Cataclismo",
  Imperio: "Imperio",
  Profundidades: "Profundidades",
};

// Directorio de CSVs y output
const CSV_DIR = path.join(__dirname, "..", "assets", "lairen");
const OUTPUT_FILE = path.join(__dirname, "..", "src", "data", "lairen_db.json");

/**
 * Extrae el nombre de la expansión del nombre de archivo
 * Ejemplo: "Lairen Registro - Trono Compartido.csv" -> "Trono Compartido"
 */
function extractExpansionName(filename) {
  return filename.replace("Lairen Registro - ", "").replace(".csv", "");
}

/**
 * Obtiene el prefijo OCR desde el mapa o usa la primera palabra como fallback
 */
function getOcrPrefix(expansionName) {
  if (EXPANSION_MAP[expansionName]) {
    return EXPANSION_MAP[expansionName];
  }
  // Fallback: usar primera palabra
  return expansionName.split(" ")[0];
}

/**
 * Parsea una línea CSV simple
 * Maneja comillas y comas dentro de campos
 */
function parseCSVLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  fields.push(current.trim());
  return fields;
}

/**
 * Procesa un archivo CSV y retorna array de cartas
 */
function processCSV(filePath, expansionName, ocrPrefix) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split(/\r?\n/).filter((line) => line.trim());

  // Ignorar header
  const dataLines = lines.slice(1);

  // Paso 1: Procesar todas las líneas primero para obtener cartas válidas
  const tempCards = [];

  for (const line of dataLines) {
    const fields = parseCSVLine(line);
    const nro = fields[0];
    const nombre = fields[1];
    const tipo = fields[2];

    if (!nro || !nombre || !tipo) continue;

    const id_numero = parseInt(nro, 10);
    if (isNaN(id_numero)) continue;

    tempCards.push({
      expansion: expansionName,
      ocr_prefix: ocrPrefix,
      id_numero: id_numero,
      nombre: nombre,
      tipo: tipo,
      // Aún no ponemos el total
    });
  }

  // Paso 2: Encontrar el ID más alto de esta expansión (Ej: 120)
  // Esto simula el denominador "X/120" que aparece impreso
  const maxId = tempCards.reduce(
    (max, card) => Math.max(max, card.id_numero),
    0,
  );

  // Paso 3: Asignar ese total real a todas las cartas
  return tempCards.map((card) => ({
    ...card,
    total: maxId,
  }));
}

/**
 * Función principal
 */
function generateDatabase() {
  console.log("🚀 Iniciando generación de base de datos Lairen...\n");

  // Leer archivos CSV
  const files = fs.readdirSync(CSV_DIR).filter((f) => f.endsWith(".csv"));

  console.log(`📁 Archivos CSV encontrados: ${files.length}\n`);

  let allCards = [];

  for (const file of files) {
    const filePath = path.join(CSV_DIR, file);
    const expansionName = extractExpansionName(file);
    const ocrPrefix = getOcrPrefix(expansionName);

    console.log(`📖 Procesando: ${file}`);
    console.log(`   Expansión: ${expansionName}`);
    console.log(`   OCR Prefix: ${ocrPrefix}`);

    const cards = processCSV(filePath, expansionName, ocrPrefix);

    console.log(`   ✅ ${cards.length} cartas procesadas\n`);

    allCards = allCards.concat(cards);
  }

  // Crear directorio de salida si no existe
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Escribir JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allCards, null, 2), "utf-8");

  console.log("═══════════════════════════════════════════════════");
  console.log(`✨ Base de datos generada exitosamente!`);
  console.log(`📊 Total de cartas: ${allCards.length}`);
  console.log(`📁 Archivo: ${OUTPUT_FILE}`);
  console.log("═══════════════════════════════════════════════════\n");

  // Mostrar resumen por expansión
  const expansionCounts = {};
  for (const card of allCards) {
    if (!expansionCounts[card.expansion]) {
      expansionCounts[card.expansion] = 0;
    }
    expansionCounts[card.expansion]++;
  }

  console.log("📈 Resumen por expansión:");
  for (const [expansion, count] of Object.entries(expansionCounts)) {
    const ocrPrefix = getOcrPrefix(expansion);
    console.log(`   ${expansion} (${ocrPrefix}): ${count} cartas`);
  }
  console.log("");
}

// Ejecutar
try {
  generateDatabase();
} catch (error) {
  console.error("❌ Error generando base de datos:", error);
  process.exit(1);
}
