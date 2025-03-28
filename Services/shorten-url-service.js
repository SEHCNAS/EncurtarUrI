
//const sql = require('mssql');
const sqlite3 = require('sqlite3').verbose();
//const Database = new Database('./database.db');

// Configurações de conexão com o SQL Server
const config = {
    user: '',          // Nome de usuário do SQL Server
    password: '',        // Senha do SQL Server
    server: '',      // Endereço do servidor SQL
    database: '',// Nome do banco de dados
    options: {
        encrypt: false, // Mantenha esta opção se estiver usando SSL
        trustServerCertificate: false, // Ignora o certificado autoassinado
        enableArithAbort: true
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

    UrlEncurtada = /*window.location.origin*/'http://localhost:3000' + `/${Id}`;

    return UrlEncurtada;
}

async function InserirRegistro(url, Id){

    /*try {
        // Conecta ao banco de dados
        await sql.connect(config);

        const now = new Date();
        await sql.query`INSERT INTO [dbo].[Registro] 
       ([RegistroID]
       ,[RegistroUrl]) VALUES (${Id}, ${url})`;

        
    } catch (err) {
        console.error('Erro ao consultar o banco de dados:', err);
        throw err;
    } finally {
        // Fecha a conexão com o banco de dados
        await sql.close();
    }*/
        return new Promise((resolve, reject) => {
            // Abre conexão com SQLite
            const db = new sqlite3.Database('./database.db', (err) => {
                if (err) {
                    console.error('Erro ao conectar ao SQLite:', err.message);
                    return reject(err);
                }
            });
            
        // Insere o registro na tabela
        db.run(
            `INSERT INTO Registro (RegistroID, RegistroUrl) VALUES (?, ?)`,
            [Id, url],
            function (err) {
                if (err) {
                    console.error('Erro ao inserir no SQLite:', err.message);
                    reject(err);
                } else {
                    console.log('Registro inserido com sucesso!');
                    resolve(this.lastID); // Retorna o ID do registro inserido
                }
            }
        );

        // Fecha a conexão com SQLite
        db.close((err) => {
            if (err) {
                console.error('Erro ao fechar conexão SQLite:', err.message);
            }
        });
    });

}

// Função para verificar se o ID já existe no banco de dados
async function verificarIdExiste(id) {
    return new Promise((resolve, reject) => {
        // Conecta ao banco SQLite
        const db = new sqlite3.Database('./database.db', (err) => {
            if (err) {
                console.error('Erro ao conectar ao SQLite:', err.message);
                return reject(err);
            }
        });

        // Consulta o banco para verificar se o ID existe
        db.get(`SELECT 1 FROM Registro WHERE RegistroID = ?`, [id], (err, row) => {
            if (err) {
                console.error('Erro ao consultar o banco de dados:', err.message);
                reject(err);
            } else {
                if (row) {
                    console.log(`O ID ${id} já existe.`);
                    resolve(true);
                } else {
                    console.log(`O ID ${id} não existe.`);
                    resolve(false);
                }
            }
        });

        // Fecha a conexão com SQLite
        db.close((err) => {
            if (err) {
                console.error('Erro ao fechar conexão SQLite:', err.message);
            }
        });
    });
}

// Função que busca a URL original com base no ID encurtado
async function BuscaUrlOriginal(id) {
    return new Promise((resolve, reject) => {
        console.log('ID recebido:', id);

        // Conecta ao banco SQLite
        const db = new sqlite3.Database('./database.db', (err) => {
            if (err) {
                console.error('Erro ao conectar ao SQLite:', err.message);
                return reject(err);
            }
            console.log('Conectado ao banco de dados com sucesso');
        });

        // Consulta para buscar a URL
        db.get(`SELECT RegistroURL FROM Registro WHERE RegistroID = ?`, [id], (err, row) => {
            if (err) {
                console.error('Erro ao consultar o banco de dados:', err.message);
                reject(err);
            } else if (row) {
                // Verifique o que está sendo retornado
                console.log('Resultado da consulta:', row);
                console.log('URL original encontrada:', row.RegistroUrl);
                resolve(row.RegistroUrl); // Retorna a URL encontrada
            } else {
                console.log('Nenhuma URL encontrada para o ID:', id);
                resolve(null); // Retorna null se não encontrar
            }
        });

        // Fecha a conexão com SQLite
        db.close((err) => {
            if (err) {
                console.error('Erro ao fechar conexão SQLite:', err.message);
            }
        });
    });
}

// Certifique-se de exportar a função corretamente
module.exports = {
    EncurtarURL,
    BuscaUrlOriginal
};
