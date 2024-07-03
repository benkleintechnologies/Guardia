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

None should be needed

### Web

1. Navigate to the `web` directory:

   ```sh
   cd web
   ```

2. Install the dependencies:

   ```sh
    npm install
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

## Usage

### Database

For the database we're using MongoDB Atlas.

Login is here: <https://account.mongodb.com/account/login>

Use "Sign in with Google" and the CacheMoney613@gmail.com account to log in.

### Backend Server

We're now using Firebase as the backend (for authentication and storing data in Firestore).

### Web App

1. Start the web app:

   ```sh
   npm start
   ```

   or to debug, go to the run and debug tab in VSCode and select the "Debug Web (React)" configuration.

2. Access the web app at <http://localhost:3000/>.

### Mobile App

1. Start the mobile app:

   ```sh
   npx expo start
   ```

   or to debug, go to the run and debug tab in VSCode and select the "Debug Mobile (Expo)" configuration.

   Only got iOS to run successfully using `npx react-native run-ios`

2. Access the mobile app using the Expo Go app on your mobile device by scanning the QR Code (or in a simulator on your device, using one of the other options).

## Features

- The backend connects to the Atlas MongoDB cluster and retrieves sample data, including locations.
- The mobile app is a basic React Native app with placeholder code.
- The web app is built using React and Typescript.

## Configuration

Configuration details should be added to the respective .env files in each directory if needed.
