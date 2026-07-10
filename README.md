# Customer Management System

A full-stack Customer Management CRUD application built with Angular, Spring Boot, and MySQL.

The application provides a responsive interface to create, view, update, delete, search, filter, and manage customer records.

## Features

- Create new customers
- View all customers
- Update customer details
- Delete customers with confirmation
- Auto-generated Customer ID with `CUST` prefix
- Unique email validation
- Frontend and backend validations
- Minimum age validation of 18 years
- Active and Inactive customer status management
- Search customers by name, email, mobile number, Customer ID, city, and state
- Filter customers by Active and Inactive status
- Client-side pagination
- Responsive user interface
- Loading indicators for API operations
- Success and error notifications
- Global exception handling
- Meaningful REST API error responses
- Service-layer unit testing

## Tech Stack

### Frontend

- Angular
- TypeScript
- HTML
- CSS
- Angular Reactive Forms
- HttpClient
- RxJS

### Backend

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Jakarta Bean Validation
- MySQL
- Maven
- JUnit 5
- Mockito

## Project Structure

```text
Customer Management/
├── frontend/                              # Angular application
│   ├── public/                            # Static frontend assets
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/                # Reusable UI components
│   │   │   │   ├── confirmation-modal/
│   │   │   │   ├── customer-form/
│   │   │   │   ├── customer-list/
│   │   │   │   ├── footer/
│   │   │   │   ├── header/
│   │   │   │   └── toast/
│   │   │   ├── models/                    # TypeScript interfaces and types
│   │   │   ├── pages/                     # Page-level Angular views
│   │   │   │   └── customer-management/
│   │   │   ├── services/                  # HttpClient and notification services
│   │   │   ├── app.config.ts              # Angular application providers
│   │   │   ├── app.routes.ts              # Angular routes
│   │   │   └── app.ts                     # Root Angular component
│   │   ├── main.ts                        # Angular bootstrap entry point
│   │   └── styles.css                     # Global styles
│   ├── angular.json                       # Angular workspace configuration
│   ├── package.json                       # npm scripts and dependencies
│   ├── package-lock.json                  # Locked npm dependency versions
│   ├── tsconfig.json                      # Base TypeScript configuration
│   ├── tsconfig.app.json                  # App TypeScript configuration
│   └── tsconfig.spec.json                 # Test TypeScript configuration
├── backend/                               # Spring Boot application
│   ├── .mvn/
│   │   └── wrapper/                       # Maven Wrapper configuration
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/customermanagement/
│   │   │   │   ├── config/                # CORS and application configuration
│   │   │   │   ├── controller/            # REST API controllers
│   │   │   │   ├── dto/                   # Request, response, and error DTOs
│   │   │   │   ├── entity/                # JPA entities and enums
│   │   │   │   ├── exception/             # Custom exceptions and global handler
│   │   │   │   ├── repository/            # Spring Data JPA repositories
│   │   │   │   ├── service/               # Service interfaces and ID generation
│   │   │   │   │   └── impl/              # Service implementations
│   │   │   │   ├── validation/            # Custom Bean Validation annotations
│   │   │   │   └── BackendApplication.java
│   │   │   └── resources/
│   │   │       ├── static/
│   │   │       ├── templates/
│   │   │       ├── application.properties # MySQL and JPA configuration
│   │   │       └── schema.sql             # Database table initialization
│   │   └── test/
│   │       └── java/com/example/customermanagement/
│   │           ├── service/
│   │           │   └── impl/              # Service-layer unit tests
│   │           └── BackendApplicationTests.java
│   ├── mvnw                               # Maven Wrapper script for Unix/macOS
│   ├── mvnw.cmd                           # Maven Wrapper script for Windows
│   └── pom.xml                            # Maven project configuration
├── .gitignore
└── README.md
```

## Customer Fields

