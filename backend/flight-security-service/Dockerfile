FROM amazoncorretto:17-alpine

WORKDIR /flight-security-service

COPY target/flight-security-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 9091

ENTRYPOINT ["java","-jar","app.jar","--spring.profiles.active=docker"]