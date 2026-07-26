# ---------- Stage 1: Build the jar with Maven ----------
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy only the files needed to resolve dependencies first (better layer caching)
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw

# Copy the rest of the source and build
COPY src src
RUN ./mvnw clean package -DskipTests

# ---------- Stage 2: Run the jar on a lightweight JRE ----------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built jar from the previous stage (name-agnostic wildcard)
COPY --from=build /app/target/*.jar app.jar

# Render injects a $PORT environment variable at runtime and routes traffic to it.
# Your application.properties should contain: server.port=${PORT:8080}
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]