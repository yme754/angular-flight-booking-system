# Flight Booking System – Full Stack Reactive Microservices

**Java | Spring Boot | WebFlux | Docker | Kafka | MongoDB | Angular**

A fully **reactive**, **event-driven**, **secure**, full-stack **microservices-based Flight Booking System**.  
This project demonstrates a **production-grade architecture** using **Spring Boot WebFlux**, **Reactive MongoDB**, **Apache Kafka**, **JWT-based Security**, **Angular Frontend**, and full containerization with **Docker**.

All backend services are **independently deployable**, communicate **asynchronously**, and are accessed via a **single API Gateway**.

---

## Flight App

Below image is the **Home Page** of the Angular application.<br>
For remaining UI screens (Login, Register, Flight Search, Add Flights), refer **`angular-ui-outputs.pdf`** included in this repository.

<div align="center">
  <img 
    alt="Home Page"
    src="https://github.com/user-attachments/assets/3cea83ec-f112-4190-879c-8d5af9bc2ab0" />
</div>

---

## System Overview

The ecosystem consists of **8 components**  
**7 backend microservices + 1 frontend application**

Each service is:
- Containerized (Docker)
- Reactive & non-blocking
- Registered with Eureka
- Centrally configured via Config Server
- Can be run **locally** or via **Docker Compose**

---

## Frontend Application

### Angular Client (`:4200`)
**Responsibility**
- User interaction for authentication (login & register), flight search, booking, and admin-only flight management.

**Tech Stack**
- Angular 21.0.0
- TypeScript
- RxJS
- HTML5
- CSS3
- Bootstrap

**Key Features**
- Consumes APIs through API Gateway
- JWT handling using HTTP Interceptors
- Reactive forms for search and booking
- Route guards for secured pages
- Add Flight restricted to Admin role

---

## Core Business Microservices

### Flight Service (`:8082`)
**Responsibility**
- Flight inventory & seat availability management

**Tech**
- Spring WebFlux
- Reactive MongoDB

**Features**
- Reactive CRUD for Flights & Airlines
- Real-time seat tracking
- Admin-only flight creation

---

### Booking Service (`:8083`)
**Responsibility**
- Ticket reservation and cancellation logic

**Tech**
- Spring WebFlux
- Reactive MongoDB
- Spring Kafka

**Features**
- Validates booking against flight inventory
- Publishes Kafka events:
  - `booking-created`
  - `booking-cancelled`
- Non-blocking transaction flow
- Circuit Breaker using Resilience4j

---

### Email Service (`:8084`)
**Responsibility**
- User notifications

**Tech**
- Spring Boot
- Spring Kafka
- JavaMailSender

**Features**
- Kafka Consumer for booking events
- Completely decoupled from booking flow
- Ensures zero user-visible latency

---

### Security Service (`:9091`)
**Responsibility**
- Authentication & Authorization

**Tech**
- Spring Security (Reactive)
- JWT
- BCrypt

**Features**
- User Signup & Login
- JWT Token Generation
- Stateless security
- Role-based access (User vs Admin)

---

## Infrastructure Services

### API Gateway (`:9090`)
**Responsibility**
- Single entry point for frontend traffic

**Tech**
- Spring Cloud Gateway

**Features**
- JWT Validation Filter
- CORS Configuration (`localhost:4200`)
- Dynamic routing via Eureka
- Load balancing

---

### Service Registry (`:8761`)
**Responsibility**
- Service Discovery

**Tech**
- Spring Cloud Netflix Eureka

**Features**
- All services auto-register on startup
- Gateway routes by service name

---

### Config Server (`:8888`)
**Responsibility**
- Centralized configuration management

**Tech**
- Spring Cloud Config

**Features**
- Externalized configs (DB, Kafka, Ports)
- Separate `application.properties` per service
- No redeployment required for config changes

---

## Tech Stack

### Frontend
- Angular 21.0.0
- RxJS
- TypeScript

### Backend
- Java 17
- Spring Boot
- Spring WebFlux
- Spring Security (JWT)
- Spring Cloud Gateway
- Eureka
- Config Server
- Kafka
- Resilience4j
- OpenFeign
- Maven

### Database
- MongoDB (Reactive Driver)
- Databases:
  - `flightdb`
  - `bookingdb`
  - `flight_security_db`

### Messaging
- Apache Kafka
- Zookeeper

### DevOps
- Docker
- Docker Compose
- Can run **locally** or **fully containerized**

### Testing & Quality
- JUnit 5
- Mockito
- WebTestClient
- Reactor Test
- JaCoCo (>90% code coverage)
- SonarQube Cloud (>90% code coverage)

### Performance Testing
- Apache JMeter

---

## Event-Driven Architecture (Kafka)

| Topic              | Trigger                       | Consumer Action                     |
|-------------------|------------------------------|-------------------------------------|
| booking-created   | Booking confirmation         | Email Service sends confirmation    |
| booking-cancelled | Booking cancellation         | Email Service sends cancellation    |

---

## Reactive Design

- **Backend:** Project Reactor (`Mono`, `Flux`)
- **Frontend:** RxJS Observables
- Fully non-blocking I/O
- High throughput & scalability

---

## Circuit Breaker (Resilience4j)

Implemented in **Booking Service**

- Fail-fast on downstream failures
- Fallback responses to frontend
- Protects system stability

---

## Deployment

### Local
- Run each microservice with `mvn spring-boot:run`
- Angular frontend with `ng serve`
- MongoDB & Kafka/Zookeeper must be running locally

### Docker
- Use `docker-compose up` to start all services
- Each service has its own `Dockerfile`
- Config Server loads externalized `application.properties`

---

## Architecture Flow

1. User interacts with **Angular Client**
2. Requests go to **API Gateway**
3. Gateway routes to backend services
4. Services communicate via:
   - Eureka
   - Kafka
   - MongoDB

---

## Architecture Diagram

<div align="center">
  <img 
    alt="Architecture Diagram"
    src="https://github.com/user-attachments/assets/b8742ce5-f661-4d74-b736-02a992f35767"
  />
</div>

---

## Access Control

- **User Role**
  - Search flights
  - Book flights
  - View bookings

- **Admin Role**
  - Add flights
  - Manage inventory
  - Full access to booking data

---
