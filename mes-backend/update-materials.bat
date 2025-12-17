@echo off
echo Останавливаем materials-service...
docker stop materials-service
echo Удаляем контейнер...
docker rm materials-service
echo Собираем новый образ...
docker build -t materials-service:latest ./materials-service
echo Запускаем...
docker run -d ^
  --name materials-service ^
  -p 5002:8080 ^
  -e ASPNETCORE_ENVIRONMENT=Development ^
  -e ConnectionStrings__DefaultConnection="Host=localhost;Port=5432;Database=materials_db;Username=postgres;Password=postgres" ^
  materials-service:latest
echo Готово!
docker ps | findstr materials-service