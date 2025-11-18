const { gerarToken, cifrarSenha, compararSenha } = require('../middlewares/authMiddleware');
const Usuario = require('../models/usuariosModel');

async function criar(req, res) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(422).json({ msg: 'Email e Senha são obrigatórios' });

    const senhaCifrada = cifrarSenha(senha);
    const novoUsuario = await Usuario.create({ email, senha: senhaCifrada });
    return res.status(201).json({ _id: novoUsuario._id, email: novoUsuario.email });
  } catch (err) {
    return res.status(422).json({ msg: 'Email e Senha são obrigatórios' });
  }
}

async function entrar(req, res) {
  try {
    const { usuario, senha } = req.body;
    if (!usuario || !senha) return res.status(401).json({ msg: 'Credenciais inválidas' });

    const usuarioEncontrado = await Usuario.findOne({ email: usuario });
    if (!usuarioEncontrado) return res.status(401).json({ msg: 'Credenciais inválidas' });

    const ok = compararSenha(senha, usuarioEncontrado.senha);
    if (!ok) return res.status(401).json({ msg: 'Credenciais inválidas' });

    const token = gerarToken({ email: usuario });
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(401).json({ msg: 'Credenciais inválidas' });
  }
}

async function renovar(req, res) {
  try {
    const email = req.usuario;
    const token = gerarToken({ email });
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(401).json({ msg: 'Token invalido' });
  }
}

async function remover(req, res) {
  try {
    const { usuario } = req.body;
    await Usuario.findOneAndDelete({ email: usuario });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ msg: 'Erro ao remover' });
  }
}

module.exports = {
  criar,
  entrar,
  renovar,
  remover
};
