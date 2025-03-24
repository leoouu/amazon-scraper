// Importando as bibliotecas 
const express = require('express'); 
const axios = require('axios'); 
const { JSDOM } = require('jsdom'); 

const app = express(); // Inicializa o servidor Express
const PORT = 3000; // Define a porta onde o servidor será executado

// Servindo os arquivos estáticos do diretório 'public' (Frontend)
app.use(express.static('public'));

// Rota para realizar scraping na Amazon
app.get('/api/scrape', async (req, res) => {
    const keyword = req.query.keyword; 

    // Se não tiver palavra-chave na requisição, retorna erro
    if (!keyword) {
        return res.status(400).json({ error: 'Por favor, informe um termo de pesquisa.' });
    }

    try {
        // Fazendo requisição para a página de busca da Amazon com um User-Agent
        const response = await axios.get(`https://www.amazon.com/s?k=${keyword}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' } // Simula um navegador real
        });

        // Criando um DOM virtual para manipular o HTML da página da Amazon
        const dom = new JSDOM(response.data);
        const document = dom.window.document;
        const results = []; // Array para armazenar os produtos extraídos

        // Selecionando os elementos dos produtos na página
        document.querySelectorAll('.s-main-slot .s-result-item').forEach(item => {
            const title = item.querySelector('h2 a span')?.textContent.trim() || 'Sem título'; 
            const rating = item.querySelector('.a-icon-alt')?.textContent.trim() || 'Sem avaliação'; 
            const reviews = item.querySelector('.s-link-style .a-size-base')?.textContent.trim() || 'Sem reviews'; 
            const image = item.querySelector('.s-image')?.src || ''; 

            // Adiciona os dados ao array se houver imagem (evita produtos inválidos)
            if (image) {
                results.push({ title, rating, reviews, image });
            }
        });

        // Retorna os dados extraídos como JSON
        res.json(results);
    } catch (error) {
        console.error('Erro ao fazer scraping:', error.message);
        res.status(500).json({ error: 'Erro ao buscar os dados da Amazon. Tente novamente mais tarde.' });
    }
});

// Iniciando o servidor na porta especificada
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
