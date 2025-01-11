const express = require('express');
const shortenUrlservice = require('../Services/shorten-url-service.js');
const router = express.Router();

router.post('/', async (req, res) => {
    
    const url = req.body.url;
    console.log('entrou na rota');
    console.log(url)
    try {
        const urlEncurtada= await shortenUrlservice.EncurtarURL(url); // Chame o serviço
        console.log('URL encurtada retornada do serviço:', urlEncurtada); // Verifique o retorno
        res.status(200).json({ shortUrl: urlEncurtada }); // Retorne a URL encurtada
    } catch (error) {
        console.error('Erro ao encurtar URL:', error);
        res.status(500).send('Erro ao encurtar a URL');
    }

    //const UrlEncurtada = shortenUrlservice.EncurtarURL(Url);
    console.log(UrlEncurtada);
    //res.json(UrlEncurtada);

    //const cars = carService.getAllCars();
    //res.json(cars);
});

// Rota para buscar a URL original usando o ID
router.get('/getOriginalUrl/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const originalUrl = await shortenUrlservice.BuscaUrlOriginal(id);
        if (originalUrl) {
            res.status(200).json({ originalUrl }); // Retorna a URL original
        } else {
            res.status(404).json({ error: 'URL não encontrada' });
        }
    } catch (error) {
        console.error('Erro ao buscar a URL original:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router; // Certifique-se de exportar o router corretamente