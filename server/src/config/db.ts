import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

type Dialect = 'postgres';


dotenv.config();

const requiredEnvData: string[] = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'PORT'];

requiredEnvData.forEach((envData: string) => {
    if (!process.env[envData]) {
        throw new Error(`Missing required env variable: ${envData}`);
    }
});

const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
        logging: false,
        dialect: 'postgres' as Dialect,
        host: process.env.DB_HOST as string,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    }
);


export default sequelize;