const request = require('supertest');
const app = require('../app');

let tarefaId;

describe('API Tarefas', () => {
  test('GET /tarefas deve retornar 200 e JSON', async () => {
    const res = await request(app).get('/tarefas');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test('POST /tarefas cria tarefa', async () => {
    const res = await request(app)
      .post('/tarefas')
      .send({ nome: 'Estudar Node', concluida: false });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    tarefaId = res.body.id;
  });

  test('GET /tarefas/:id retorna tarefa', async () => {
    const res = await request(app).get(`/tarefas/${tarefaId}`);
    expect(res.statusCode).toBe(200);
  });

  test('GET /tarefas/1 retorna 404', async () => {
    const res = await request(app).get('/tarefas/1');
    expect(res.statusCode).toBe(404);
  });

  test('PUT /tarefas/:id atualiza tarefa', async () => {
    const res = await request(app)
      .put(`/tarefas/${tarefaId}`)
      .send({ nome: 'Estudar Node e Express', concluida: true });
    expect(res.statusCode).toBe(200);
  });

  test('PUT /tarefas/1 retorna 404', async () => {
    const res = await request(app)
      .put('/tarefas/1')
      .send({ nome: 'Teste', concluida: true });
    expect(res.statusCode).toBe(404);
  });

  test('DELETE /tarefas/:id remove tarefa', async () => {
    const res = await request(app).delete(`/tarefas/${tarefaId}`);
    expect(res.statusCode).toBe(204);
  });

  test('DELETE /tarefas/1 retorna 404', async () => {
    const res = await request(app).delete('/tarefas/1');
    expect(res.statusCode).toBe(404);
  });
});
