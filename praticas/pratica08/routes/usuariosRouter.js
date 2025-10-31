const express = require('express');
const { gerarToken, verificarToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', (req, res) => {
  const { usuario } = req.body;
  const token = gerarToken({ email: usuario });
  res.status(200).json({ token });
});

router.post('/renovar', verificarToken, (req, res) => {
  const token = gerarToken({ email: req.usuario.email });
  res.status(200).json({ token });
});

module.exports = router;
