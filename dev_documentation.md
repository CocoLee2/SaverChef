# SaverChef

## Project Structure
This project is organized into two main directories: `frontend` and `backend`.

## Source Code
The source code is hosted on GitHub: [SaverChef Repository](https://github.com/CocoLee2/SaverChef). To clone the repository, use:

git clone https://github.com/CocoLee2/SaverChef.git

## 1. Backend Layout
- **`app.py`**: Integrates all submodules; any routes should be added here.
- **`module` Directory**: Contains information about the database.
- **Main Directories:**
  - **`recipes`**, **`user_auth`**, **`inventory`**: These directories contain the primary functions of SaverChef, each holding API backend routes. Each folder contains a Blueprint that can be imported into `app.py` for functionality.
  - **`database` Directory**: Houses the `db` object, which can be imported into any file that needs to interact with the database.
  - **`model` Directory**: Contains table definitions (`Users`, `fridges`, `fridge_items`). These models can be imported as needed (e.g., `from model.users import Users`). 
The layout of frontend:
### **1. `app` Directory:**
This is the main directory where the core application logic and screens are stored.
#### **1.1 auth:**
- **logIn.jsx**: Handles user login functionality, including input fields for email and password, and a button for submitting the login form.
- **signUp.jsx**: Manages user registration, with form fields for creating an account (username, email, password) and a sign-up button.
- **changePassword.jsx**: Allows users to change their password, with fields for entering the current password and the new password, along with a save button.
#### **1.2 tabs:**
- **home.jsx**: The main dashboard that shows an overview, such as upcoming expirations and quick recipe suggestions.
- **inventory.jsx**: Displays the user’s food inventory, with options to add or update items manually or via barcode scanning and share their fridges with other people.
- **recipes.jsx**: Shows recipe suggestions based on available ingredients and allows users to search for recipes.
- **profile.jsx**: The user’s profile page for viewing or editing personal information, viewing their favorite recipes, logging out and deleting account.
#### **1.3 other:**
- **splash.jsx**: The initial splash screen shown when the app loads, usually displaying the app’s logo and a loading animation.
- **scan.jsx**: Implements the barcode/QR code scanning functionality for adding food items.
- **addManually.jsx**: Provides a form for users to manually input food item details, such as name, quantity, and expiration date.
- **share.jsx**: Handles the functionality for sharing a fridge with other users.
- **searchRecipe.jsx**: Takes a list of processed recipe data, and shows the page.
- **showRecipe.jsx**: Displays detailed information about a selected recipe, including name, images, ingredients, cooking steps, time, and servings.
#### **1.4 index.jsx:**
- The entry point that initializes the app, sets up navigation, and connects the app with global context and other configurations.
#### **1.5 GlobalContext.js:**
- Manages “global variables” such as the user’s email, username, password, inventory data, and random recipe suggestions. This context provides easy access to these variables throughout the app, ensuring consistent data flow and state management.
---
### **2. `assets` Directory:**
- **Purpose**: Stores static files like fonts, icons, and images used in the app.
- **Key Subdirectory:**
  - **images/ingredients**: Contains images of approximately 80 common ingredients. These images are displayed in the inventory section when a food item’s name matches one of the stored images.
---
### **3. `components` Directory:**
- **Reusable Components**: Houses components that are used across multiple screens to promote code reuse and consistency.
  - **customButton**: A customizable button component used on various screens, such as login, sign-up, and recipe pages.
  - **formField**: A reusable form input component used in the login, sign-up, and change password screens for a consistent look and feel.
---
### **4. `app.json`:**
- **Configuration File**: Contains metadata about the app, such as its name, version, and assets configuration, which is used by Expo to build and manage the app.

How to build the software:
Backend: 
Set up all necessary environment variables listed in requirements.txt. This can be done with the command ‘pip install -r requirements.txt’. Then make sure all necessary things are installed. Then click run on app.py.
Frontend:
Follow the instructions on the github repository page.
Use the command “npm run ios” under the repository frontend

How to test the software:
Backend: 
Create a .env file in the backend folder if you have not already and type in ‘TEST_DATABASE_URI=’ and add the URI of an empty database. In the backend folder, run ‘python -m pytest’ to run all the backend tests.
Frontend:
We highly recommend testing the backend first.
Manually test the frontend functions.
How to add new tests:
Backend: 
There is a directory in the backend directory called tests. The developer can write more tests for different parts separately. Also, the developer can add more tests in conftest.py for pytest.
Each test file must have names ending with _test or starting with test_ to be recognized. Each unit test is a function with a name starting with test_ and takes a parameter client. 
To test client routes, call client.get or client.post with the corresponding route as the first parameter and any json as json={jsonhere}. 
Frontend:
Manually test different functions.
How to build a release of the software:
(Backend)Create a .env file in the backend directory and create a Postgres database. In the .env file, set ‘DATABASE_URI’ to the uri of that database. Then, while in the backend directory, run ‘flask run’
