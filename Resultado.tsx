import React, { useState } from 'react';
import axios from 'axios';

const Resultado: React.FC = () => {
    const [valor, setValor] = useState<number>(0);
    const [tipo, setTipo] = useState<string>('');
    const [quantidade, setQuantidade] = useState<number>(0);
    const [responseMessage, setResponseMessage] = useState<string>('');

    const salvarResultado = async () => {
        try {
            const response = await axios.post('http://localhost:5000/salvar-tesouro', {
                valor,
                tipo,
                quantidade,
            });
            setResponseMessage(`Resultado salvo com ID: ${response.data.id}`);
        } catch (error) {
            setResponseMessage('Erro ao salvar o resultado');
            console.error(error);
        }
    };

    return (
        <div className="p-4 bg-gray-100 rounded-md shadow-md">
            <h1 className="text-2xl font-bold">Salvar Resultado</h1>
            <div className="mt-4">
                <label htmlFor="valor" className="block text-sm font-medium">Valor</label>
                <input
                    type="number"
                    id="valor"
                    className="mt-1 p-2 border rounded-md"
                    value={valor}
                    onChange={(e) => setValor(Number(e.target.value))}
                />
            </div>
            <div className="mt-4">
                <label htmlFor="tipo" className="block text-sm font-medium">Tipo</label>
                <input
                    type="text"
                    id="tipo"
                    className="mt-1 p-2 border rounded-md"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                />
            </div>
            <div className="mt-4">
                <label htmlFor="quantidade" className="block text-sm font-medium">Quantidade</label>
                <input
                    type="number"
                    id="quantidade"
                    className="mt-1 p-2 border rounded-md"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                />
            </div>
            <button
                onClick={salvarResultado}
                className="mt-4 bg-blue-500 text-white p-2 rounded-md"
            >
                Salvar
            </button>
            {responseMessage && <p className="mt-2 text-green-500">{responseMessage}</p>}
        </div>
    );
};

export default Resultado;
