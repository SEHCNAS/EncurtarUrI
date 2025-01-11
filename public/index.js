document.getElementById('EncurtarURL').addEventListener('submit', async function (event) {
    event.preventDefault(); // Previne o envio do formulário
    console.log('Chamada da função');

    const url = document.getElementById('CampoURL').value;
    console.log(url);
    console.log('Chamada da api');

    try {
        const response = await fetch('http://10.10.0.18:3000/shorten-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url }), // Envia a URL como JSON
        });

        console.log('Status da resposta:', response.status); // Verifique o status
        
        if (!response.ok) {
            throw new Error('Erro ao encurtar a URL');
        }

        const responseJson = await response.json(); // Converte a resposta para JSON
        console.log('Short URL:', responseJson.shortUrl); // Acessa o shortUrl

        //console.log(`URL encurtada: ${data.shortUrl}`);
        document.getElementById('URLEncurtada').value = `URL encurtada: ${responseJson.shortUrl}`; // Atualiza o DOM com a URL encurtada
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('URLEncurtada').value = 'Erro ao encurtar a URL'; // Exibe mensagem de erro
    }
});
