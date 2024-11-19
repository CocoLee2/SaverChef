# SaverChef

This is a react native application with a react native frontend, flask backend, and a PostgreSQL database.
Requirements: Python 3.11.1, Postgresql, A phone with expo go, Node.js

## Getting started (frontend)
1. In the frontend directory, Install dependencies
```bash
   cd frontend
   npm install
```


## Getting started (backend)
In the backend directory, create a python virtual environment and install the packages in ```requiremenets.txt```.

Create a ```.env``` file with an entry for your ```DATABASE_URI``` set to your postgres database.

Format for DATABASE_URI:
```postgresql://[user]:[password]@localhost:[port]/[database_name]```
# Instructions for Setting Up PostgreSQL and pgAdmin 4

## 1. Download PostgreSQL  
Visit the [official PostgreSQL website](https://www.postgresql.org) and download the latest version.

## 2. Install and Open pgAdmin 4  
After successfully installing PostgreSQL, open **pgAdmin 4**.

## 3. Set Up a Password  
Upon first launch, you will be prompted to create a password for the PostgreSQL server. Choose and confirm your password.

## 4. Access Connection Details  
- In the **pgAdmin 4** interface, locate and double-click on **PostgreSQL 17** in the left-hand toolbar.  
- Navigate to the **Properties** tab, then select **Connection** to view the **username** and **port** details.

## 5. Create a Database  
Under **PostgreSQL 17**, create a new database. Assign it a name of your choice.

## 6. Assemble the `DATABASE_URI`  
Use the gathered information to construct your database URI in the following format:  
```plaintext
postgresql://[user]:[password]@localhost:[port]/[database_name]






##
Once the frontend and backend has been initalized, start frontend and the backend on separate terminals.

1: starting the frontend:
```bash
    cd frontend
    npx expo start
```

2: starting the backend:
```bash
   cd backend
   python3 app.py
```

Once both have started, scan the QR code from the front-end.
