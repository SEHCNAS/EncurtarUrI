
const sql = require('mssql');


// Configurações de conexão com o SQL Server
const config = {
    user: '*',          // Nome de usuário do SQL Server
    password: '*',        // Senha do SQL Server
    server: '*',      // Endereço do servidor SQL
    database: 'EncurtarURL',// Nome do banco de dados
    options: {
        encrypt: true, // Mantenha esta opção se estiver usando SSL
        trustServerCertificate: true // Ignora o certificado autoassinado
    }
};

async function EncurtarURL(url){
    console.log('EncurtarURL');
    boolean = true;
    let Id;
    console.log(url)
    while (boolean){
        let QuantidadeId = Math.floor(Math.random() * (10 - 5 + 1) + 5);
        console.log(QuantidadeId);
        Id = Math.random()           // Gera um valor randômico
                    .toString(36)           // Utiliza a Base36
                    .substr(-QuantidadeId)  // Captura os 4 últimos números
                    .toUpperCase();         // Converte para maiúscula 
        console.log(Id);
        boolean = await verificarIdExiste(Id);
    }

    await InserirRegistro(url, Id);

    UrlEncurtada = /*window.location.origin*/'http://10.10.0.18:3000' + `/${Id}`;

    return UrlEncurtada;
}

async function InserirRegistro(url, Id){

    try {
        // Conecta ao banco de dados
        await sql.connect(config);

        const now = new Date();
        await sql.query`INSERT INTO [dbo].[Registro] 
       ([RegistroID]
       ,[RegistroUrl]
       ,[RegistroDate]) VALUES (${Id}, ${url}, ${now.toISOString()})`;

        
    } catch (err) {
        console.error('Erro ao consultar o banco de dados:', err);
        throw err;
    } finally {
        // Fecha a conexão com o banco de dados
        await sql.close();
    }

}

// Função para verificar se o ID já existe no banco de dados
async function verificarIdExiste(id) {
    try {
        // Conecta ao banco de dados
        await sql.connect(config);

        // Consulta o banco para verificar se o ID existe
        const result = await sql.query`SELECT 1 FROM Registro WHERE RegistroID = ${id}`;

        // Se a consulta retornar pelo menos uma linha, o ID já existe
        if (result.recordset.length > 0) {
            console.log(`O ID ${id} já existe.`);
            return true;
        } else {
            console.log(`O ID ${id} não existe.`);
            
            return false;
        }
    } catch (err) {
        console.error('Erro ao consultar o banco de dados:', err);
        throw err;
    } finally {
        // Fecha a conexão com o banco de dados
        await sql.close();
    }
}

// Função que busca a URL original com base no ID encurtado
async function BuscaUrlOriginal(id) {
    try {
        console.log(id);
        try {
            await sql.connect(config);
            console.log('Conectado ao banco de dados com sucesso');
        } catch (err) {
            console.error('Erro ao conectar ao banco de dados:', err);
        }

        const result  = await sql.query`SELECT RegistroURL FROM Registro WHERE RegistroID = ${id};`;
        console.log('Resultado da consulta:', result);
        //const result = await pool.query(query, [id]); // Usa query parameters
        
        // Acessando o RegistroURL
        if (result.recordset.length > 0) {
            const originalUrl = result.recordset[0].RegistroURL; // Acesse o campo correto
            console.log('URL original encontrada:', originalUrl); // Log da URL encontrada
            return originalUrl; // Retorna a URL original
        } else {
            console.log('Nenhuma URL encontrada para o ID:', id); // Log se não encontrar a URL
            return null; // Retorna null se não encontrar
        }
    } catch (error) {
        console.error('Erro ao consultar o banco de dados:', error);
        throw error;
    }
}

// Certifique-se de exportar a função corretamente
module.exports = {
    EncurtarURL,
    BuscaUrlOriginal
};
