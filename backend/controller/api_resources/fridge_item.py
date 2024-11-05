from flask import Blueprint, abort, request, jsonify, Response
from model.fridge import Fridge
from model.users import Users
from model.fridge_items import FridgeItems
from database.database import db
from datetime import date

fridge_item_bp = Blueprint('fridge_items', __name__, url_prefix='/fridge_item')

@fridge_item_bp.route("/add", methods=["POST"])
def add_item():
    data = request.json
    fridge_id = int(data['fridge_id'])
    expiration_date = date.fromisoformat(data['expiration_date'])
    name = data['name']
    description = data.get('description', "")
    quantity = int(data['quantity'])
    qualifier = data['qualifier']
    new_item = FridgeItems(fridge_id, name, description, expiration_date, quantity, qualifier)
    db.session.add(new_item)
    db.session.commit()

    return jsonify({"itemId": new_item.id}), 201
