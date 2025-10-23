const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    minlength: [3, 'O nome deve ter no mínimo 3 caracteres']
  },
  preco: {
    type: Number,
    required: [true, 'O preço é obrigatório']
  }
});

const Produto = mongoose.model('Produto', schema);

module.exports = Produto;
