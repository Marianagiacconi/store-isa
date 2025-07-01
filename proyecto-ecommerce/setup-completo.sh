#!/bin/bash

echo "🚀 Configurando proyecto e-commerce completo..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    print_error "Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar que Docker Compose esté instalado
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

print_status "Verificando puertos disponibles..."

# Verificar puertos
if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null ; then
    print_warning "Puerto 8081 está en uso. Deteniendo contenedores existentes..."
    docker-compose -f docker/docker-compose.yml down 2>/dev/null || true
fi

if lsof -Pi :3307 -sTCP:LISTEN -t >/dev/null ; then
    print_warning "Puerto 3307 está en uso. Deteniendo contenedores existentes..."
    docker-compose -f docker/docker-compose.yml down 2>/dev/null || true
fi

print_status "Construyendo aplicación backend..."

# Construir backend
cd backend
if [ -f "gradlew" ]; then
    chmod +x gradlew
    ./gradlew clean build -x test
    if [ $? -eq 0 ]; then
        print_success "Backend construido exitosamente"
    else
        print_error "Error construyendo backend"
        exit 1
    fi
else
    print_error "No se encontró gradlew en el directorio backend"
    exit 1
fi
cd ..

print_status "Instalando dependencias del frontend..."

# Instalar dependencias del frontend
cd frontend
if [ -f "package.json" ]; then
    npm ci
    if [ $? -eq 0 ]; then
        print_success "Dependencias del frontend instaladas"
    else
        print_error "Error instalando dependencias del frontend"
        exit 1
    fi
else
    print_error "No se encontró package.json en el directorio frontend"
    exit 1
fi
cd ..

print_status "Construyendo imagen Docker..."

# Construir imagen Docker
cd docker
docker build -t store:latest .
if [ $? -eq 0 ]; then
    print_success "Imagen Docker construida exitosamente"
else
    print_error "Error construyendo imagen Docker"
    exit 1
fi
cd ..

print_status "Iniciando servicios con Docker Compose..."

# Iniciar servicios
cd docker
docker-compose up -d
if [ $? -eq 0 ]; then
    print_success "Servicios iniciados exitosamente"
else
    print_error "Error iniciando servicios"
    exit 1
fi
cd ..

print_status "Esperando que los servicios estén listos..."

# Esperar a que los servicios estén listos
sleep 30

print_status "Verificando estado de los servicios..."

# Verificar estado de los servicios
if curl -f http://localhost:8081/management/health > /dev/null 2>&1; then
    print_success "Backend está funcionando en http://localhost:8081"
else
    print_warning "Backend no responde aún, puede tardar unos minutos más"
fi

if curl -f http://localhost:5601 > /dev/null 2>&1; then
    print_success "Kibana está funcionando en http://localhost:5601"
else
    print_warning "Kibana no responde aún, puede tardar unos minutos más"
fi

print_status "Ejecutando tests..."

# Ejecutar tests del backend
cd backend
./gradlew test
if [ $? -eq 0 ]; then
    print_success "Tests del backend ejecutados exitosamente"
else
    print_warning "Algunos tests del backend fallaron"
fi
cd ..

print_status "Configuración completada!"

echo ""
echo "📋 RESUMEN DE SERVICIOS:"
echo "========================"
echo "🌐 Backend API:     http://localhost:8081"
echo "📊 Kibana:          http://localhost:5601"
echo "🔍 Elasticsearch:   http://localhost:9200"
echo "📝 Logstash:        Puerto 5044"
echo "🗄️  MySQL:           localhost:3307"
echo ""
echo "🚀 Para iniciar el frontend Ionic:"
echo "   cd frontend && npm start"
echo ""
echo "🧪 Para ejecutar tests E2E:"
echo "   cd backend && npm run e2e:run"
echo ""
echo "📦 Para detener todos los servicios:"
echo "   cd docker && docker-compose down"
echo ""
print_success "¡Proyecto e-commerce configurado exitosamente!" 