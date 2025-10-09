const { MongoClient } = require("mongodb");

const url = 'mongodb+srv://user_pratica6:pratica06@cluster0.hmeehox.mongodb.net/';

const client = new MongoClient(url);

async function conectarDb() {
    try {
        await client.connect();
        console.log("Conectado ao MongoDB Atlas!");
        return client.db("agenda"); 
    } catch (err) {
        console.error("Erro ao conectar no MongoDB:", err);
    }
}

module.exports = { conectarDb };
