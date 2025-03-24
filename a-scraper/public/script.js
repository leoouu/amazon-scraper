document.addEventListener('DOMContentLoaded', () => {
    // Pegando os elementos do HTML
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('results');

    // Função para buscar os dados do servidor
    async function fetchData() {
        // Pegando o valor da barra de pesquisa e removendo espaços extras
        const query = searchInput.value.trim();
        if (!query) return; // Se a pesquisa estiver vazia não faz nada

        // Exibe um aviso enquanto os dados estão sendo carregados
        resultsContainer.innerHTML = '<p>Carregando...</p>';

        try {
            // Faz a requisição para a API backend que faz o scraping
            const response = await fetch(`/api/scrape?keyword=${query}`);
            const data = await response.json(); 

            // Se houver um erro retornado pela API, exibe na tela
            if (data.error) {
                resultsContainer.innerHTML = `<p style="color: red;">Erro: ${data.error}</p>`;
                return;
            }

            // Limpa os resultados anteriores antes de exibir os novos
            resultsContainer.innerHTML = '';

            // Se não encontrar produtos, exibe uma mensagem
            if (data.length === 0) {
                resultsContainer.innerHTML = '<p>Nenhum resultado encontrado.</p>';
                return;
            }

            // Loop para exibir cada produto na tela
            data.forEach(item => {
                const productElement = document.createElement('div');
                productElement.classList.add('product');

                // Criando o HTML de cada item de produto
                productElement.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" />
                    <div>
                        <h3>${item.title || 'Sem título'}</h3>
                        <p><strong>Rating:</strong> ${item.rating}</p>
                        <p><strong>Reviews:</strong> ${item.reviews}</p>
                    </div>
                `;

                // Adiciona o produto ao container
                resultsContainer.appendChild(productElement);
            });

        } catch (error) {
            // Se houver err, exibe uma mensagem no console e na tela
            resultsContainer.innerHTML = `<p style="color: red;">Erro ao buscar dados.</p>`;
            console.error('Erro ao buscar dados:', error);
        }
    }

    // Adiciona um evento para chamar fetchData() quando o botão for clicado
    searchButton.addEventListener('click', fetchData);

    // Permite que a busca seja feita pressionando "Enter" no campo de pesquisa
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            fetchData();
        }
    });
});
