# Multi-stage build for smaller final image
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN ./mvnw dependency:go-offline -B
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Final runtime image - using eclipse-temurin which is more reliable
FROM eclipse-temurin:17-jre
WORKDIR /app
# Copy only the built JAR file
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 2706
CMD ["java", "-jar", "app.jar"]
