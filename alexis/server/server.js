const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());

// Redirección desde la raíz a tu página HTML
app.get('/', (req, res) => {
  res.redirect('http://127.0.0.1:5500/tabla_ab.html');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});