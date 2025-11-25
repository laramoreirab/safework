import dotenv from 'dotenv'
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise'

dotenv.config()

const pool = mysql.createPool({ // conecta ao banco de dados
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

async function getConnection() { // função que cria uma conexão com o banco
    return pool.getConnection()
}


// função para ler os registros
async function read(table, whereClause = null, params = []) {
    const connection = await getConnection(); // cria uma conexão com o pool
    try{
        let sql = `SELECT * FROM ${table}` // seleciona todos os item da tabela (tabela)
        if(where){
            sql += ` WHERE ${where}` // caso tenha um where, adicione ao (select * from)
        }
        const [rows] = await connection.execute(sql, params) // executa o comando sql + o parametro que substitui o '?' no "email = ?", [email] por exemplo
        return rows 
    } finally{
        connection.release()
    }
}

// função para inserir um novo registro
async function create(table, data){
    const connection = await getConnection()
    
    try{
        const columns = Object.keys(data).join(', ') // separa as colunas do registro ex : (nome, rep, cnpj)
        const placeholders = Array(Object.keys(data).length).fill('?').join(', ') // aqui criamos uma array com interrogações para identificar a quantidade de valores que serão adicionados ex: ('?', '?', '?', '?')
        const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})` // inserimos as informações ex: (insert into empresas (nome, rep, cnpj) values (?, ?, ?, ?))
        const values = Object.values(data) // pegamos os valores das chaves (nome, rep, cnpj) que retornará no ex: (safework, Lara Moreira, 12345678900190)
        const [result] = await connection.execute(sql , values) // executa o insert com os valores corretos
        return result.insertId // retorna o id automático da tabela ex: 1
    } finally {
        connection.release() // devolve a conexão ao pool, evitando esgotar as conexões 
    }
}

async function update(table, data, where) {
    const connection = await getConnection();
    try{
        const set = Object.keys(data).map(column => `${column} = ?`).join(', ') 
        // o código acima pega cada coluna ex: (nome, email, idade) e coloca o valor '?' em cada coluna.
        // depois transforma os objetos em uma string retornando (nome = ?, email = ?, idade = ?)
        const sql = `UPDATE ${table} SET ${set} WHERE ${where}`
        // ex de saída sql : UPDATE usuario SET nome = ?, email = ?, idade = ? WHERE id = 1
        const values = Object.values(data)
        // o values pega todos os valores do data e retorna, ex: idade = 18, retornará 18.

        const [result] = await connection.execute(sql, values)
        // ex de saída result : UPDATE usuario SET nome = 'Roger', email = 'roger123@gmail.com', idade = 18 WHERE id = 1
        return result.affectedRows
    }finally{
        connection.release()
    }
}
// função para deletar um registro
async function deleteRecord(table, where){ 
    const connection = await getConnection()
    try{
    const sql = `DELETE FROM ${table} WHERE ${where}`
    const [result] = connection.execute(sql)
    return result.affectedRows
    }finally{
        connection.release()
    }
}

// gera um hash para senha 
async function hashPassword(password){
    try{
        return bcrypt.hash(password, 10)
    } catch(err) {
        console.error("Erro ao gerar hash da senha", err)
        throw err
    }
}

// compara a senha com o hash
async function comparePassword(password, hash) {
    try{
        return bcrypt.compare(password, hash)
    } catch(err) {
        console.log("Erro ao comparar senha:", err)
        return false
    }
}
export { // exportando as funções. (para utilizar é necessário usar o import {read, create, update, getConnection} from '../config/database.js')
    read,
    create,
    update,
    deleteRecord,
    hashPassword,
    comparePassword,
    getConnection
}