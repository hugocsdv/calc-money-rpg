import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, List, ListItem, Paper, Box, Divider } from '@mui/material';

interface Loot {
  moeda: string;
  quantidade: string;
  descricao: string;
}

interface Jogador {
    id: number,
    nome: string
  }

interface JogadorLoot {
    jogador_id: string; // ID do jogador
    valor: string;      // Valor do tesouro
    tipo: string;       // Tipo do tesouro
    quantidade: number; // Quantidade do tesouro
  }

const TesouroIndividual: React.FC = () => {
  const [quantidadeMonstros, setQuantidadeMonstros] = useState<number>(1);
  const [ndMonstro, setNdMonstro] = useState<number>(1);
  const [lootResult, setLootResult] = useState<Loot[]>([]);
  const [jogadores, setJogadores] = useState<Jogador[]>(); // Lista de jogadores
  const [jogadorLoots, setJogadorLoots] = useState<JogadorLoot[]>([]); // Resultados do loot para cada jogador
  const [nomeJogador, setNomeJogador] = useState(''); // Estado para o nome do novo jogador

  
  // Função para carregar os jogadores da API
  const fetchJogadores = async () => {
    try {
      const response = await fetch('http://localhost:5000/jogadores');  // Rota da API para pegar os jogadores
      if (!response.ok) {
        throw new Error('Erro ao carregar jogadores');
      }
      const data = await response.json();

      setJogadores(data); // Atualiza o estado com a lista de jogadores
    } catch (error) {
      console.error('Erro ao carregar jogadores:', error);
    }
  };

  // Função para rolar o dado (D100)
  const rolarD100 = (): number => Math.floor(Math.random() * 100) + 1;

  // Função para rolar o tipo de moeda e quantidade de acordo com a tabela
  const rolarLootPorDesafio = (nd: number) => {
    let loot: Loot[] = [];
    
    // Definindo o intervalo de Tesouro Individual de acordo com o Desafio
    if (nd >= 0 && nd <= 4) {
      loot = rolarTesouroDesafio04();
    } else if (nd >= 5 && nd <= 10) {
      loot = rolarTesouroDesafio510();
    } else if (nd >= 11 && nd <= 16) {
      loot = rolarTesouroDesafio1116();
    } else if (nd >= 17) {
      loot = rolarTesouroDesafio17Plus();
    }

    setLootResult(loot);
   
    //setJogadorLoots(jogadores.map(jogador => ({ jogador_id: jogador, quantidade: '' })));

  };

  // Funções de Tesouro Individual para cada faixa de desafio
  const rolarTesouroDesafio04 = (): Loot[] => {
    let loot: Loot[] = [];
    const roll = rolarD100();

    if (roll <= 30) {
      loot.push({ moeda: 'PC', quantidade: '5d6 (17)', descricao: '30% chance' });
    } else if (roll <= 60) {
      loot.push({ moeda: 'PP', quantidade: '4d6 (14)', descricao: '30% chance' });
    } else if (roll <= 70) {
      loot.push({ moeda: 'PE', quantidade: '3d6 (10)', descricao: '10% chance' });
    } else if (roll <= 95) {
      loot.push({ moeda: 'PO', quantidade: '3d6 (10)', descricao: '25% chance' });
    } else {
      loot.push({ moeda: 'PL', quantidade: '1d6 (3)', descricao: '5% chance' });
    }
    return loot;
  };

  const rolarTesouroDesafio510 = (): Loot[] => {
    let loot: Loot[] = [];
    const roll = rolarD100();
    if (roll <= 30) {
      loot.push({ moeda: 'PC', quantidade: '4d6 x 100 (1.400)', descricao: '30% chance' });
      loot.push({ moeda: 'PE', quantidade: '1d6 x 10 (35)', descricao: '30% chance' });
    } else if (roll <= 60) {
      loot.push({ moeda: 'PP', quantidade: '6d6 x 10 (210)', descricao: '30% chance' });
      loot.push({ moeda: 'PO', quantidade: '2d6 x 10 (70)', descricao: '30% chance' });
    } else if (roll <= 70) {
      loot.push({ moeda: 'PE', quantidade: '3d6 x 10 (105)', descricao: '10% chance' });
      loot.push({ moeda: 'PO', quantidade: '2d6 x 10 (70)', descricao: '10% chance' });
    } else if (roll <= 95) {
      loot.push({ moeda: 'PO', quantidade: '4d6 x 10 (140)', descricao: '25% chance' });
    } else {
      loot.push({ moeda: 'PO', quantidade: '2d6 x 10 (70)', descricao: '5% chance' });
      loot.push({ moeda: 'PL', quantidade: '3d6 (10)', descricao: '5% chance' });
    }
    return loot;
  };

  const rolarTesouroDesafio1116 = (): Loot[] => {
    let loot: Loot[] = [];
    const roll = rolarD100();
    if (roll <= 20) {
      loot.push({ moeda: 'PP', quantidade: '4d6 x 100 (1.400)', descricao: '20% chance' });
      loot.push({ moeda: 'PO', quantidade: '1d6 x 100 (350)', descricao: '20% chance' });
    } else if (roll <= 35) {
      loot.push({ moeda: 'PE', quantidade: '1d6 x 100 (350)', descricao: '15% chance' });
      loot.push({ moeda: 'PO', quantidade: '1d6 x 100 (350)', descricao: '15% chance' });
    } else if (roll <= 75) {
      loot.push({ moeda: 'PO', quantidade: '2d6 x 100 (700)', descricao: '40% chance' });
      loot.push({ moeda: 'PL', quantidade: '1d6 x 10 (35)', descricao: '40% chance' });
    } else {
      loot.push({ moeda: 'PO', quantidade: '2d6 x 100 (700)', descricao: '25% chance' });
      loot.push({ moeda: 'PL', quantidade: '2d6 x 10 (70)', descricao: '25% chance' });
    }
    return loot;
  };

  const rolarTesouroDesafio17Plus = (): Loot[] => {
    let loot: Loot[] = [];
    const roll = rolarD100();
    if (roll <= 15) {
      loot.push({ moeda: 'PE', quantidade: '2d6 x 1.000 (7.000)', descricao: '15% chance' });
      loot.push({ moeda: 'PO', quantidade: '8d6 x 100 (2.800)', descricao: '15% chance' });
    } else if (roll <= 55) {
      loot.push({ moeda: 'PO', quantidade: '1d6 x 1.000 (3.500)', descricao: '40% chance' });
      loot.push({ moeda: 'PL', quantidade: '1d6 x 100 (350)', descricao: '40% chance' });
    } else {
      loot.push({ moeda: 'PO', quantidade: '1d6 x 1.000 (3.500)', descricao: '40% chance' });
      loot.push({ moeda: 'PL', quantidade: '2d6 x 100 (700)', descricao: '40% chance' });
    }
    return loot;
  };

  // Função para salvar o loot de cada jogador

  const salvarLootParaJogador = async (jogadorLoot: JogadorLoot) => {
    try {
      const response = await fetch('http://localhost:5000/salvar-tesouro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jogador_id: jogadorLoot.jogador_id,
          valor: jogadorLoot.valor,
          tipo: jogadorLoot.tipo,
          quantidade: jogadorLoot.quantidade,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao salvar tesouro do jogador');
      }
  
      const data = await response.json();
      console.log('Tesouro salvo com sucesso!', data);
    } catch (error) {
      console.error('Erro ao salvar tesouro do jogador:', error);
    }
  };
  

  const salvarJogador = async (nome: string) => {
    try {
      const response = await fetch('http://localhost:5000/salvar-jogador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome }),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao salvar jogador');
      }
  
      console.log('Jogador salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar jogador:', error);
    }
  };
  // Função para cadastrar um novo jogador (chama salvarJogador)
  const cadastrarJogador = (e: React.FormEvent) => {
    e.preventDefault(); // Impede o comportamento padrão de envio do formulário
    salvarJogador(nomeJogador); // Chama a função salvarJogador
  };

  useEffect(() => {
    // Chama a função para carregar os jogadores assim que o componente for carregado
    fetchJogadores();
  }, []);

  return (
    <Paper sx={{ padding: 4, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom align="center">
        Gerador de Tesouro D&D
      </Typography>

      <TextField
        label="Quantidade de monstros"
        type="number"
        value={quantidadeMonstros}
        onChange={(e) => setQuantidadeMonstros(Number(e.target.value))}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Nível de Desafio do monstro (ND)"
        type="number"
        value={ndMonstro}
        onChange={(e) => setNdMonstro(Number(e.target.value))}
        fullWidth
        margin="normal"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={() => rolarLootPorDesafio(ndMonstro)}
        fullWidth
        sx={{ marginTop: 2 }}
      >
        Rolar Tesouro
      </Button>

      {lootResult.length > 0 && (
        <Box sx={{ marginTop: '16px', padding: '16px', border: '1px solid #ddd', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#3f51b5' }}>
            Resultado do Tesouro:
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <List>
            {lootResult.map((loot, index) => (
              <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
                <Typography sx={{ fontWeight: 'bold' }}>{loot.moeda}</Typography>
                <Typography>{loot.quantidade}</Typography>
                <Typography sx={{ color: '#616161', fontSize: '0.9rem' }}>{loot.descricao}</Typography>
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Distribuir Loot:
          </Typography>
          {jogadores && jogadores.map((jogador, index) => (
            <Box key={index} sx={{ marginTop: 2 }}>
              <TextField
                label={`Loot para ${jogador.nome}`}
                type="number"
                onChange={(e) => {
                  const newLoots = [...jogadorLoots];
                  newLoots[index] = { ...newLoots[index], quantidade: Number(e.target.value) };
                  setJogadorLoots(newLoots);
                }}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="secondary"
                sx={{ marginTop: 1 }}
                onClick={() => salvarLootParaJogador(jogadorLoots[index])}
              >
                Salvar Loot para jogador
              </Button>
            </Box>
          ))}
        </Box>
      )}

      <div>
      <h1>Lista de Jogadores e Seus Loots</h1>

      {/* Formulário para cadastrar novos jogadores */}
      <form onSubmit={cadastrarJogador}>
        <div>
          <label htmlFor="nomeJogador">Nome do Jogador:</label>
          <input
            type="text"
            id="nomeJogador"
            value={nomeJogador}
            onChange={(e) => setNomeJogador(e.target.value)}
            required
          />
        </div>
        <button type="submit">Cadastrar Jogador</button>
      </form>

      {/* Exibindo os jogadores e seus loots */}
      <ul>
        {jogadorLoots.map((jogadorLoot) => (
          <li key={jogadorLoot.jogador_id}>
            {`Jogador: ${jogadorLoot.jogador_id} | Valor: ${jogadorLoot.valor} | Tipo: ${jogadorLoot.tipo} | Quantidade: ${jogadorLoot.quantidade}`}
          </li>
        ))}
      </ul>
    </div>
    </Paper>
    
  );
};

export default TesouroIndividual;
