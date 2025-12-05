@"
CREATE DATABASE auth_db;
CREATE DATABASE production_db;
CREATE DATABASE materials_db;
CREATE DATABASE units_db;
CREATE DATABASE reports_db;
"@ | Out-File -FilePath "create-databases.sql" -Encoding UTF8