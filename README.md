# SaverChef

Our app is a smart inventory manager designed to help users efficiently track the food in their fridge.  It sends alerts when items are approaching their expiration dates to minimize food waste. The app also offers tailored recipe suggestions based on the ingredients currently available to motivate people to cook their own foods with the intention of introducing cooking to beginners in order to save money and eat healthier. The frontend is built with React Native, and the backend uses a Flask RESTful API with a PostgreSQL databse.

## Inside SaverChef
<p align="center">
  <img src="images/index.jpeg" alt="Image 1" width="130" />
  <img src="images/home.jpeg" alt="Image 2" width="130" />
  <img src="images/inventory.jpeg" alt="Image 3" width="130" />
  <img src="images/recipes.jpeg" alt="Image 4" width="130" />
  <img src="images/recipe.jpeg" alt="Image 5" width="130" />
  <img src="images/profile.jpeg" alt="Image 6" width="130" />
</p>


## Prerequisites
- Python 3.11.1
- PostgreSQL
- Phone with Expo Go installed
- Node.js

## Getting Started

### Frontend Setup

1. Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

### Backend Setup

1. In the backend directory:
   - Create a Python virtual environment
   - Install packages from `requirements.txt`
   - Create a `.env` file with your `DATABASE_URI`

Database URI format:

```
postgresql://[user]:[password]@localhost:[port]/[database_name]
```

## PostgreSQL Setup

### 1. Install PostgreSQL
- Visit the [official PostgreSQL website](https://www.postgresql.org)
- Download and install the latest version

### 2. Configure pgAdmin 4
1. Open pgAdmin 4 after PostgreSQL installation
2. Create a master password when prompted
3. Access connection details:
   - Locate and double-click **PostgreSQL 17** in the left sidebar
   - Go to **Properties** → **Connection**
   - Note down the **username** and **port**

### 3. Database Creation
1. In pgAdmin 4, expand **PostgreSQL 17**
2. Right-click on **Databases**
3. Select **Create** → **Database**
4. Choose a database name

### 4. Configure Database Connection
Create your `DATABASE_URI` using this format:

```
postgresql://[user]:[password]@localhost:[port]/[database_name]
```
### 5. To check the contents of the database
1. Navigate to **your_database** -> **Schemas** -> **Public** -> **Tables**.
2. Double-click on the desired table and select **View/Edit Data** to inspect its contents.

### 6. get an API key for the barcode scanner
1. Create an account and get an api key and an app key from https://developer.nutritionix.com/admin.
2. Create an `X_APP_ID` entry in your `.env` file and add the application ID.
3. Create an `X_APP_KEY` entry in your `.env` file and add the API key.

## Running the Application

### 1. Start the Frontend

```bash
cd frontend
npx expo start
```

### 2. Start the Backend

```bash
cd backend
python3 app.py
```

### 3. Launch the Application
Scan the QR code displayed in the frontend terminal using your phone's camera or Expo Go app.
