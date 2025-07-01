#!/bin/bash

echo "Iniciando ELK Stack para la aplicación e-commerce..."

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "Docker no está corriendo. Por favor inicia Docker primero."
    exit 1
fi

# Detener contenedores existentes si los hay
echo "Deteniendo contenedores existentes..."
docker-compose down

# Iniciar ELK Stack
echo "Iniciando Elasticsearch, Logstash y Kibana..."
docker-compose up -d elasticsearch logstash kibana

# Esperar a que Elasticsearch esté listo
echo "Esperando a que Elasticsearch esté listo..."
until curl -s http://localhost:9200 > /dev/null; do
    echo "   Esperando Elasticsearch..."
    sleep 5
done

echo "Elasticsearch está listo!"

# Esperar a que Kibana esté listo
echo "Esperando a que Kibana esté listo..."
until curl -s http://localhost:5601 > /dev/null; do
    echo "   Esperando Kibana..."
    sleep 5
done

echo "Kibana está listo!"

# Iniciar la aplicación
echo "Iniciando aplicación e-commerce..."
docker-compose up -d app mysql

echo ""
echo "ELK Stack iniciado exitosamente!"
echo ""
echo "SERVICIOS CORRIENDO:"
echo "==================="
echo "• Aplicación JHipster: http://localhost:8081"
echo "• MySQL Database: localhost:3307"
echo "• Elasticsearch: http://localhost:9200"
echo "• Kibana Dashboard: http://localhost:5601"
echo "• Logstash: localhost:5000 (TCP/UDP), localhost:5044 (Beats)"
echo ""
echo "COMANDOS UTILES:"
echo "================"
echo "• Ver logs en tiempo real: docker-compose logs -f app"
echo "• Ver logs de MySQL: docker-compose logs -f mysql"
echo "• Ver logs de Elasticsearch: docker-compose logs -f elasticsearch"
echo "• Ver logs de Kibana: docker-compose logs -f kibana"
echo "• Ver logs de Logstash: docker-compose logs -f logstash"
echo ""
echo "ACCESO A KIBANA:"
echo "================"
echo "1. Abre http://localhost:5601 en tu navegador"
echo "2. Ve a 'Discover' para ver logs en tiempo real"
echo "3. Crea dashboards personalizados para monitoreo"
echo "4. Configura alertas y notificaciones"
echo ""
echo "ESTADO DE CONTENEDORES:"
echo "======================"
docker-compose ps 