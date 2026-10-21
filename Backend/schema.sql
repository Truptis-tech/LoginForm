-- Database schema for AdminPortal
CREATE DATABASE IF NOT EXISTS admin_portal;
USE admin_portal;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Viewer',
    status VARCHAR(50) DEFAULT 'Pending',
    joined DATE NOT NULL,
    avatar VARCHAR(10) NOT NULL,
    dept VARCHAR(100) DEFAULT 'Engineering'
);
