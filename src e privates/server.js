const express = require('express');
const cors = require('cors');
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://esp32-3ce2b-default-rtdb.firebaseio.com'
});

const app = express();
const db = admin.database();

app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.post("/led", async (req, res) => {
  const { state } = req.body;
  try {
    await db.ref('led').set({ state });
    res.status(200).send("LED atualizado");
  } catch (error) {
    res.status(500).send("Erro ao atualizar LED");
  }
});

app.post('/historico', async (req, res) => {
  const { dataHora } = req.body;
  try {
    await db.ref("historico").push({ dataHora });
    res.status(200).send("Histórico salvo");
  } catch (error) {
    res.status(500).send("Erro ao salvar histórico");
  }
});

app.get('/led', async (req, res) => {
  try {
    const snapshot = await db.ref('led/state').once('value');
    const state = snapshot.val();
    res.status(200).json({ state });
  } catch (error) {
    res.status(500).send("Erro ao obter estado do LED");
  }
});


app.get('/historico', async (req, res) => {
  try {
    const snapshot = await db.ref('historico').once('value');
    const dados = [];
    snapshot.forEach(child => dados.push(child.val()));
    res.json(dados);
  } catch (error) {
    res.status(500).send("Erro ao obter histórico")
  }
});

const port = 3000;

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});