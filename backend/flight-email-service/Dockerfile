FROM eclipse-temurin:17-jdk

WORKDIR /flight-email-service

COPY target/flight-email-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8085

ENTRYPOINT ["java","-jar","app.jar","--spring.profiles.active=docker"]