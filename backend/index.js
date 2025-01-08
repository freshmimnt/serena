import mysql from 'mysql2';
import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import sgMail from '@sendgrid/mail';
import Stripe from 'stripe';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cron from 'node-cron';
import axios from 'axios';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:8000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
    secure: false
}));
app.use(cookieParser());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const stripe = new Stripe(process.env.STRIPE_API_KEY, { apiVersion: '2024-10-28.acacia' });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
}).promise();

function generateRandomPassword(length = 10) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

app.post('/api/chatbot', async (req, res) => {
    try{
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send('Não é um usuario autenticado');
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        const { message, state } = req.body; 

        const [stateRows] = await pool.query(
            "SELECT state FROM chatbots WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
            [userId]
        );
        const currentState = state || (stateRows.length > 0 ? stateRows[0].state : "inicio");

        const flaskResponse = await axios.post(
            'http://flask-chatbot:5000/chat',
            { message, state: currentState }
        );

        const { response: botResponse, state: nextState } = flaskResponse.data;

        await pool.query(
            "INSERT INTO chatbots (user_id, input, response, state) VALUES (?, ?, ?, ?)",
            [userId, message, botResponse, nextState]
        );

        res.json({ botResponse, nextState });


    }catch (error) {
        console.error("Error handling chatbot request:", error);
        res.status(500).send("An error occurred.");
    }
});

app.delete("/api/deleteChat", async (req, res) => {
    try{
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send('Não é um usuario autenticado');
        }
    
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;
    
        await pool.query("DELETE FROM chatbots WHERE user_id =?", [userId]);
    }catch{
        console.error("Erro ao apagar as conversas:", error);
    }
});

app.post("/api/create-checkout-session", async (req, res) => {
    const { workers, email, name, payment } = req.body;

    if (!workers || !email || !name || !payment) {
        return res.status(400).send("Preencha todos os campos");
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: `Subscription for ${name}`,
                        },
                        unit_amount: 25 * 100,
                    },
                    quantity: workers,
                },
            ],
            customer_email: email,
            mode: "payment",
            success_url: "http://localhost:8000/sucesso?workers=" + workers + "&email=" + encodeURIComponent(email) + "&name=" + encodeURIComponent(name) + "&payment=" + payment,
            cancel_url: "http://localhost:8000/canceled",
        });
        res.json({ url: session.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).send("Unable to initiate payment.");
    }
});

app.post('/api/payment-success', async (req, res) => {
    const connection = await pool.getConnection(); 
    try {
        const { name, email, workers, payment } = req.body;

        if (!name || !email || !workers || !payment) {
            return res.status(400).send("Missing required fields.");
        }

        const purchase_date = new Date();

        await connection.beginTransaction(); 

        const [existingCompany] = await connection.query(
            "SELECT company_id FROM companies WHERE email = ? FOR UPDATE", 
            [email]
        );

        if (existingCompany.length > 0) {
            await connection.rollback(); 
            return res.status(409).send("Company already registered."); 
        }

        const [companyResult] = await connection.query(
            "INSERT INTO companies (name, email, workers, payment, purchase_date) VALUES (?, ?, ?, ?, ?)",
            [name, email, workers, payment, purchase_date]
        );

        const randomPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        await connection.query(
            "INSERT INTO users (company_id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
            [companyResult.insertId, name, email, hashedPassword, 'admin']
        );

        const msg = {
            to: email,
            from: 'serena.sistema@gmail.com',
            subject: 'Welcome to Serena!',
            text: `Bem-vindo, ${name}!\n\nAqui estão suas credenciais de login:\nEmail: ${email}\nSenha: ${randomPassword}\n\nPor favor, altere sua senha no primeiro login.\n\n- Equipe Serena`,
        };
        await sgMail.send(msg);

        await connection.commit(); 
        res.status(201).send("Company and admin user created successfully.");
    } catch (err) {
        await connection.rollback(); 
        console.error("Error processing payment success:", err);
        res.status(500).send("Internal server error.");
    } finally {
        connection.release(); 
    }
});

