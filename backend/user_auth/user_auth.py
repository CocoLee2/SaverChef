from flask import Flask, render_template, flash, redirect, url_for, session, request, jsonify
from forms import RegisterForm, LoginForm
from models import db, User
from flask_bcrypt import Bcrypt

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'CSE403'
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@localhost:port/db_name' # Replace with your URI
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:000721@localhost:5433/test_db'


    bcrypt = Bcrypt()
    bcrypt.init_app(app)

    db.init_app(app)
    with app.app_context():
        db.create_all()

    
    @app.route('/login', methods=['POST'])
    def login():
        data = request.json  # Expecting a JSON payload with email and password
        print(data)
        user = User.query.filter_by(email=data['email']).first()
        
        if user and bcrypt.check_password_hash(user.password, data['password']):
            # If login is successful, store user data in session or return a token if JWT is used
            session['user_id'] = user.id
            session['username'] = user.username
            return jsonify({"message": "Login successful", "user_id": user.id, "username": user.username}), 200
        else:
            return jsonify({"message": "Invalid email or password"}), 401

    # New route for changing password
    @app.route('/change_password', methods=['POST'])
    def change_password():
        data = request.json  # Expecting JSON payload with email, newPassword
        user = User.query.filter_by(email=data['email']).first()
        
        # Update with new hashed password
        new_hashed_password = bcrypt.generate_password_hash(data['newPassword']).decode('utf-8')
        user.password = new_hashed_password
        db.session.commit()
        return jsonify({"message": "Password changed successfully"}), 200
    
    # New route for changing password
    @app.route('/delete_account', methods=['POST'])
    def delete_account():
        data = request.json  # Expecting JSON payload with email
        user = User.query.filter_by(email=data['email']).first()
        
        db.session.delete(user)
        db.session.commit()
  
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
        existing_email = User.query.filter(User.email == data['email']).first()
        if existing_email:
            return jsonify({"message": "Email already exists"}), 400
        
        # Create a new user
        new_user = User(
            username=data['username'],
            email=data['email'],
            password=bcrypt.generate_password_hash(data['password']).decode('utf-8') # In real-world, hash the password using something like bcrypt
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully"}), 201
    
    return app
    
    
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5001)

