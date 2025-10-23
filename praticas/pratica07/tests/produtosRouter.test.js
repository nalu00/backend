const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Produto = require('../models/produtosModel');

let produtoId;

beforeAll(async () => {
  await mongoose.connection.close();
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_DATABASE } = process.env;
  const mongoURI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DATABASE}?retryWrites=true&w=majority`;
  await mongoose.connect(mongoURI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Testes da API /produtos', () => {
  test('POST /produtos deve criar um novo produto', async () => {
    const res = await request(app)
      .post('/produtos')
      .send({ nome: 'Laranja', preco: 10.0 });
    produtoId = res.body._id;
    expect(res.status).toBe(201);
    expect(res.body.nome).toBe('Laranja');
    expect(res.body.preco).toBe(10.0);
  });

  test('POST /produtos deve retornar 422 quando faltar nome e preço', async () => {
    const res = await request(app).post('/produtos').send({});
    expect(res.status).toBe(422);
    expect(res.body.msg).toBe('Nome e preço do produto são obrigatórios');
  });

  test('GET /produtos deve listar todos os produtos', async () => {
    const res = await request(app).get('/produtos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /produtos/:id deve retornar o produto correto', async () => {
    const res = await request(app).get(`/produtos/${produtoId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(produtoId);
  });

  test('GET /produtos/0 deve retornar 400', async () => {
    const res = await request(app).get('/produtos/0');
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe('Parâmetro inválido');
  });

  test('GET /produtos/000000000000000000000000 deve retornar 404', async () => {
    const res = await request(app).get('/produtos/000000000000000000000000');
    expect(res.status).toBe(404);
    expect(res.body.msg).toBe('Produto não encontrado');
  });

  test('PUT /produtos/:id deve atualizar um produto existente', async () => {
    const res = await request(app)
      .put(`/produtos/${produtoId}`)
      .send({ nome: 'Laranja Pera', preco: 18.0 });
    expect(res.status).toBe(200);
    expect(res.body.nome).toBe('Laranja Pera');
    expect(res.body.preco).toBe(18.0);
  });

  test('PUT /produtos/:id sem JSON deve retornar 422', async () => {
    const res = await request(app).put(`/produtos/${produtoId}`).send({});
    expect(res.status).toBe(422);
    expect(res.body.msg).toBe('Nome e preço do produto são obrigatórios');
  });

  test('PUT /produtos/0 deve retornar 400', async () => {
    const res = await request(app).put('/produtos/0').send({ nome: 'Teste', preco: 10 });
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe('Parâmetro inválido');
  });

  test('PUT /produtos/000000000000000000000000 deve retornar 404', async () => {
    const res = await request(app)
      .put('/produtos/000000000000000000000000')
      .send({ nome: 'Teste', preco: 10 });
    expect(res.status).toBe(404);
    expect(res.body.msg).toBe('Produto não encontrado');
  });

  test('DELETE /produtos/:id deve remover um produto existente', async () => {
    const res = await request(app).delete(`/produtos/${produtoId}`);
    expect(res.status).toBe(204);
  });

  test('DELETE /produtos/0 deve retornar 400', async () => {
    const res = await request(app).delete('/produtos/0');
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe('Parâmetro inválido');
  });

  test('DELETE /produtos/000000000000000000000000 deve retornar 404', async () => {
    const res = await request(app).delete('/produtos/000000000000000000000000');
    expect(res.status).toBe(404);
    expect(res.body.msg).toBe('Produto não encontrado');
  });
});
