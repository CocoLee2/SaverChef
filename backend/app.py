from flask import Flask
from flask_restful import Api
from controller.api_resources.fridge import fridge_bp
from dotenv import load_dotenv
from database.database import db
from os import getenv

load_dotenv()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = getenv("DATABASE_URI")
db.init_app(app)
app.register_blueprint(fridge_bp)