FROM amazoncorretto:17-alpine

WORKDIR /flight-api-gateway

COPY target/flight-api-gateway-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 9090

ENTRYPOINT ["java","-jar","app.jar","--spring.profiles.active=docker"]