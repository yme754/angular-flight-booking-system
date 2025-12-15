# Flight Booking System – Full Stack Reactive Microservices

**Java | Spring Boot | WebFlux | Docker | Kafka | MongoDB | Angular**

A fully **reactive**, **event-driven**, **secure**, full-stack **microservices-based Flight Booking System**.  
This project demonstrates a **production-grade architecture** using **Spring Boot WebFlux**, **Reactive MongoDB**, **Apache Kafka**, **JWT-based Security**, **Angular Frontend**, and full containerization with **Docker**.

All backend services are **independently deployable**, communicate **asynchronously**, and are accessed via a **single API Gateway**.

---

## System Overview

The ecosystem consists of **8 components**  
**7 backend microservices + 1 frontend application**

Each service is:
- Containerized
- Reactive & non-blocking
- Registered with Eureka
- Centrally configured via Config Server

---

## Frontend Application

### Angular Client (`:4200`)
**Responsibility**
- User interaction for authentication(login & register), flight search.

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
- Reactive forms for search
- Route guards for secured pages

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
    src="https://github.com/user-attachments/assets/634a7f84-9bc2-43aa-894d-c81f61be55f8"
  />
</div>

---
