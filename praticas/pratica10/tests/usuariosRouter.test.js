const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

let createdId;
let token;

beforeAll(async () => {
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('/usuarios', () => {
  test('POST /usuarios cria usuário e retorna 201 JSON com _id e email', async () => {
    const res = await request(app)
      .post('/usuarios')
      .send({ email: 'usuario@email.com', senha: 'abcd1234' })
      .set('Accept', 'application/json');

    expect(res.status).toBe(201);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.email).toBe('usuario@email.com');

    createdId = res.body._id;
  });

  test('POST /usuarios sem body retorna 422 com msg', async () => {
    const res = await request(app)
      .post('/usuarios')
      .send({})
      .set('Accept', 'application/json');

    expect(res.status).toBe(422);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toHaveProperty('msg', 'Email e Senha são obrigatórios');
  });

  test('POST /usuarios/login com credenciais válidas retorna 200 e token', async () => {
    const res = await request(app)
      .post('/usuarios/login')
      .send({ usuario: 'usuario@email.com', senha: 'abcd1234' })
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  test('POST /usuarios/login sem body retorna 401 com msg', async () => {
    const res = await request(app)
      .post('/usuarios/login')
      .send({})
      .set('Accept', 'application/json');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('msg', 'Credenciais inválidas');
  });

  test('POST /usuarios/renovar com token válido retorna 200 e token', async () => {
    const res = await request(app)
      .post('/usuarios/renovar')
      .set('authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /usuarios/renovar com token inválido retorna 401 e msg', async () => {
    const res = await request(app)
      .post('/usuarios/renovar')
      .set('authorization', 'Bearer 123456789');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('msg', 'Token invalido' || 'Token inválido');
  });

  test('DELETE /usuarios com token e body usuario retorna 204', async () => {
    const res = await request(app)
      .delete('/usuarios')
      .set('authorization', `Bearer ${token}`)
      .send({ usuario: 'usuario@email.com' });

    expect(res.status).toBe(204);
  });
});
