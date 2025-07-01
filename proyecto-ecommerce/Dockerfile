# Etapa de construcción del frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app

# Copiar archivos de configuración del frontend
COPY backend/package*.json ./
COPY backend/webpack webpack/
COPY backend/tsconfig*.json ./
COPY backend/eslint.config.mjs ./
COPY backend/.prettierrc ./
COPY backend/.prettierignore ./
COPY backend/postcss.config.js ./
COPY backend/jest.conf.js ./
COPY backend/cypress.config.ts ./

# Instalar dependencias del frontend
RUN npm ci

# Copiar código fuente del frontend
COPY backend/src/main/webapp src/main/webapp
COPY backend/src/test src/test

# Construir el frontend
RUN npm run webapp:build:prod

# Etapa de construcción del backend
FROM gradle:8.5-jdk17 AS backend-build
WORKDIR /app

# Copiar archivos de gradle y wrapper
COPY backend/gradlew .
COPY backend/gradlew.bat .
COPY backend/gradle gradle/
COPY backend/buildSrc buildSrc/
COPY backend/build.gradle .
COPY backend/settings.gradle .
COPY backend/gradle.properties .
COPY backend/sonar-project.properties .

# Copiar código fuente del backend
COPY backend/src/main/java src/main/java
COPY backend/src/main/resources src/main/resources
COPY backend/src/test src/test

# Copiar el frontend construido
COPY --from=frontend-build /app/build/resources/main/static src/main/resources/static

# Construir la aplicación usando el wrapper, excluyendo webapp
RUN ./gradlew bootJar -x test -x webapp

# Etapa de ejecución
FROM eclipse-temurin:17-jre-focal
WORKDIR /app

# Copiar el jar construido
COPY --from=backend-build /app/build/libs/*.jar app.jar

# Variables de entorno
ENV SPRING_OUTPUT_ANSI_ENABLED=ALWAYS \
    JHIPSTER_SLEEP=0

# Script de inicio
COPY backend/src/main/docker/entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["./entrypoint.sh"] 