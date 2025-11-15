import dotenv from 'dotenv'; //no playload puxará informações do arquivo .env

// Carregar variáveis do arquivo .env
dotenv.config();

//configurar o playload do JWT
export const JWT_CONFIG = {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
};