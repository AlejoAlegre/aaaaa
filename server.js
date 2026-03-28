require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');
const { generateBodegaExcel } = require('./excel-generator');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Eres un asistente virtual inteligente y útil. Puedes responder cualquier pregunta sobre cualquier tema: ciencia, historia, tecnología, matemáticas, cultura, entretenimiento, consejos, programación, idiomas, o lo que sea que el usuario necesite.
Sé amable, claro y conciso. Si no sabes algo, dilo honestamente.
Responde siempre en el mismo idioma que use el usuario.`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Error calling Claude API:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error al comunicarse con el asistente' });
    }
  }
});

// Excel generation endpoint
app.post('/api/excel/bodega', async (req, res) => {
  const { nombreBodega = 'Mi Bodega' } = req.body;

  // Sanitize input
  const nombre = String(nombreBodega).replace(/[<>"'/\\]/g, '').trim().slice(0, 60) || 'Mi Bodega';

  try {
    const wb = await generateBodegaExcel(nombre);
    const fileName = `Bodega_${nombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error generando Excel:', err);
    res.status(500).json({ error: 'Error al generar el archivo Excel' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
