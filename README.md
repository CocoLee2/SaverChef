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