| Field | Description |
| --- | --- |
| Customer ID | Automatically generated with `CUST` prefix |
| First Name | Required, 2 to 50 characters |
| Last Name | Required, 2 to 50 characters |
| Email | Required, valid, and unique |
| Mobile Number | Required, exactly 10 digits |
| Date of Birth | Required, customer must be at least 18 years old |
| Gender | Male, Female, or Other |
| Address | Required, maximum 250 characters |
| City | Required |
| State | Required |
| Pincode | Required, exactly 6 digits |
| Status | Active or Inactive |

## REST API Endpoints

Base URL:

```text
http://localhost:8080/api/customers
```

| HTTP Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/customers` | Create a new customer |
| GET | `/api/customers` | Get all customers |
| GET | `/api/customers/{customerId}` | Get customer by Customer ID |
| PUT | `/api/customers/{customerId}` | Update an existing customer |
| DELETE | `/api/customers/{customerId}` | Delete a customer |

## Prerequisites

Make sure the following software is installed:

- Java 17
- MySQL Server
- Node.js and npm
- Git

Maven installation is optional because the backend includes the Maven Wrapper.

## Database Configuration

The backend uses MySQL.

Default database name:

```text
customer_management
```

Database settings are read from environment variables with local development defaults:

```properties
DB_URL=jdbc:mysql://localhost:3306/customer_management?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=YOUR_DB_USERNAME
DB_PASSWORD=YOUR_DB_PASSWORD
```

Do not commit real production database credentials to the repository.

The backend also includes `schema.sql`, which creates the required `customers` and `customer_id_sequence` tables if they do not already exist.

## Backend Setup Using IntelliJ IDEA

1. Clone the repository.
2. Open the `backend` folder in IntelliJ IDEA.
3. Wait for Maven dependencies to load.
4. Make sure Java 17 is configured as the Project SDK and Module SDK.
5. Open `Run > Edit Configurations`.
6. Create an Application Run Configuration if one does not already exist.

Use:

```text
Main Class:
com.example.customermanagement.BackendApplication

Module:
backend
```

7. Add environment variables if your MySQL credentials differ from the defaults:

```text
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
```

8. Make sure MySQL Server is running.
9. Run `BackendApplication`.

The backend will start at:

```text
http://localhost:8080
```

## Backend Setup Using Terminal

### Windows PowerShell

Navigate to the backend directory:

```powershell
cd backend
```

Optionally set your MySQL credentials:

```powershell
$env:DB_USERNAME="your_mysql_username"
$env:DB_PASSWORD="your_mysql_password"
```

Run the backend:

```powershell
.\mvnw.cmd spring-boot:run
```

## Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the Angular development server:

```bash
npm run start
```

Open the application in the browser:

```text
http://localhost:4200
```

## Running the Complete Application

Start the services in this order:

```text
1. MySQL Server
2. Spring Boot Backend
3. Angular Frontend
```

Application URLs:

```text
Frontend: http://localhost:4200
Backend: http://localhost:8080
Customer API: http://localhost:8080/api/customers
```

## Running Backend Tests

Navigate to the backend directory:

```bash
cd backend
```

On Windows:

```powershell
.\mvnw.cmd test
```

## Running Frontend Tests

Navigate to the frontend directory:

```bash
cd frontend
```

Run:

```bash
npm test
```

## Build Commands

### Backend

```powershell
cd backend
.\mvnw.cmd clean package
```

### Frontend

```bash
cd frontend
npm install
npm run build
```

## Validation and Error Handling

The application implements validation on both the Angular frontend and Spring Boot backend.

Examples include:

- Required field validation
- Email format validation
- Duplicate email validation
- 10-digit mobile number validation
- Minimum age validation
- 6-digit pincode validation

The backend uses global exception handling to return meaningful HTTP responses.

```text
400 Bad Request  -> Invalid request or validation error
404 Not Found    -> Customer does not exist
409 Conflict     -> Duplicate email address
500 Server Error -> Unexpected server error
```

## Customer ID Generation

The backend automatically generates Customer IDs using the `CUST` prefix.

Examples:

```text
CUST001
CUST002
CUST003
```

The Angular frontend does not generate Customer IDs.

`customerId` is the primary identifier used for Get, Update, and Delete operations.


