FROM amazoncorretto:17-alpine

RUN apk add --no-cache curl

WORKDIR /flight-config-server

COPY target/flight-config-server-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8888

ENTRYPOINT ["java","-jar","app.jar","--spring.profiles.active=docker"]