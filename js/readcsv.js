const fs = require("fs");
const csv = require("csv-parser");

const inputFile = "statushistory.csv";   // archivo CSV de entrada
const resultados = [];

// Leer CSV con separador ";"
fs.createReadStream(inputFile)
  .pipe(csv({ separator: ";" }))
  .on("data", (fila) => {
    var x=0

    // Tomamos el valor de la columna penúltima: "Duración Hr."
    if (fila["Duración Hr."]) {
      x+=1
      resultados.push("x-"+x+"->"+fila["Duración Hr."]);
    }
  })
  .on("end", () => {
    console.log("✅ *** Valores del penúltimo campo (Duración Hr.):");
    console.log(resultados);
  }).on("error", (err) => {
    console.error("*** Error al leer CSV:", err);
  });