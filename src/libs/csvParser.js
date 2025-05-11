export async function parseCSV(file) {
  if (!file || !file.buffer) {
    throw new Error("Archivo no encontrado o no se cargó correctamente");
  }

  const data = file.buffer.toString("utf-8");

  const rows = data.split("\n");

  const headers = rows[0].split(",").map((header) => header.trim());
  const records = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].trim();
    if (row) {
      const columns = row.split(",").map((column) => column.trim());
      const record = {};

      headers.forEach((header, index) => {
        record[header] = columns[index] || "";
      });

      records.push(record);
    }
  }

  return records;
}
