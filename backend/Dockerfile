# ==========================================
# Steg 1: Bygg applikationen med Maven
# ==========================================
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Kopiera pom.xml först (cache-optimering)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Kopiera källkoden och bygg
COPY src ./src
RUN mvn clean package -DskipTests -B

# ==========================================
# Steg 2: Kör applikationen med minimal JRE
# ==========================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Skapa en icke-root användare (säkerhet)
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Kopiera den byggda JAR-filen
COPY --from=build /app/target/*.jar app.jar

# Render sätter PORT automatiskt – default 8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]