app.post('/api/requestDemo', async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).send("Name and email are required.");
        }

        const demoExpiry = new Date();
        demoExpiry.setDate(demoExpiry.getDate() + 3);

        const [companyResult] = await pool.query(
            "INSERT INTO companies (name, email, demo_company, demo_expiry) VALUES (?, ?, TRUE, ?)",
            [name, email, demoExpiry]
        );

        const companyId = companyResult.insertId;

        const password = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO users (company_id, name, email, password, role) VALUES (?, ?, ?, ?, 'employee')",
            [companyId, name, email, hashedPassword]
        );

        const msg = {
            to: email,
            from: 'serena.sistema@gmail.com',
            subject: 'Your Demo is Active',
            text: `Hi ${name},\n\nYour demo is now active and will expire on ${demoExpiry.toDateString()}.\nHere are your login details:\nEmail: ${email}\nPassword: ${password}\n\nPlease log in to explore our system.\n\n- Serena Team`,
        };

        await sgMail.send(msg);
        res.status(200).send("Demo activated successfully.");
    } catch (err) {
        console.error("Error activating demo:", err);
        res.status(500).send("Internal server error.");
    }
});


cron.schedule("0 9 * * *", async () => { 
    try {
        const oneDay = new Date();
        oneDay.setDate(oneDay.getDate() + 1);

        const [companies] = await pool.query(
            "SELECT * FROM companies WHERE demo_company = TRUE AND demo_expiry = ?",
            [oneDay]
        );

        for (const company of companies) {
            const msg = {
                to: company.email,
                from: 'serena.sistema@gmail.com',
                subject: 'Demo Expiry Reminder',
                text: `Hi ${company.name},\n\nThis is a reminder that your demo will expire tomorrow (${company.demo_expiry}).\nPlease reach out to continue using our services.\n\n- Serena Team`,
            };

            await sgMail.send(msg);
        }

        console.log("Expiry notifications sent successfully.");
    } catch (err) {
        console.error("Error sending notifications:", err);
    }
});

cron.schedule("0 0 * * *", async () => { 
    try {
        const currentDate = new Date();

        await pool.query(
            "DELETE FROM companies WHERE demo_company = TRUE AND demo_expiry < ?",
            [currentDate]
        );

        console.log("Expired demo companies deleted successfully.");
    } catch (err) {
        console.error("Error deleting expired demo companies:", err);
    }
});

app.post("/api/addEmployee", async (req, res) => {
  try {
    const {name, email} = req.body;

    const randomPassword = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const token = req.cookies.token;
      if (!token) {
          return res.status(401).send('Not authenticated');
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const company_id = decoded.id;

      await pool.query(
          "INSERT INTO users (company_id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
          [company_id, name, email, hashedPassword, 'employee']
      );

      const msg = {
          to: email,
          from: 'serena.sistema@gmail.com', 
          subject: 'Bem-vindo',
          text: `Bem-vindo ${name}!. As suas credenciais:\n\nEmail: ${email}\nPassword: ${randomPassword}\n\nPor favor altere a sua password por motivos de segurança.`,
      };
      await sgMail.send(msg);

      res.json({ message: 'Sucesso' });
  } catch (err) {
      console.error("Erro:", err);
      res.status(500).send("Erro");
  }
});

app.post('/api/login', async (req, res) => {
  try {
      const { email, password } = req.body;

      const [userResult] = await pool.query(
          "SELECT * FROM users WHERE email =?",
          [email]
      );

      if (!userResult.length) {
          return res.status(401).send("Email ou password inválidos");
      }

      const user = userResult[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
          return res.status(401).send("Email ou Password Inválidos");
      }
      const token = jwt.sign({ id: user.user_id, role: user.role, company_id: user.company_id}, process.env.SECRET_KEY, { expiresIn: '1d' });
      res.cookie('token', token, { httpOnly: true });
      if (user.role === 'admin') {
        res.json({ Status: 'Sucesso', redirectTo: '/admin' });
    } else if (user.role === 'employee') {
        res.json({ Status: 'Sucesso', redirectTo: '/chatbot' });
    }
  } catch (err) {
      console.error("Erro:", err);
      res.status(500).send("Erro");
  }
});

// app.post('/api/2FA', async )

app.get('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.send('Logged out');
});

