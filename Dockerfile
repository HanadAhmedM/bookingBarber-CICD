
# =========================
# Build frontend
# =========================
FROM node:22-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ .

RUN npm run build


# =========================
# Build backend
# =========================
FROM maven:3.9-eclipse-temurin-21 AS backend-build

WORKDIR /app/backend

COPY backend/pom.xml .

RUN mvn dependency:go-offline -B

COPY backend/src ./src

RUN mvn clean package -DskipTests


# =========================
# Production
# =========================
FROM nginx:alpine

RUN apk add --no-cache openjdk21-jre supervisor

COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

COPY --from=backend-build /app/backend/target/*.jar /app/backend.jar

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisord.conf"]

