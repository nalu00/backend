const { Tarefa } = require("./modelo");

async function adicionarTarefa(nome) {
    const tarefa = new Tarefa(nome);
    await tarefa.init();    
    await tarefa.inserir();
}

async function buscarTarefa(nome) {
    const tarefa = new Tarefa(nome);
    await tarefa.init();
    return await tarefa.buscar();
}

async function atualizarTarefa(nome, concluida) {
    const tarefa = new Tarefa(nome);
    await tarefa.init();
    const resultado = await tarefa.buscar();
    if (resultado) {
        tarefa.concluida = concluida;
        await tarefa.alterar();
    }
}

async function removerTarefa(nome) {
    const tarefa = new Tarefa(nome);
    await tarefa.init();
    const resultado = await tarefa.buscar();
    if (resultado) {
        await tarefa.deletar();
    }
}

module.exports = { adicionarTarefa, buscarTarefa, atualizarTarefa, removerTarefa };
