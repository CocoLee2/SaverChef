from datetime import date, timedelta
import os
from flask import Blueprint, jsonify, request, Response
import requests
from model.fridge_members import FridgeMembers
from model.push_token import PushToken
from model.fridge import Fridge
from database.database import db
from model.fridge_items import FridgeItems
from sqlalchemy.orm import joinedload

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



"""
Fetches all food items nearing their expiration date across all fridges, groups them by fridge, 
and includes associated user IDs (creator and members). The response is structured to provide 
fridge details, user information, and a list of expiring items for each fridge.
"""
@fridge_item_bp.route("/soon_to_expire", methods=["GET"])
def soon_to_expire():
    days = 5
    latest_expiration_date = date.today() + timedelta(days=days)

    expiring_items = db.session.query(FridgeItems).filter(
        FridgeItems.expiration_date < latest_expiration_date).all()

    if not expiring_items:
        return jsonify({"message": "No expiring items found."}), 200

    fridge_data = {}
    for item in expiring_items:
        fridge_id = item.fridge_id

        if fridge_id not in fridge_data:
            fridge = db.session.query(Fridge).options(
                joinedload(Fridge.fridge_members)).filter_by(id=fridge_id).first()

            if fridge:
                user_ids = [fridge.creator]
                user_ids += [member.member_id for member in fridge.fridge_members]

                fridge_data[fridge_id] = {
                    "fridge_name": fridge.name,
                    "creator_id": fridge.creator,
                    "user_ids": user_ids,
                    "expiring_items": []
                }

        fridge_data[fridge_id]["expiring_items"].append({
            "item_id": item.id,
            "name": item.name,
            "expiration_date": item.expiration_date,
            "quantity": item.quantity,
            "quantifier": item.quantifier
        })

    # Uncomment the code below to enable push notifications
    # for fridge_id, fridge_info in fridge_data.items():
    #     for user_id in fridge_info["user_ids"]:
    #         # Retrieve push token for the user from the database
    #         push_token = db.session.query(UserPushTokens).filter_by(user_id=user_id).first()
    #         if push_token:
    #             send_push_notification(
    #                 push_token.token,
    #                 f"Items expiring soon in {fridge_info['fridge_name']}",
    #                 f"{len(fridge_info['expiring_items'])} items are nearing expiration."
    #             )

    return jsonify({
        "message": "Successfully returned soon-to-expire food items",
        "fridges": list(fridge_data.values())
    }), 200


# Helper function to send push notifications
# Uncomment this function when ready to send notifications
# import requests
# def send_push_notification(push_token, title, body):
#     url = "https://exp.host/--/api/v2/push/send"
#     headers = {
#         "Content-Type": "application/json",
#         "Accept": "application/json"
#     }
#     payload = {
#         "to": push_token,
#         "title": title,
#         "body": body
#     }
#     response = requests.post(url, headers=headers, json=payload)
#     print(f"Notification sent to {push_token}: {response.status_code}")


@fridge_item_bp.route("/search_barcode", methods=["POST"])
def food_api():
    data = request.json
    upc = data['upc']  # will be in string format

    appId = os.getenv('X_APP_ID', '1')
    appKey = os.getenv('X_APP_KEY', '1')

    # Call to API
    url = 'https://trackapi.nutritionix.com/v2/search/item/?upc=' + upc
    headers = {
        'Content-Type': 'application/json',
        "x-app-id": appId,
        "x-app-key": appKey}
    try:
        response = requests.get(url, headers=headers)
        print(response.json)
        if response.status_code == 200:
            foods = response.json()
            food_name = foods['foods'][0]['food_name']  # grabs first food item
            return jsonify({"message": food_name}), 200
        elif response.status_code == 404:
            return jsonify({"message": "Barcode not found"}), 555
        elif response.status_code == 401:
            return jsonify({"message": "invalid api key"}), 777
    except BaseException:
        return jsonify({"message": "error"}), 408

    return jsonify({"message": "error"}), 404