app.post('/api/changePassword', async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send('Not authenticated');
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        const [userResult] = await pool.query("SELECT password FROM users WHERE user_id = ?", [userId]);
        if (!userResult.length) {
            return res.status(404).send("User not found");
        }

        const hashedPassword = userResult[0].password;

        if (!oldPassword || !hashedPassword) {
            return res.status(400).send("Invalid input: Passwords are required");
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, hashedPassword);
        if (!isPasswordValid) {
            return res.status(401).send('Old password is incorrect');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE users SET password = ? WHERE user_id = ?", [hashedNewPassword, userId]);

        res.send('Password changed successfully');
    } catch (err) {
        console.error("Error changing password:", err);
        res.status(500).send("Internal server error");
    }
});

app.get('/api/verifyToken', (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send('Not authenticated');
        }

        jwt.verify(token, process.env.SECRET_KEY);
        res.json({ authenticated: true });
    } catch (err) {
        console.error("Error verifying token:", err);
        res.status(403).send('Forbidden');
    }
});

app.get('/api/verifyUser', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send('Not authenticated');
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;
        const [userResult] = await pool.query("SELECT name, email FROM users WHERE user_id = ?", [userId]);
        if (!userResult.length) {
            return res.status(404).send("User not found");
        }

        res.json(userResult[0]);
    } catch (err) {
        console.error("Error fetching user details:", err);
        res.status(500).send("Internal server error");
    }
});

app.post("/api/changeCompanyEmail", async (req, res) => {
    try {
        const { newEmail } = req.body;

        if (!newEmail) {
            return res.status(400).send('New email is required');
        }

        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send('Not authenticated');
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const company_id = decoded.id; 

        const [companyResult] = await pool.query("SELECT * FROM users WHERE company_id = ?", [company_id]);

        if (!companyResult.length) {
            return res.status(404).send("Company not found");
        }

        await pool.query("START TRANSACTION");

        await pool.query("UPDATE companies SET email = ? WHERE company_id = ?", [newEmail, company_id]);

        await pool.query("UPDATE users SET email = ? WHERE company_id = ? AND role = 'admin'", [newEmail, company_id]);

        await pool.query("COMMIT");

        res.status(200).send("Email updated successfully for company and admin user");
    } catch (err) {
        console.error("Error updating emails:", err);
        await pool.query("ROLLBACK");
        res.status(500).send("Internal server error");
    }
});

app.post("/api/changeCompanyPassword", async (req, res) => {
    try{
        const {oldPassword, newPassword} = req.body;

        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send('Not authenticated');
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const company_id = decoded.id;

        const [userResult] = await pool.query("SELECT password FROM users WHERE company_id = ? AND role = 'admin'", [company_id]);
        if (!userResult.length) {
            return res.status(404).send("User not found");
        }

        const hashedPassword = userResult[0].password;

        if (!oldPassword || !hashedPassword) {
            return res.status(400).send("Invalid input: Passwords are required");
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, hashedPassword);
        if (!isPasswordValid) {
            return res.status(401).send('Old password is incorrect');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE users SET password = ? WHERE company_id = ? AND role = 'admin'", [hashedNewPassword, company_id]);
        res.send('Password changed successfully');
    } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).send("Internal server error");
    }
});

