# Guardia

![Guardia](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue.svg)

Guardia is a **real-time location tracking** platform designed to enhance **emergency response** capabilities for כיתות כוננות (emergency response teams). The system allows for seamless coordination between field personnel and command centers, ensuring swift and informed decision-making during critical situations.

## 🚀 Features

- **Real-Time Location Tracking**: Field personnel's locations are updated live on the command center's dashboard.
- **SOS Messaging**: Users can send instant emergency alerts.
- **Customizable Visibility**: Command centers can control visibility for different user groups.
- **Inertial Navigation**: Tracks user movement even without GPS by using device sensors.
- **Team Sharing**: Facilitates cross-team communication and coordination for complex emergencies.

## 🛠️ Tech Stack

- **TypeScript**: Codebase is written entirely in TypeScript for type safety.
- **React & React Native**: Web app built with React and mobile app with React Native.
- **Firebase**: Handles backend services such as authentication, Firestore database, and hosting.
- **GitHub Actions**: CI/CD pipelines ensure continuous integration and deployment.

## 🏆 Awards

Guardia secured **3rd place** at the **LevTech GreatMinds 8 Hackathon**, showcasing its innovative approach to emergency response management.

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Common Bugs](#common-bugs)
- [Contributors](#contributors)
- [License](#license)

## Installation

### Prerequisites
Ensure you have the following installed:

- **Node.js** (v14.x or higher)
- **npm** (v6.x or higher)
- **Firebase CLI**
- **Expo CLI** (for mobile development)
- **TypeScript** (globally installed)
  ```bash
  npm install -g typescript
  ```

### Step-by-Step Setup

1. **Clone the repository**:
    ```bash
    git clone https://github.com/benkleintechnologies/Guardia.git
    cd Guardia
    ```

2. **Install dependencies**:

   - For web app:
     ```bash
     cd web
     npm install
     ```

   - For mobile app:
     ```bash
     cd mobile
     npm install
     ```

3. **Set up Firebase**:

   - Create a project in the [Firebase Console](https://console.firebase.google.com/).
   - Enable **Firestore**, **Authentication** (with Email/Password and Google sign-in), and **Firebase Hosting**.
   - Copy the Firebase config and create `.env` files for both the web and mobile apps:

     **Web `.env`**:
     ```bash
     REACT_APP_API_KEY=your_firebase_api_key
     REACT_APP_AUTH_DOMAIN=your_project.firebaseapp.com
     REACT_APP_PROJECT_ID=your_project_id
     ```

     **Mobile `.env`**:
     ```bash
     FIREBASE_API_KEY=your_firebase_api_key
     FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     FIREBASE_PROJECT_ID=your_project_id
     ```

4. **Run the apps**:

   - **Web App**:
     ```bash
     npm start
     ```

   - **Mobile App**:
     ```bash
     npx expo start
     ```

   - **iOS Mobile App**:
     If you're using macOS and have Xcode installed, you can run the iOS app using:
     ```bash
     npx react-native run-ios
     ```

---

## Configuration

Configuration is done via `.env` files for both the web and mobile apps. Ensure that Firebase API keys, project IDs, and other sensitive credentials are added correctly.

To deploy the web app to Firebase Hosting, use the Firebase CLI:
```bash
firebase login
firebase init
firebase deploy
```

---

## Usage

1. **Run the Web App**:
   Visit `http://localhost:3000` to access the command center interface.

2. **Run the Mobile App**:
   Use the [Expo Go](https://expo.dev/client) app on your phone or a mobile emulator to test the mobile interface.

3. **Monitoring Locations**:
   - Command center can view live positions of all volunteers.
   - Manage visibility, trigger SOS alerts, and coordinate response efforts through the dashboard.

---

## Common Bugs

### iOS Pod Installation Issue
After installing iOS Pods, certain files may cause build issues. If you encounter errors, follow the steps below:

1. Navigate to the following file:  
   `mobile/ios/Pods/Headers/Public/ReactCommon/ReactCommon.modulemap`
   
   Comment out the following lines:
   ```c
   //module ReactCommon {
   //  umbrella header "ReactCommon-umbrella.h"
   //  exclude header "React-RuntimeApple-umbrella.h"
   //  export *
   //  module * { export * }
   //}
   ```

2. In the file:  
   `mobile/ios/Pods/Headers/Public/ReactCommon/React-RuntimeApple.modulemap`
   
   Modify it to include:
   ```c
   module ReactCommon {
     umbrella header "React-RuntimeApple-umbrella.h" 
     exclude header "ReactCommon-umbrella.h"
     export *
     module * { export * }
   }
   ```

---

## Contributors

- **Binyamin Klein** - Lead Developer
- **PrpL14** - Contributor

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

---

### 🧭 Key Takeaways

Guardia revolutionizes emergency response management by providing real-time situational awareness. Its seamless combination of mobile and web applications makes it an ideal solution for quick decision-making in critical situations.

---