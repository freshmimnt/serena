import mysql from 'mysql2';
import express from 'express';
import dotenv from 'dotenv';
//import bcrypt from 'bcrypt';
dotenv.config(); 

const app = express();
const port = 3000;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
}).promise();

app.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query("SHOW TABLES");
        res.json(rows);
    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Database query failed");
    }
});

app.post('/addCompany', async (req, res) =>{
    try {
        const { name, email, workers, amount_to_pay, purchase_date } = req.body;
        const [result] = await pool.query("INSERT INTO users (name, email, password, workers, amount_to_pay,purchase_date) VALUES (?,?,?)", [name, email, workers, amount_to_pay,purchase_date]);
        res.json({ message: 'Company added successfully' });
    } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).send("Database error");
    } 
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
