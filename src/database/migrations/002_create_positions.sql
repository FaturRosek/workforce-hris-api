CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL,
    position_name VARCHAR(100) NOT NULL,
    base_salary NUMERIC(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);