from flask import Flask
from flask_restful import Api
from controller.api_resources.fridge import fridge_bp
from user_auth.user_auth import app as user_auth_bp
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from database.database import db
from os import getenv

def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'CSE403'
    app.config['SQLALCHEMY_DATABASE_URI'] = getenv("DATABASE_URI")
    app.register_blueprint(fridge_bp)
    app.register_blueprint(user_auth_bp)
    bcrypt = Bcrypt()
    bcrypt.init_app(app)
    db.init_app(app)
    with app.app_context():
        db.create_all()
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5001)

