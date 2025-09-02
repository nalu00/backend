const { calcularMediaAluno } = require('../src/calcularMediaAluno');

test('calcularMediaAluno deve estar definida', () => {
  expect(calcularMediaAluno).toBeDefined();
});


test('lança erro se a1 ou a2 forem negativos', () => {
  expect(() => calcularMediaAluno(-1, 5)).toThrow('Notas a1 ou a2 não podem ser negativas');
  expect(() => calcularMediaAluno(5, -2)).toThrow('Notas a1 ou a2 não podem ser negativas');
});


test('cálculo base quando a3 é indefinida: a1*0.4 + a2*0.6', () => {
  const media = calcularMediaAluno(5, 7); 
  expect(media).toBeCloseTo(5 * 0.4 + 7 * 0.6);
});


test('lança erro se a3 for negativa', () => {
  expect(() => calcularMediaAluno(6, 7, -1)).toThrow('Nota a3 não pode ser negativa');
});


test('quando a3 é informada e a melhor combinação é a1 com a3', () => {
  const media = calcularMediaAluno(8, 3, 9);
  expect(media).toBeCloseTo(8 * 0.4 + 9 * 0.6); 
});


test('quando a3 é informada e a melhor combinação é a3 com a2', () => {
  const media = calcularMediaAluno(3, 8, 9);
  expect(media).toBeCloseTo(9 * 0.4 + 8 * 0.6); 
});