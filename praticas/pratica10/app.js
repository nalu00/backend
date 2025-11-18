require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');

const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const {
  MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_DATABASE, PORT
} = process.env;

const mongoUserPart = MONGODB_USER ? `${encodeURIComponent(MONGODB_USER)}:${encodeURIComponent(MONGODB_PASSWORD)}@` : '';
const mongoHost = MONGODB_HOST || 'localhost:27017';
const mongoDB = MONGODB_DATABASE || 'pratica10';
const mongoUri = `mongodb+srv://${mongoUserPart}${mongoHost}/${mongoDB}?retryWrites=true&w=majority`;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar MongoDB:', err.message));

const usuariosRouter = require('./routes/usuariosRouter');
const apidocsRouter = require('./routes/apidocsRouter');

app.use('/usuarios', usuariosRouter);
app.use('/api-docs', apidocsRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ message: err.message });
});

module.exports = app;
