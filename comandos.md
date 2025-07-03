# COMANDOS COMPLETOS - TRABAJO FINAL INGENIERÍA DE SOFTWARE APLICADA

## REQUERIMIENTOS IMPLEMENTADOS

### 1.APLICACIÓN JHIPSTER CON JDL

**Verificar que el backend esté corriendo:**
```bash
# Verificar salud del backend
curl http://localhost:8081/management/health

# Verificar que responde correctamente
{"status":"UP","groups":["liveness","readiness"]}
```

**Iniciar el backend JHipster:**
```bash
cd proyecto-ecommerce/backend
./gradlew bootRun
```

**URLs de acceso:**
- Backend API: http://localhost:8081
- Swagger API Docs: http://localhost:8081/swagger-ui/index.html

---

### 2.TESTS DE UNIDAD (2 archivos personalizados)

**Ejecutar tests unitarios:**
```bash
cd proyecto-ecommerce/backend
gradle test --no-daemon
```

**Verificar tests personalizados:**
```bash
# Verificar que existen los archivos de test personalizados
ls -la src/test/java/com/jhipster/demo/store/domain/TestdeProductos.java

# Ejecutar solo los tests personalizados
gradle test --tests "*TestdeProductos*" --tests "*CustomerDetailsUnitTest*"
```



### 3. TESTS E2E CON CYPRESS (3 tests)

**Ejecutar tests E2E:**
```bash
cd store-pwa
npx cypress run
```

**Ejecutar tests E2E con interfaz visual:**
```bash
cd store-pwa
npx cypress open
```

**Verificar que los tests existen:**
```bash
ls -la cypress/e2e/pruebas-tienda.cy.ts
```

**Si aparece error de supportFile:**
```bash
# Verificar que existe el archivo de soporte
ls -la cypress/support/e2e.ts

# Si no existe, crearlo o verificar la configuración en cypress.config.ts
```

**Resultado esperado:**
- 3 tests E2E pasando
- Login usando API + navegación PWA
- Creación de productos via API



### 4. DEPLOY EN DOCKER

**Construir imagen Docker:**
```bash
cd proyecto-ecommerce
docker build -t isa-store:latest .
```

**Ejecutar contenedor:**
```bash
docker run -p 8081:8081 isa-store:latest
```

**Verificar contenedor:**
```bash
docker ps
docker images | grep isa-store
```



### 5. SERVIDOR DE LOGS ELK

**Iniciar stack ELK:**
```bash
cd proyecto-ecommerce/docker
./start-elk.sh
```

**Verificar servicios ELK:**
```bash
# Elasticsearch
curl http://localhost:9200

# Kibana
curl http://localhost:5601

# Verificar contenedores
docker ps | grep elk
```

**Detener stack ELK:**
```bash
cd proyecto-ecommerce/docker
./stop-elk.sh
```



### 6. APLICACIÓN PROGRESIVA IONIC

**Iniciar aplicación Ionic PWA:**
```bash
cd store-pwa
npm run dev
```

**Verificar que esté corriendo:**
```bash
curl http://localhost:3000
```

**URLs de acceso:**
- PWA: http://localhost:3000
- Título: "Tienda de Libros PWA"


### 7. PWA CON FUNCIONALIDAD OFFLINE

**Verificar archivos PWA:**
```bash
cd store-pwa
ls -la public/sw.js
ls -la public/manifest.webmanifest
```

**Verificar configuración PWA:**
```bash
# Verificar manifest
cat public/manifest.webmanifest

# Verificar service worker
head -10 public/sw.js
```

### 8. JENKINS CI/CD PIPELINE

**Verificar estado de Jenkins:**
```bash
sudo systemctl status jenkins
```

**Iniciar Jenkins (si no está corriendo):**
```bash
sudo systemctl start jenkins
```

**Acceder a Jenkins:**
- URL: http://localhost:8080
- Usuario: admin
- Contraseña: admin

**Ejecutar pipeline:**
1. Ir a http://localhost:8080
2. Login con admin/admin
3. Seleccionar job "store-isa"
4. Click en "Build Now"


## COMANDOS DE VERIFICACIÓN RÁPIDA

### **Verificar todo el stack:**
```bash
# 1. Backend JHipster
curl http://localhost:8081/management/health

# 2. PWA Ionic
curl http://localhost:3000

# 3. Jenkins
curl http://localhost:8080

# 4. ELK Stack
curl http://localhost:9200
curl http://localhost:5601

# 5. Docker
docker ps
```

### **Ejecutar tests completos:**
```bash
# Tests unitarios
cd proyecto-ecommerce/backend
gradle test --no-daemon

# Tests E2E
cd store-pwa
npx cypress run
```


## COMANDOS DE MONITOREO

### **Ver logs en tiempo real:**
```bash
# Backend logs
cd proyecto-ecommerce/backend
tail -f logs/application.log

# Docker logs
docker logs -f $(docker ps -q --filter "name=isa-store")

# Jenkins logs
sudo journalctl -u jenkins -f
```

### **Verificar recursos del sistema:**
```bash
# Uso de memoria y CPU
htop

# Puertos en uso
sudo lsof -i :8080
sudo lsof -i :8081
sudo lsof -i :3000
sudo lsof -i :9200
sudo lsof -i :5601
```


## COMANDOS DE TROUBLESHOOTING

### **Si el backend no inicia:**
```bash
# Verificar puerto MySQL
sudo lsof -i :3306

# Detener MariaDB si está ocupando el puerto
sudo systemctl stop mariadb

# Reiniciar backend
cd proyecto-ecommerce/backend
./gradlew bootRun
```

### **Si la PWA no carga:**
```bash
# Verificar que esté corriendo
ps aux | grep vite

# Reiniciar PWA
cd store-pwa
pkill -f vite
npm run dev
```

### **Si Jenkins no responde:**
```bash
# Reiniciar Jenkins
sudo systemctl restart jenkins

# Verificar logs
sudo journalctl -u jenkins -n 50
```

### **Si Cypress da error de supportFile:**
```bash
# Verificar configuración
cat store-pwa/cypress.config.ts

# Verificar archivo de soporte
ls -la store-pwa/cypress/support/e2e.ts

# Ejecutar desde el directorio correcto
cd store-pwa
npx cypress run
```

---

## COMANDOS PARA DEMOSTRACIÓN AL PROFESOR

### **Secuencia de demostración:**
```bash
# 1. Mostrar que todo está corriendo
curl http://localhost:8081/management/health
curl http://localhost:3000
curl http://localhost:8080

# 2. Ejecutar tests unitarios
cd proyecto-ecommerce/backend
gradle test --no-daemon --quiet | grep "Tests:"

# 3. Ejecutar tests E2E
cd store-pwa
npx cypress run --spec "cypress/e2e/pruebas-tienda.cy.ts"

# 4. Mostrar Jenkins pipeline
# Ir a http://localhost:8080 y ejecutar "Build Now"

# 5. Mostrar ELK stack
curl http://localhost:9200
curl http://localhost:5601
```

