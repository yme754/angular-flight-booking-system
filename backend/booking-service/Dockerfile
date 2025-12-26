FROM amazoncorretto:17-alpine

WORKDIR /booking-service

COPY target/booking-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8083

ENTRYPOINT ["java","-jar","app.jar","--spring.profiles.active=docker"]
