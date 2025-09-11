const express = require("express");
const app = express();

// Array de tarefas em memória
let tarefas = [
  { id: 1, nome: "Estudar middleware", concluida: false },
  { id: 2, nome: "Praticar Express", concluida: true },
];

// Middleware para processar JSON
app.use(express.json());

// Middleware de log de requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Router de tarefas
const router = express.Router();

// GET 
router.get("/", (req, res) => {
  res.json(tarefas);
});

// POST 
router.post("/", (req, res) => {
  const novaTarefa = {
    id: tarefas.length + 1,
    nome: req.body.nome,
    concluida: req.body.concluida || false,
  };
  tarefas.push(novaTarefa);
  res.status(201).json(novaTarefa);
});

// GET 
router.get("/:tarefaId", (req, res, next) => {
  const tarefa = tarefas.find((t) => t.id == req.params.tarefaId);
  if (!tarefa) return next(new Error("Tarefa não localizada"));
  res.json(tarefa);
});

// PUT 
router.put("/:tarefaId", (req, res, next) => {
  const tarefa = tarefas.find((t) => t.id == req.params.tarefaId);
  if (!tarefa) return next(new Error("Tarefa não localizada"));
  tarefa.nome = req.body.nome ?? tarefa.nome;
  tarefa.concluida = req.body.concluida ?? tarefa.concluida;
  res.json(tarefa);
});

// DELETE 
router.delete("/:tarefaId", (req, res, next) => {
  const index = tarefas.findIndex((t) => t.id == req.params.tarefaId);
  if (index === -1) return next(new Error("Tarefa não localizada"));
  tarefas.splice(index, 1);
  res.status(204).send();
});

// Router
app.use("/tarefas", router);

// Middleware de erro
app.use((err, req, res, next) => {
  res.status(400).json({ erro: err.message });
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

module.exports = app;
