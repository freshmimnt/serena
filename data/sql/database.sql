CREATE USER 'replica_user'@'%' IDENTIFIED BY 'replica_password';
GRANT REPLICATION SLAVE ON *.* TO 'replica_user'@'%';
FLUSH PRIVILEGES;

create TABLE companies(
	company_id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
	workers INT,
	payment INT,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	demo_company BOOLEAN DEFAULT FALSE NOT NULL,
    demo_expiry DATE DEFAULT NULL,
    UNIQUE (email)
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
	company_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	role ENUM('admin', 'employee') NOT NULL, 
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE,
	INDEX(company_id),
    UNIQUE (email)
);

CREATE TABLE chatbots (
    chatbot_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    input TEXT,
    response TEXT,
    state VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX(user_id)
);