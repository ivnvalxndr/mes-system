#!/bin/bash
set -e

# Ждем пока PostgreSQL запустится
sleep 5

# Создаем базы данных
psql -v ON_ERROR_STOP=1 --username postgres <<-EOSQL
    CREATE DATABASE auth_db;
    CREATE DATABASE production_db;
    CREATE DATABASE material_db;
    CREATE DATABASE unit_db;
    
    GRANT ALL PRIVILEGES ON DATABASE auth_db TO postgres;
    GRANT ALL PRIVILEGES ON DATABASE production_db TO postgres;
    GRANT ALL PRIVILEGES ON DATABASE material_db TO postgres;
    GRANT ALL PRIVILEGES ON DATABASE unit_db TO postgres;
EOSQL

echo "Databases created successfully!"