app.get('/api/numberOfEmployees', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send('Not authenticated');
        }
  
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const company_id = decoded.id;

        const [rows] = await pool.query(`
            SELECT 
                COUNT(*) AS employeeCount
            FROM 
                users
            WHERE 
                company_id =? and role = "employee"
        `, [company_id]);

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: "Company not found" });
        }
    } catch (err) {
        console.error("Error fetching number of employees:", err);
        res.status(500).send("Database query failed");
    }
})

app.get('/api/daysLeft', async (req, res) => {
    try {

        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send('Not authenticated');
        }
  
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const company_id = decoded.id;

        const [rows] = await pool.query(`
            SELECT 
            DATE_FORMAT(DATE_ADD(purchase_date, INTERVAL 1 YEAR), '%d-%m-%Y') AS daysLeft
            FROM companies
            WHERE company_id =?`, [company_id]);

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: "Company not found" });
        }
    } catch (err) {
        console.error("Error fetching days left:", err);
        res.status(500).send("Database query failed");
    }
});

app.post('/api/searchEmployees', async (req, res) => {
    try {
        const { name } = req.body;

        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send('Not authenticated');
        }
    
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const company_id = decoded.company_id;

        const [employees] = await pool.query(
            "SELECT user_id, name, email FROM users WHERE name LIKE ? AND company_id = ? AND role = 'employee'",
            [`%${name}%`, company_id]
        );

        if (!employees.length) {
            return res.status(404).send("User not found");
        }

        res.json(employees);
    } catch (err) {
        console.error("Error fetching employees:", err);
        res.status(500).send("Internal server error");
    }
});

app.post('/api/changeEmployeesName', async (req, res) => {
    try{

        const { userId, name} = req.body;

        if (!userId || !name ) {
            return res.status(400).send('User ID and at least one of name or email are required.');
        }

        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send('Not authenticated');
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const company_id = decoded.company_id;

        await pool.query("UPDATE users SET name = ? WHERE user_id = ? AND company_id = ?  AND role = 'employee'", [name, userId, company_id]);

    }catch{
        console.error('Error updating employee:', err);
        res.status(500).send('Internal server error');
    }

});

app.post('/api/changeEmployeesEmail', async (req, res) => {
    try{

        const { userId, email} = req.body;

        if (!userId || !email ) {
            return res.status(400).send('User ID and at least one of name or email are required.');
        }

        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send('Not authenticated');
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const company_id = decoded.company_id;

        await pool.query("UPDATE users SET email = ? WHERE user_id = ? AND company_id = ? AND role = 'employee'", [email, userId, company_id]);

    }catch{
        console.error('Error updating employee:', err);
        res.status(500).send('Internal server error');
    }

});

app.delete('/api/deleteEmployee', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send('Not authenticated');
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const company_id = decoded.company_id;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).send('User ID is required');
        }

        const [result] = await pool.query(
            "DELETE FROM users WHERE user_id = ? AND company_id = ? AND role = 'employee'",
            [userId, company_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send("Employee not found or not part of this company.");
        }

        res.status(200).send("Employee deleted successfully.");
    } catch (err) {
        console.error("Error deleting employee:", err);
        res.status(500).send("Internal server error.");
    }
});

app.post('/api/recuperarSenha', async (req, res) => {
    const { email } = req.body;

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
        return res.status(404).send({ message: "E-mail não encontrado!" });
    }

    const recoveryLink = `http://localhost:8000/redefinirSenha/${encodeURIComponent(email)}`;
    try {
        const msg = {
            to: email,
            from: "serena.sistema@gmail.com",
            subject: "Recuperação de Senha",
            html: `Clique no link abaixo para redefinir sua senha:'${recoveryLink}'`,
        };

        await sgMail.send(msg);
        res.status(200).send({ message: "E-mail de recuperação enviado!" });
    } catch (err) {
        console.error("Erro ao enviar e-mail:", err);
        res.status(500).send({ message: "Erro ao enviar e-mail." });
    }
});

app.post('/api/redefinirSenha', async (req, res) => {
    const { email, newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);

    res.status(200).send({ message: "Senha redefinida com sucesso!" });
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});




