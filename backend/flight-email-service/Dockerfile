FROM openjdk:17-jdk-alpine

WORKDIR /flight-email-service

COPY target/flight-email-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8085

ENTRYPOINT ["java","-jar","app.jar","--spring.profiles.active=docker"]