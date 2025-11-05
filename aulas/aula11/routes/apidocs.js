const express = require('express');
const YAML = require('yaml');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');

// carregar o arquivo swagger.yaml
const file = fs.readFileSync("./swagger.yaml", "utf8");

// valida o formato YAML
const swaggerDoc = YAML.parse(file);

// cria middleware de rota
const router = express.Router();

// carrega a aplicacao do swagger UI
router.use("/", swaggerUi.serve);

//renderiza a documentacao
router.get("/", swaggerUi.setup(swaggerDoc));

module.exports = router;