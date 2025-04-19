// Importando dependências
import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

// Inicializando o app Express
const app = express();
app.use(express.json());
app.use(cors({
    origin: '*',  // Permite todas as origens
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'],  // Cabeçalhos permitidos
  })); // Para permitir requisições do frontend

// Inicializando o banco de dados SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
    } else {
        console.log('Banco de dados aberto com sucesso.');
    }
});

// Criando a tabela tesouro com a coluna jogador_id, caso não exista
db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS tesouro (
          id INTEGER PRIMARY KEY, 
          jogador_id INTEGER, 
          valor INTEGER, 
          tipo TEXT, 
          quantidade INTEGER
      )
    `);
  
    db.run(`
      CREATE TABLE IF NOT EXISTS jogador (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        foto TEXT
      )
    `);
  });

// Rota para salvar o tesouro no banco de dados
app.post('/salvar-tesouro', (req, res) => {
    const { jogador_id, valor, tipo, quantidade } = req.body;

    // Verificando se os campos necessários foram passados
    if (!jogador_id || !valor || !tipo || !quantidade) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // Inserindo os dados na tabela 'tesouro', com identificação do jogador
    const stmt = db.prepare('INSERT INTO tesouro (jogador_id, valor, tipo, quantidade) VALUES (?, ?, ?, ?)');
    stmt.run(jogador_id, valor, tipo, quantidade, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ id: this.lastID, jogador_id, valor, tipo, quantidade });
        }
    });
    stmt.finalize();
});

// Rota para obter todos os resultados armazenados
app.get('/resultados', (req, res) => {
    db.all('SELECT * FROM tesouro', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(rows);
        }
    });
});

// Rota para salvar um novo jogador no banco de dados
app.post('/salvar-jogador', (req, res) => {
    const { nome } = req.body;
    console.log(nome + "  ------")
    if (!nome) {
        return res.status(400).json({ error: 'O nome do jogador é obrigatório.' });
    }

    const stmt = db.prepare('INSERT INTO jogador (nome) VALUES (?)');
    stmt.run(nome, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ id: this.lastID, nome, loot: 0 });
        }
    });
    stmt.finalize();
});

// Rota para obter todos os jogadores
app.get('/jogadores', (req, res) => {
    db.all('SELECT * FROM jogador', (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        if (rows.length === 0) {
          return res.status(404).json({ message: 'Nenhum jogador encontrado.' });
        }
        res.status(200).json(rows);  // Retorna todos os jogadores
      }
    });
  });

// Rota para obter todos os resultados de todos os jogadores
app.get('/resultados', (req, res) => {
    db.all('SELECT * FROM tesouro', (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        if (rows.length === 0) {
          return res.status(404).json({ message: 'Nenhum resultado encontrado.' });
        }
        res.status(200).json(rows);  // Retorna todos os resultados
      }
    });
  });

// Iniciando o servidor na porta 5000
app.listen(5000, () => {
    console.log('Servidor backend rodando na porta 5000');
});
