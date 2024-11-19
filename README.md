# SaverChef

A React Native application with a React Native frontend, Flask backend, and PostgreSQL database.

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
Backend Setup

In the backend directory:

Create a Python virtual environment
Install packages from requirements.txt
Create a .env file with your DATABASE_URI



Database URI format:
Copypostgresql://[user]:[password]@localhost:[port]/[database_name]
PostgreSQL and pgAdmin 4 Setup
1. Install PostgreSQL

Visit the official PostgreSQL website
Download and install the latest version

2. Configure pgAdmin 4

Open pgAdmin 4 after PostgreSQL installation
Create a master password when prompted
Access connection details:

Locate and double-click PostgreSQL 17 in the left sidebar
Go to Properties → Connection
Note down the username and port



3. Database Creation

In pgAdmin 4, expand PostgreSQL 17
Right-click on Databases
Select Create → Database
Choose a database name

4. Configure Database Connection
Create your DATABASE_URI using this format:
Copypostgresql://[user]:[password]@localhost:[port]/[database_name]
Running the Application
1. Start the Frontend
bashCopycd frontend
npx expo start
2. Start the Backend
bashCopycd backend
python3 app.py
3. Launch the Application
Scan the QR code displayed in the frontend terminal using your phone's camera or Expo Go app.
