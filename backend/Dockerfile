FROM openjdk:17-jdk-slim
WORKDIR /app
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN ./mvnw dependency:go-offline -B
COPY src ./src
RUN ./mvnw clean package -DskipTests
EXPOSE 2706
CMD ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]
