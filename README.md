# CacheMoney

## Introduction

CacheMoney is a project divided into three main parts:

1. Web App
2. Mobile App
3. Backend

The web development uses the MERN stack, while the mobile app utilizes React Native and Expo. All JavaScript code is written in TypeScript.

## Table of Contents

- [Introduction](#introduction)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Backend](#backend)
  - [Web](#web)
  - [Mobile](#mobile)
- [Usage](#usage)
  - [Backend](#backend-1)
  - [Web](#web-1)
  - [Mobile](#mobile-1)
- [Features](#features)
- [Configuration](#configuration)

## Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v14.x or higher)
- **npm** (v6.x or higher)
- **TypeScript** (globally installed)  

  ```sh
  npm install -g typescript
  ```

- **Expo CLI** (globally installed)  

  ```sh
  npm install -g expo-cli
  ```

- **MongoDB** (We're using an Atlas MongoDB cluster)

### Backend

1. Navigate to the `backend` directory:

   ```sh
   cd backend
   ```

2. Install the dependencies:

   ```sh
    npm install
    ```

3. Ensure the following packages are installed:

- **Express**

   ```sh
    npm install express
    ```

- **NodeMon**

   ```sh
   npm install -g nodemon
   ```

- **CORS**

   ```sh
   npm install cors
   ```

- **Dotenv**

   ```sh
   npm install dotenv
   ```

- **MongoDB**

   ```sh
   npm install mongodb
   ```

- **@types/node, @types/express, @types/cors** (for TypeScript):

   ```sh
   npm install -D @types/node @types/express @types/cors
   ```

### Web

1. Navigate to the `web` directory:

   ```sh
   cd web
   ```

2. Install the dependencies:

   ```sh
    npm install
    ```

3. Ensure the following packages are installed:

- **React**

   ```sh
    npm install react react-dom
    ```

- **@types/react, @types/react-dom** (for TypeScript):

   ```sh
   npm install -D @types/react @types/react-dom
   ```

### Mobile

1. Navigate to the `mobile` directory:

   ```sh
   cd mobile
   ```

2. Install the dependencies:

   ```sh
    npm install
    ```

3. Ensure the following packages are installed:

- **React Native**

   ```sh
    npm install react-native
    ```

- **React Native Types**

   ```sh
   npm install @types/react-native
   ```  

## Usage

### Backend

1. Add your external IP address to the Atlas MongoDB cluster security settings.
2. Start the backend server:

   ```sh
   npm start
   ```

   or to debug, go to the run and debug tab in VSCode and select the "Debug Backend" configuration.

3. Access the data at <http://localhost:5000/locations>.


### Web

1. Start the web app:

   ```sh
   npm start
   ```

   or to debug, go to the run and debug tab in VSCode and select the "Debug Web (React)" configuration.

2. Access the web app at <http://localhost:3000/>.

### Mobile

1. Start the mobile app:

   ```sh
   npx expo start
   ```

   or to debug, go to the run and debug tab in VSCode and select the "Debug Mobile (Expo)" configuration.

2. Access the mobile app using the Expo Go app on your mobile device by scanning the QR Code (or in a simulator on your device, using one of the other options).

## Features

- The backend connects to the Atlas MongoDB cluster and retrieves sample data, including locations.
- The mobile app is a basic React Native app with placeholder code.
- The web app is built using the MERN stack.

## Configuration

Configuration details should be added to the respective .env files in each directory if needed.

