CREATE TABLE IF NOT EXISTS customers (
    customer_id VARCHAR(20) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(120) NOT NULL,
    mobile_number VARCHAR(10) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    address VARCHAR(250) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(80) NOT NULL,
    pincode VARCHAR(6) NOT NULL,
    status VARCHAR(10) NOT NULL,
    PRIMARY KEY (customer_id),
    CONSTRAINT uk_customers_email UNIQUE (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customer_id_sequence (
    sequence_name VARCHAR(40) NOT NULL,
    sequence_value BIGINT NOT NULL,
    PRIMARY KEY (sequence_name)
) ENGINE=InnoDB;
