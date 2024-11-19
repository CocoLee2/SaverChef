# SaverChef

SaverChef is a great application for Tracking Food & Inspiring Recipes. A React Native application with a React Native frontend, Flask backend, and PostgreSQL database.

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
