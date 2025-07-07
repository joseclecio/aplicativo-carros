// /frontend/src/pages/Particulares.page.jsx
import React, { useState, useEffect } from 'react';
import { getVeiculosParticulares } from '../api/veiculo.api';
// Supondo que você tenha um componente de Card
import CardVeiculo from '../components/CardVeiculo.jsx';

const ParticularesPage = () => {
    const [veiculos, setVeiculos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Função para buscar os dados quando o componente é montado
        const fetchVeiculos = async () => {
            try {
                setLoading(true);
                const response = await getVeiculosParticulares();
                setVeiculos(response.data);
            } catch (error) {
                console.error("Erro ao buscar veículos particulares:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVeiculos();
    }, []); // O array vazio [] garante que isso rode apenas uma vez

    if (loading) {
        return <div>Carregando veículos...</div>;
    }

    return (
        <div className="container-veiculos">
            <h1>Veículos de Vendedores Particulares</h1>
            <div className="lista-cards">
                {veiculos.map(veiculo => (
                    <CardVeiculo key={veiculo._id} veiculo={veiculo} />
                ))}
            </div>
        </div>
    );
};

export default ParticularesPage;