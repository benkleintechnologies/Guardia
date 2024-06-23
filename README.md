# CacheMoney

For Web Development we're using the MERN Stack.

For Mobile, we're using React Native and Expo.

All Javascript code should be Typescript.

The project will have 3 parts:
1. Web App
2. Mobile App
3. Backend

Currently there is sample code in the `backend` and `TrackerApp`(which is the mobile app) directories. 
The code in these directories should be a good basis for the project.
The backend currently connects to the Atlas MongoDB cluster and gets sample data which included locations. You need to add your external IP address to the Atlas cluster security settings to connect to it.
You can then access the data at `http://localhost:5000/locations` after starting the backend using `npm run start`.
The only route currently implemented is the locations route for getting locations.

The mobile app directory contains a basic React Native app sample code. The actual contents of the screens will be totally changed. The current code is just a placeholder.