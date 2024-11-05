from flask import Flask
from flask_restful import Api
from controller.api_resources.fridge import fridge_bp
from controller.api_resources.fridge_item import fridge_item_bp
from user_auth.user_auth import app as user_auth_bp
from recipes.recipes import app as recipes_bp
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from database.database import db
from os import getenv

def create_app(database_uri):
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'CSE403'
    app.config['SQLALCHEMY_DATABASE_URI'] = database_uri
    app.register_blueprint(fridge_bp)
    app.register_blueprint(user_auth_bp)
    app.register_blueprint(recipes_bp)
    app.register_blueprint(fridge_item_bp)
    bcrypt = Bcrypt()
    bcrypt.init_app(app)
    db.init_app(app)
    with app.app_context():
        db.create_all()
    return app

if __name__ == '__main__':
    load_dotenv()
    app = create_app(getenv("DATABASE_URI"))
    app.run(debug=True, port=5001)

