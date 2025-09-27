# ========= BUILD STAGE =========
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom and download dependencies first (better cache)
COPY pom.xml ./
RUN mvn -q -e -DskipTests dependency:go-offline

# Copy source and build
COPY src ./src
RUN mvn -q -DskipTests package

# ========= RUNTIME STAGE =========
FROM eclipse-temurin:21-jre
WORKDIR /app

# Add a non-root user
RUN useradd -ms /bin/bash spring
USER spring

# Copy jar
COPY --from=build /app/target/*.jar /app/app.jar

# Expose default Spring Boot port
EXPOSE 8080

# Health check (optional)
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java","-jar","/app/app.jar"]


