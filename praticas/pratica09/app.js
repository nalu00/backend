const express = require('express');
const apidocsRouter = require('./routes/apidocsRouter');

const app = express();

app.use(express.json());
app.use('/api-docs', apidocsRouter);

// rota simples exemplo (opcional)
app.get('/', (req, res) => res.send('API pronta'));

module.exports = app;
