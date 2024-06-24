# Backend Service for Location Management

## Introduction

This project is a backend service for managing location data, built using Node.js and TypeScript. It provides APIs for various location-based operations and utilizes MongoDB as the database.

### Table of Contents

1. Introduction
2. Installation
3. Usage
4. Features
5. Dependencies
6. Configuration
7. Documentation
8. Troubleshooting

Installation
To install and set up this project, follow these steps:

Clone the repository:

    git clone <repository_url>
    cd backend

Install dependencies:

    npm install

Set up environment variables:

Copy the .env.example to .env and configure the necessary environment variables.

Usage
To start the backend service, use the following command:

    npm start

This command will run the service in development mode using nodemon, which will automatically restart the server on code changes.

### Features

CRUD operations for location data
Integration with MongoDB
RESTful API endpoints
Dependencies
The main dependencies for this project are:

- Node.js
- TypeScript
- Express
- MongoDB
- Nodemon

For a complete list of dependencies, refer to the package.json file.

### Configuration

The project configuration is managed through environment variables. The following configuration files are available:

- nodemon.json: Configuration for Nodemon.
- tsconfig.json: TypeScript configuration.

### Documentation

The source code and API routes are organized as follows:

#### Source Code

- src/index.ts: Entry point of the application.
- src/server.ts: Server setup and configuration.
- src/dao/locationsDAO.ts: Data Access Object for locations.
- src/api/locations.route.ts: API route definitions for locations.
- src/api/locations.controller.ts: Controller logic for location routes.

### Troubleshooting

Ensure all dependencies are installed by running npm install.
Check that MongoDB is running and accessible with the configured connection string. Also make sure to add your IP address in the security settings of MongoDB Atlas.
