from flask import Flask, Blueprint, render_template, flash, redirect, url_for, session, request, jsonify
# from forms import RegisterForm, LoginForm
from flask_bcrypt import Bcrypt
from model.fridge_members import FridgeMembers
from model.fridge import Fridge
from model.fridge_items import FridgeItems
from model.users import db, Users
# from model.push_token import PushToken
from dotenv import load_dotenv
from os import getenv
from sqlalchemy.orm.attributes import flag_modified

app = Blueprint('user_auth', __name__)


bcrypt = Bcrypt()


@app.route('/login', methods=['POST'])
def login():
    data = request.json  # Expecting a JSON payload with email and password
    user = Users.query.filter_by(email=data['email']).first()

    if user and bcrypt.check_password_hash(user.password, data['password']):
        # If login is successful, store user data in session or return a token
        # if JWT is used
        session['user_id'] = user.id
        session['username'] = user.username
        session['favoriteRecipes'] = user.favoriteRecipes
        return jsonify({"message": "Login successful", "user_id": user.id, "username": user.username,
                       "favoriteRecipes": user.favoriteRecipes, "fridgeData": get_fridge_data(user.id)}), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401


@app.route('/refresh', methods=['POST'])
def refresh():
    data = request.json  # Expecting a JSON payload with email and password
    return jsonify({"fridgeData": get_fridge_data(data['userId'])}), 200

# New route for changing password


@app.route('/change_password', methods=['POST'])
def change_password():
    data = request.json  # Expecting JSON payload with email, newPassword
    user = Users.query.filter_by(email=data['email']).first()

    # Update with new hashed password
    new_hashed_password = bcrypt.generate_password_hash(
        data['newPassword']).decode('utf-8')
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
        # In real-world, hash the password using something like bcrypt
        password=bcrypt.generate_password_hash(
            data['password']).decode('utf-8'),
        favoriteRecipes=[]  # Initialize the favoriteRecipes
    )
    db.session.add(new_user)
    db.session.commit()
    new_fridge = Fridge("My fridge", new_user.id)
    db.session.add(new_fridge)
    db.session.commit()
    return jsonify({"message": "Login successful", "user_id": new_user.id,
                   "fridge_id": new_fridge.id, "fridge_passcode": new_fridge.passcode}), 201


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


def get_fridge_data(user_id):
    "Returns all user's fridges with corresponding data"
    fridges = db.session.query(Fridge).outerjoin(
        FridgeMembers, Fridge.id == FridgeMembers.fridge_id).filter(
        (Fridge.creator == user_id) | (
            FridgeMembers.member_id == user_id)).distinct().all()
    fridge_results = []
    for fridge in fridges:
        fridge_data = {}
        fridge_data["fridgeId"] = fridge.id
        fridge_data["fridgeName"] = fridge.name
        fridge_data["fridgePasscode"] = fridge.passcode
        fridge_data["fridgeItems"] = []
        fridge_items = db.session.scalars(
            db.select(FridgeItems).filter_by(fridge_id=fridge.id)).all()
        for fridge_item in fridge_items:
            fridge_data["fridgeItems"].append(fridge_item.serialize())
        fridge_results.append(fridge_data)
    return fridge_results


# @app.route('/register-token', methods=['POST'])
# def register_token():
#     """
#     Registers a push token for a user.
#     Expects JSON payload: { "user_id": <int>, "token": <str> }
#     """
#     try:
#         data = request.json

#         # Validate input
#         user_id = data.get('user_id')
#         token = data.get('token')
#         if not user_id or not token:
#             return jsonify({"message": "Missing user_id or token"}), 400

#         # Check if token already exists for the user
#         existing_token = db.session.query(PushToken).filter_by(user_id=user_id, token=token).first()

#         if existing_token:
#             return jsonify({"message": "Token already registered"}), 200

#         # Add or update the token
#         new_token = PushToken(user_id=user_id, token=token)
#         db.session.add(new_token)
#         db.session.commit()

#         return jsonify({"message": "Token registered successfully"}), 201

#     except Exception as e:
#         print(f"Error registering token: {e}")
#         return jsonify({"message": "Internal server error"}), 500
