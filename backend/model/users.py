from flask_sqlalchemy import SQLAlchemy
from database.database import db
from sqlalchemy.dialects.postgresql import JSON


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    favoriteRecipes = db.Column(JSON, nullable=True)
    fridges = db.relationship("Fridge", cascade="all, delete")
    shared_fridges = db.relationship("FridgeMembers", cascade="all,delete")
