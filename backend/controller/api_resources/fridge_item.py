from datetime import date


from flask import Blueprint, jsonify, request
from database.database import db
from model.fridge_items import FridgeItems

fridge_item_bp = Blueprint('fridge_items', __name__, url_prefix='/fridge_item')

@fridge_item_bp.route("/add", methods=["POST"])
def add_item():
    data = request.json
    fridge_id = int(data['fridge_id'])
    expiration_date = date.fromisoformat(data['expirationDate'])
    name = data['itemName']
    description = data.get('description', "")
    quantity = int(data['quantity'])
    qualifier = data['qualifier']
    new_item = FridgeItems(fridge_id, name, description, expiration_date, quantity, qualifier)
    db.session.add(new_item)
    db.session.commit()

    return jsonify({"itemId": new_item.id}), 201

@fridge_item_bp.route("/update_item", methods=["POST"])
def update_item():
    data = request.json
    item_id = int(data['itemId'])
    expiration_date = date.fromisoformat(data['expirationDate'])
    name = data['itemName']
    quantity = int(data['quantity'])
    qualifier = data['qualifier']
    fridge_item = FridgeItems.query.get(item_id)
    fridge_item.name = name
    fridge_item.expiration_date = expiration_date
    fridge_item.qualifier = qualifier
    fridge_item.quantity = quantity
    db.session.commit()
    return jsonify({"message": "Updated item successfully"})