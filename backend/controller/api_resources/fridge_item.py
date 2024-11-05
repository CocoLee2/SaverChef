from flask import Blueprint, abort, request, jsonify, Response
from model.fridge import Fridge
from model.users import Users
from model.fridge_items import FridgeItems
from database.database import db
from datetime import date

fridge_item_bp = Blueprint('fridge_items', __name__, url_prefix='/fridge_item')

@fridge_item_bp.route("/add")
def add_item():
    data = request.json
    fridge_id = int(data['fridge_id'])
    expiration_date = date.fromisoformat(data['expiration_date'])
    name = data['name']
    description = data['description'] if data['description'] else ""
    quantity = int(data['quantity'])
    qualifier = int(data['qualifier'])
