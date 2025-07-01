#!/bin/bash

echo "Deteniendo ELK Stack y aplicación e-commerce..."

# Detener todos los contenedores
docker-compose down

echo ""
echo "Servicios detenidos exitosamente!"
echo ""
echo "Para limpiar completamente (volúmenes y redes):"
echo "docker-compose down -v"
echo ""
echo "Para ver contenedores corriendo:"
echo "docker ps" 