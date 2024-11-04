from flask import Flask, Blueprint, render_template, flash, redirect, url_for, session, request, jsonify
# from forms import RegisterForm, LoginForm
from flask_bcrypt import Bcrypt
from model.users import db, Users
from dotenv import load_dotenv
from os import getenv
from sqlalchemy.orm.attributes import flag_modified

app = Blueprint('user_auth', __name__)


bcrypt = Bcrypt()
@app.route('/login', methods=['POST'])
def login():
    data = request.json  # Expecting a JSON payload with email and password
    print(data)
    user = Users.query.filter_by(email=data['email']).first()
    
    if user and bcrypt.check_password_hash(user.password, data['password']):
        # If login is successful, store user data in session or return a token if JWT is used
        session['user_id'] = user.id
        session['username'] = user.username
        session['favoriteRecipes'] = user.favoriteRecipes
        return jsonify({"message": "Login successful", "user_id": user.id, "username": user.username, "favoriteRecipes": user.favoriteRecipes}), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401

# New route for changing password
@app.route('/change_password', methods=['POST'])
def change_password():
    data = request.json  # Expecting JSON payload with email, newPassword
    user = Users.query.filter_by(email=data['email']).first()
    
    # Update with new hashed password
    new_hashed_password = bcrypt.generate_password_hash(data['newPassword']).decode('utf-8')
    user.password = new_hashed_password
    db.session.commit()
    return jsonify({"message": "Password changed successfully"}), 200

# New route for changing password
@app.route('/delete_account', methods=['POST'])
def delete_account():
    data = request.json  # Expecting JSON payload with email
    user = Users.query.filter_by(email=data['email']).first()
    
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Account deleted successfully"}), 200
# Not sure if dashboard is needed.
# @app.route('/dashboard')
# def dashboard():
#     if 'user_id' not in session:
#         return redirect(url_for('login'))
#     return render_template("dashboard.html")

# @app.route('/logout', methods=['POST'])
# def logout():
#     if 'user_id' in session:
#         session.pop('user_id', None)
#         session.pop('username', None)
#         return jsonify({"message": "Successfully logged out"}), 200
#     else:
#         return jsonify({"message": "No user is logged in"}), 400

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json

    # Check if email is already taken
    existing_email = Users.query.filter(Users.email == data['email']).first()
    if existing_email:
        return jsonify({"message": "Email already exists"}), 400
    
    # Create a new user
    new_user = Users(
        username=data['username'],
        email=data['email'],
        password=bcrypt.generate_password_hash(data['password']).decode('utf-8'), # In real-world, hash the password using something like bcrypt
        favoriteRecipes=[] # Initialize the favoriteRecipes
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Users created successfully"}), 201

@app.route('/mark_favorite', methods=['POST'])
def mark_favorite():
    data = request.json

    # Find the user
    user = Users.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    recipe_id = data['recipe_id']

    # Update user's favorite recipes list based on the message
    if data['message'] == 'add':
        if recipe_id not in user.favoriteRecipes:
            print(f"line90, add recipe{recipe_id} to favorietRecipes")
            user.favoriteRecipes.append(recipe_id)
    elif data['message'] == 'delete':
        if recipe_id in user.favoriteRecipes:
            user.favoriteRecipes.remove(recipe_id)

    # Commit the changes
    flag_modified(user, 'favoriteRecipes')
    db.session.commit()
    return jsonify({"message": "Updated successfully"}), 201
