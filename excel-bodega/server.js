const express = require('express');
const path = require('path');
const { generateBodegaExcel } = require('./excel-generator');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/excel/bodega', async (req, res) => {
  const { nombreBodega = 'Mi Bodega' } = req.body;
  const nombre = String(nombreBodega).replace(/[<>"'/\\]/g, '').trim().slice(0, 60) || 'Mi Bodega';

  try {
    const wb = await generateBodegaExcel(nombre);
    const fileName = `Bodega_${nombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al generar el archivo Excel' });
  }
});

app.listen(PORT, () => {
  console.log(`Excel Bodega corriendo en http://localhost:${PORT}`);
});
