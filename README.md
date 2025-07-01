# Proyecto E-Commerce Completo con JHipster

Este proyecto implementa una aplicación e-commerce completa siguiendo los requisitos académicos, incluyendo backend JHipster, tests, Docker, ELK logging, Jenkins CI/CD y una aplicación Ionic PWA.

## 🎯 Requisitos Completados

### ✅ 1. Aplicación JHipster desde Modelo JDL
- **Modelo JDL**: `simple-shop.jdl` con entidades Book, Customer y Order
- **Backend**: Aplicación Spring Boot con JPA, REST API, y Swagger
- **Frontend**: Interfaz web integrada con Angular/React
- **Base de datos**: PostgreSQL configurado

### ✅ 2. Tests Unitarios y E2E con Cypress
- **Tests Unitarios**: Implementados en Java para entidades principales
- **Tests E2E**: Configurados con Cypress para flujos de usuario
- **Cobertura**: Tests en español con comentarios detallados

### ✅ 3. Deployment con Docker
- **Dockerfile**: Multi-stage build optimizado
- **Docker Compose**: Configuración completa con MySQL y ELK
- **Puertos**: Configurados para evitar conflictos (8081, 3307, etc.)

### ✅ 4. Servidor de Logging ELK
- **Elasticsearch**: Almacenamiento y búsqueda de logs
- **Logstash**: Procesamiento y enriquecimiento de logs
- **Kibana**: Visualización y análisis de logs
- **Configuración**: Pipeline personalizado para la aplicación

### ✅ 5. Jenkins CI/CD
- **Pipeline**: Jenkinsfile completo con múltiples stages
- **Tests**: Ejecución automática de tests unitarios y E2E
- **Build**: Construcción de imagen Docker
- **Deploy**: Despliegue automático a producción

### ✅ 6. Aplicación Ionic PWA
- **PWA Completa**: Instalable en dispositivos móviles
- **Gestión CRUD**: Libros, Clientes y Órdenes
- **Dashboard**: Estadísticas en tiempo real
- **Service Worker**: Funcionalidad offline
- **API Integration**: Consume el backend JHipster

## 🏗️ Arquitectura del Proyecto

```
proyecto-ecommerce/
├── backend/                    # Aplicación JHipster
│   ├── src/
│   │   ├── main/java/         # Código Java
│   │   ├── main/resources/    # Configuración
│   │   └── test/              # Tests unitarios
│   ├── simple-shop.jdl        # Modelo de dominio
│   └── Dockerfile             # Build del backend
├── docker/                     # Configuración Docker
│   ├── docker-compose.yml     # Orquestación completa
│   ├── docker-elk.yml         # Stack ELK
│   └── logstash/              # Configuración Logstash
├── store-pwa/                  # Aplicación Ionic PWA
│   ├── src/
│   │   ├── pages/             # Páginas de la aplicación
│   │   ├── services/          # Servicios de API
│   │   └── App.tsx            # Componente principal
│   ├── public/
│   │   ├── manifest.webmanifest # Configuración PWA
│   │   └── sw.js              # Service Worker
│   └── README.md              # Documentación PWA
├── Jenkinsfile                 # Pipeline CI/CD
└── README.md                   # Documentación principal
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Docker y Docker Compose
- Node.js 16+
- Java 17+
- Jenkins (opcional para CI/CD)

### 1. Backend JHipster
```bash
cd proyecto-ecommerce/backend
./gradlew bootRun
```

### 2. Stack Completo con Docker
```bash
cd proyecto-ecommerce/docker
docker-compose up -d
```

### 3. Stack ELK
```bash
cd proyecto-ecommerce/docker
./start-elk.sh
```

### 4. Aplicación PWA
```bash
cd store-pwa
npm install
npm start
```

## 📊 Servicios y Puertos

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Backend JHipster | 8081 | API REST principal |
| MySQL | 3307 | Base de datos |
| Elasticsearch | 9200 | Búsqueda y almacenamiento |
| Kibana | 5601 | Visualización de logs |
| Logstash | 5044 | Procesamiento de logs |
| PWA | 3000 | Aplicación Ionic |

## 🔧 Configuración de ELK

### Elasticsearch
- URL: http://localhost:9200
- Configuración: Single-node cluster
- Seguridad: Deshabilitada para desarrollo

### Kibana
- URL: http://localhost:5601
- Dashboards: Configurados para logs de aplicación
- Visualizaciones: Gráficos de logs en tiempo real

### Logstash
- Pipeline: Configurado para procesar logs de Spring Boot
- Filtros: Enriquecimiento de logs con metadatos
- Output: Envío a Elasticsearch

## 🧪 Testing

### Tests Unitarios
```bash
cd proyecto-ecommerce/backend
./gradlew test
```

### Tests E2E con Cypress
```bash
cd proyecto-ecommerce/backend
npm run e2e:run
```

### Tests PWA
```bash
cd store-pwa
npm test
```

## 🔄 CI/CD Pipeline

El pipeline de Jenkins incluye:

1. **Checkout**: Descarga del código fuente
2. **Build Backend**: Compilación con Gradle
3. **Tests Backend**: Ejecución de tests unitarios
4. **Build Frontend**: Construcción de assets
5. **Tests Frontend**: Tests de componentes
6. **E2E Tests**: Tests de integración
7. **Docker Build**: Construcción de imagen
8. **Deploy**: Despliegue automático

## 📱 Funcionalidades PWA

### Dashboard
- Estadísticas en tiempo real
- Contadores de entidades
- Navegación rápida

### Gestión de Libros
- CRUD completo
- Validación de datos
- Interfaz intuitiva

### Gestión de Clientes
- Registro de clientes
- Información de contacto
- Historial de compras

### Gestión de Órdenes
- Creación de pedidos
- Estados de órdenes
- Cálculo de totales

## 🔍 Monitoreo y Logging

### Logs de Aplicación
- Logs estructurados en JSON
- Niveles de log configurables
- Integración con ELK stack

### Métricas
- Health checks automáticos
- Métricas de aplicación
- Monitoreo de rendimiento

## 🛠️ Desarrollo

### Estructura de Desarrollo
- **Backend**: Spring Boot con JHipster
- **Frontend**: Angular/React integrado
- **PWA**: Ionic React independiente
- **DevOps**: Docker + Jenkins

### Flujo de Trabajo
1. Desarrollo en ramas feature
2. Tests automáticos en CI
3. Build y deploy automático
4. Monitoreo en producción

## 📚 Documentación Adicional

- [Documentación JHipster](https://www.jhipster.tech/)
- [Documentación Ionic](https://ionicframework.com/docs)
- [Documentación ELK](https://www.elastic.co/guide/index.html)
- [Documentación Docker](https://docs.docker.com/)

## 🎓 Aspectos Académicos

Este proyecto demuestra:

- **Arquitectura de Microservicios**: Backend modular
- **Desarrollo Full-Stack**: Frontend y backend integrados
- **DevOps**: CI/CD, Docker, monitoreo
- **Testing**: Unitarios, integración y E2E
- **PWA**: Aplicaciones web progresivas
- **Logging**: Centralizado con ELK stack

## 📄 Licencia

Proyecto académico para demostración de tecnologías modernas de desarrollo web.

---

**Desarrollado como proyecto final académico** 🎓 # store-isa
