const request = require('supertest');
const app = require('../app');

describe('Testes da API REST', () => {
  let token;

  test('GET /produtos sem token deve retornar 401 e msg "Não autorizado"', async () => {
    const res = await request(app).get('/produtos');
    expect(res.status).toBe(401);
    expect(res.body.msg).toBe("Não autorizado");
  });

  test('GET /produtos com token inválido deve retornar 401 e msg "Token inválido"', async () => {
    const res = await request(app)
      .get('/produtos')
      .set('authorization', '123456789');
    expect(res.status).toBe(401);
    expect(res.body.msg).toBe("Token inválido");
  });

  test('POST /usuarios/login deve retornar 200 e conter token', async () => {
    const res = await request(app)
      .post('/usuarios/login')
      .send({ usuario: "email@exemplo.com", senha: "abcd1234" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test('GET /produtos com token válido deve retornar 200', async () => {
    const res = await request(app)
      .get('/produtos')
      .set('authorization', token);
    expect(res.status).toBe(200);
  });

  test('POST /usuarios/renovar deve retornar novo token', async () => {
    const res = await request(app)
      .post('/usuarios/renovar')
      .set('authorization', token);
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });
});
