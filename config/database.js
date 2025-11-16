import dotenv from 'dotenv'
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

async function mostrarDadosEmpresa() { // função MostrarDadosEmpresa
    const connection = await pool.getConnection() // cria uma conexão com o banco
    try{
        
        const [rows] = await connection.execute('select * from empresas') // executa uma ação de mostrar todos os dados da tabela empresas
        return rows
    }finally{
        connection.release()
    }
}

export {mostrarDadosEmpresa}