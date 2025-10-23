const mongoose = require('mongoose');
const Produto = require('../models/produtosModel');

async function criar(req, res) {
  try {
    const { nome, preco } = req.body;
    if (!nome || !preco) throw new Error();
    const novoProduto = await Produto.create({ nome, preco });
    res.status(201).json(novoProduto);
  } catch (error) {
    res.status(422).json({ msg: 'Nome e preço do produto são obrigatórios' });
  }
}

async function listar(req, res) {
  const produtosCadastrados = await Produto.find({});
  res.status(200).json(produtosCadastrados);
}

async function buscar(req, res, next) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'Parâmetro inválido' });
  }

  const produtoEncontrado = await Produto.findById(id);
  if (!produtoEncontrado) {
    return res.status(404).json({ msg: 'Produto não encontrado' });
  }

  req.produto = produtoEncontrado;
  next();
}

async function exibir(req, res) {
  res.status(200).json(req.produto);
}

async function atualizar(req, res) {
  try {
    const { id } = req.params;
    const { nome, preco } = req.body;
    if (!nome || !preco) throw new Error();

    const produtoAtualizado = await Produto.findOneAndUpdate(
      { _id: id },
      { nome, preco },
      { new: true, runValidators: true }
    );

    if (!produtoAtualizado) {
      return res.status(404).json({ msg: 'Produto não encontrado' });
    }

    res.status(200).json(produtoAtualizado);
  } catch (error) {
    res.status(422).json({ msg: 'Nome e preço do produto são obrigatórios' });
  }
}

async function remover(req, res) {
  const { id } = req.params;
  await Produto.findOneAndDelete({ _id: id });
  res.status(204).send();
}

module.exports = { criar, listar, buscar, exibir, atualizar, remover };
