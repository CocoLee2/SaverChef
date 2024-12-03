from datetime import date
import os
from flask import Blueprint, jsonify, request, Response
import requests
from database.database import db
from model.fridge_items import FridgeItems

fridge_item_bp = Blueprint('fridge_items', __name__, url_prefix='/fridge_item')


@fridge_item_bp.route("/add", methods=["POST"])
def add_item():
    """
    Add an item to a fridge.
    Input:
        Json request with attributes:
            - fridge_id: int, required
            - itemName: string, required
            - expirationDate: string in the format of YYYYMMDD or YYYY-MM-DD, required
            - quantity: int, required
            - quantifier: string, required
    Output:
        Status code 201 and json response containing the new item's Id
        {"itemId": int}
    """
    data = request.json
    fridge_id = int(data['fridge_id'])
    expiration_date = date.fromisoformat(data['expirationDate'])
    name = data['itemName']
    quantity = int(data['quantity'])
    quantifier = data['quantifier']
    new_item = FridgeItems(fridge_id, name,
                           expiration_date, quantity, quantifier)
    db.session.add(new_item)
    db.session.commit()

    return jsonify({"itemId": new_item.id}), 201


@fridge_item_bp.route("/update_item", methods=["POST"])
def update_item():
    """
    Updates an existing item's properties.
    Input:
        Json request with attributes:
            - itemId: int, required
            - itemName: string, required
            - expirationDate: string in the format of YYYYMMDD or YYYY-MM-DD, required
            - quantity: int, required
            - quantifier: string, required
    Output:
        Status code 200 and json response containing the success message if successful.
        If item not found, returns status code 404
    """
    data = request.json
    item_id = int(data['itemId'])
    expiration_date = date.fromisoformat(data['expirationDate'])
    name = data['itemName']
    quantity = int(data['quantity'])
    quantifier = data['quantifier']
    fridge_item = db.session.get(FridgeItems, item_id)
    if not fridge_item:
        return jsonify(
            {"message": f'fridge item with id {item_id} does not exist'}), 400
    fridge_item.name = name
    fridge_item.expiration_date = expiration_date
    fridge_item.quantifier = quantifier
    fridge_item.quantity = quantity
    db.session.commit()
    return jsonify({"message": "Updated item successfully"})


@fridge_item_bp.route("delete", methods=["POST"])
def delete_item():
    data = request.json
    item_id = int(data['itemId'])
    try:
        fridge_item = db.session.get(FridgeItems, item_id)
        if not fridge_item:
            return jsonify(
                {"message": 'fridge item with id {item_id} does not exist'}), 400
        db.session.delete(fridge_item)
        db.session.commit()
        return jsonify({"message": "Successfully deleted fridge item"}), 200

    except Exception as e:
        return str(e), 400


@fridge_item_bp.route("update_or_delete_item", methods=["POST"])
def update_or_delete_item():
    """
    Updates the quantity of a fridge item or deletes it if the quantity becomes insufficient.
    """
    data = request.json
    item_id = int(data['itemId'])
    quantity = int(data['quantity'])
    try:
        fridge_item = db.session.get(FridgeItems, item_id)
        if not fridge_item:
            return jsonify(
                {"message": 'fridge item with id {item_id} does not exist'}), 400
        if fridge_item.quantity < quantity:
            db.session.delete(fridge_item)
            db.session.commit()
            return jsonify(
                {"message": "Successfully deleted fridge item"}), 200
        else:
            fridge_item.quantity = fridge_item.quantity - quantity
            db.session.commit()
            return jsonify({"message": "Updated item successfully"}), 200
    except Exception as e:
        return str(e), 400



@fridge_item_bp.route("/search_barcode", methods=["POST"])
def food_api():
    data = request.json
    upc = data['upc'] #will be in string format

    appId = os.getenv('X_APP_ID', '1')
    appKey = os.getenv('X_APP_KEY', '1')

    #Call to API
    url = 'https://trackapi.nutritionix.com/v2/search/item/?upc='+ upc
    headers = {
    'Content-Type': 'application/json',
    "x-app-id": appId,
    "x-app-key": appKey}
    try:
        response = requests.get(url, headers=headers)
        print(response.json)
        if response.status_code == 200:
            foods = response.json()
            food_name = foods['foods'][0]['food_name'] #grabs first food item
            return jsonify({"message": food_name}), 200
        elif response.status_code == 404:
            return jsonify({"message": "Barcode not found"}), 555
        elif response.status_code == 401:
            return jsonify({"message": "invalid api key"}), 777
    except:
        return jsonify({"message": "error"}), 408

    return jsonify({"message": "error"}), 404

