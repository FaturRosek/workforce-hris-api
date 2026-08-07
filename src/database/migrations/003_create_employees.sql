CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    employee_code VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    nik VARCHAR(20) UNIQUE NOT NULL,
    phone VARCHAR(20),
    position_id INTEGER NOT NULL,
    gender VARCHAR(10),
    birth_date DATE,
    hire_date DATE NOT NULL,
    employment_status VARCHAR(20) DEFAULT 'Permanent',
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_position
        FOREIGN KEY(position_id)
        REFERENCES positions(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);