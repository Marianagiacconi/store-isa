#!/bin/bash

# ISA E-commerce Project Setup Script
# Universidad de Málaga - Ingeniería del Software Avanzado

echo "🚀 Configurando proyecto ISA E-commerce..."

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

# Verificar requisitos previos
print_status "Verificando requisitos previos..."

# Verificar Java
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2)
    print_success "Java encontrado: $JAVA_VERSION"
else
    print_error "Java no encontrado. Por favor instala Java 17+"
    exit 1
fi

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js encontrado: $NODE_VERSION"
else
    print_error "Node.js no encontrado. Por favor instala Node.js 18+"
    exit 1
fi

# Verificar Docker
if command -v docker &> /dev/null; then
    print_success "Docker encontrado"
else
    print_error "Docker no encontrado. Por favor instala Docker"
    exit 1
fi

# Verificar Docker Compose
if command -v docker-compose &> /dev/null; then
    print_success "Docker Compose encontrado"
else
    print_error "Docker Compose no encontrado. Por favor instala Docker Compose"
    exit 1
fi

print_status "Todos los requisitos previos están satisfechos!"

# Configurar backend
print_status "Configurando backend..."
cd backend
if [ -f "./gradlew" ]; then
    print_status "Ejecutando build del backend..."
    ./gradlew clean build -x test
    if [ $? -eq 0 ]; then
        print_success "Backend configurado correctamente"
    else
        print_error "Error al configurar el backend"
        exit 1
    fi
else
    print_error "Gradlew no encontrado en el backend"
    exit 1
fi
cd ..

# Configurar frontend
print_status "Configurando frontend..."
cd frontend
if [ -f "package.json" ]; then
    print_status "Instalando dependencias del frontend..."
    npm ci
    if [ $? -eq 0 ]; then
        print_success "Dependencias del frontend instaladas"
    else
        print_error "Error al instalar dependencias del frontend"
        exit 1
    fi
    
    print_status "Construyendo frontend..."
    npm run build
    if [ $? -eq 0 ]; then
        print_success "Frontend construido correctamente"
    else
        print_error "Error al construir el frontend"
        exit 1
    fi
else
    print_error "package.json no encontrado en el frontend"
    exit 1
fi
cd ..

# Verificar puertos
print_status "Verificando puertos disponibles..."

check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        print_warning "Puerto $1 está en uso"
        return 1
    else
        print_success "Puerto $1 está disponible"
        return 0
    fi
}

check_port 8081
check_port 3307
check_port 9200
check_port 5601

# Crear archivos de configuración si no existen
print_status "Verificando archivos de configuración..."

if [ ! -f "docker/.env" ]; then
    print_status "Creando archivo .env..."
    cat > docker/.env << EOF
# Configuración del entorno ISA E-commerce
COMPOSE_PROJECT_NAME=isa-store
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=store
MYSQL_USER=store
MYSQL_PASSWORD=store
ELASTICSEARCH_HEAP_SIZE=512m
EOF
    print_success "Archivo .env creado"
fi

# Dar permisos de ejecución a scripts
print_status "Configurando permisos de scripts..."
chmod +x docker/start-elk.sh
chmod +x docker/stop-elk.sh

print_success "Configuración completada!"

echo ""
echo "🎉 ¡Proyecto ISA E-commerce configurado correctamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Para iniciar la aplicación: cd docker && docker-compose up -d"
echo "2. Para acceder a la aplicación: http://localhost:8081"
echo "3. Para ver logs en Kibana: http://localhost:5601"
echo "4. Para ejecutar tests: cd backend && ./gradlew test"
echo "5. Para ejecutar tests E2E: cd backend && npm run e2e:run"
echo ""
echo "📚 Documentación completa en README.md"
echo "" 