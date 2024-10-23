# [BiteBalance](https://bitebalance.vercel.app)

[BiteBalance](https://bitebalance.vercel.app) is a MERN stack web application designed to track your daily calorie and macro intake through photo recognition. Users can take photos of their meals to estimate calories and macronutrients, and also generate creative recipes based on ingredients and dietary preferences.

## Features

- **Photo-based Calorie & Macro Recognition**: Upload a photo of your meal to recognize calories and macros (protein, carbs, fats, sugars, sodium) using Google Gemini AI.
- **Ingredient-based Recipe Generation**: Take a photo of your ingredients, enter dietary preferences, and generate recipes that meet your specified cooking time and difficulty.
- **Daily Nutrition Tracking**: Track calories and macros for each day, view consolidated stats over the past few days.
- **User Authentication**: Firebase authentication for user login and registration.

## Tech Stack

### Frontend:
- **React.js**: For building a responsive and dynamic user interface.
- **Material UI (MUI)**: Component library used for modern, responsive design.
- **Firebase Authentication**: Secure user login and registration.

### Backend:
- **Node.js & Express**: Handle API requests and data processing.
- **Google Gemini AI**: Powers the image-based meal recognition and recipe generation.
- **MongoDB Atlas**: Cloud-hosted NoSQL database for storing user data (calories, macros, etc.).

## Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Firebase](https://firebase.google.com/) (for authentication setup)
- Google Generative AI access for Gemini model API.

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/bitebalance.git
    cd bitebalance
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root of the project with the following values:
    ```
    MONGO_URI=<your_mongodb_atlas_uri>
    API_KEY=<your_google_gemini_api_key>
    FIREBASE_API_KEY=<your_firebase_api_key>
    AUTH_DOMAIN=<your_firebase_auth_domain>
    PROJECT_ID=<your_firebase_project_id>
    STORAGE_BUCKET=<your_firebase_storage_bucket>
    MESSAGING_SENDER_ID=<your_firebase_messaging_sender_id>
    APP_ID=<your_firebase_app_id>
    ```

4. Start the server:
    ```bash
    npm start
    ```

5. Start the React app:
    ```bash
    cd client
    npm start
    ```

## Usage

1. **Sign Up/Login**: Use Firebase authentication to register or sign in.
2. **Upload a Meal Photo**: Use the upload feature to take a photo of your meal and get the estimated calorie and macro breakdown.
3. **Generate a Recipe**: Take a photo of ingredients, specify dietary preferences, and get a custom recipe.
4. **View Nutrition Stats**: See your daily calorie and macro consumption and track it over time.

## API Endpoints

- `POST /generate-ingredients`: Upload a base64-encoded image to generate a list of ingredients.
- `POST /generate-recipe`: Generate a recipe based on dietary preferences and available ingredients.
- `GET /calories/:userId`: Retrieve user's calorie and macro data (optionally filtered by date).
- `POST /calories/update`: Update user’s calorie and macro consumption.
