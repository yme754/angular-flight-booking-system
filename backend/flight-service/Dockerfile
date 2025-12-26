FROM amazoncorretto:17-alpine

RUN apk add --no-cache curl

WORKDIR /flight-service

COPY target/flight-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java","-jar","app.jar","--spring.profiles.active=docker"]