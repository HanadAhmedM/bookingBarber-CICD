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

RUN apk add --no-cache openjdk21-jre supervisor netcat-openbsd

COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

COPY --from=backend-build /app/backend/target/backend-0.0.1-SNAPSHOT.jar /app/backend.jar

COPY nginx.conf.template /etc/nginx/templates/default.conf.template

COPY supervisord.conf /etc/supervisord.conf

COPY start.sh /start.sh

RUN chmod +x /start.sh

EXPOSE 10000

ENTRYPOINT ["/start.sh"]
