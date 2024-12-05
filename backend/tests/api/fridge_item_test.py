from model.fridge_items import FridgeItems
from database.database import db
import sqlalchemy
from datetime import date, timedelta


def test_add_item(client):
    response = client.post("/fridge_item/add", json={
        'fridge_id': 1,
        'itemName': "apple",
        'expirationDate': "2025-11-01",
        'quantity': 1,
        'quantifier': '',
    })
    assert response.status_code == 201
    assert response.json["itemId"] == 5  # assumes first item's id is 5
    fridge_item = db.session.get(FridgeItems, 5)
    assert fridge_item.name == "apple"
    assert fridge_item.expiration_date == date(2025, 11, 1)
    assert fridge_item.quantity == 1
    assert fridge_item.quantifier == ''


def test_update_item(client):
    response = client.post("/fridge_item/add", json={
        'fridge_id': 1,
        'itemName': "apple",
        'expirationDate': "2025-11-01",
        'quantity': 1,
        'quantifier': '',
    })
    assert response.status_code == 201
    itemId = response.json["itemId"]
    response = client.post("/fridge_item/update_item", json={
        'itemId': itemId,
        'itemName': "bread",
        'expirationDate': "2026-12-25",
        'quantity': 8,
        'quantifier': 'slices',
    })
    assert response.status_code == 200
    assert response.json["message"] == "Updated item successfully"
    fridge_item = db.session.get(FridgeItems, itemId)
    assert fridge_item.name == "bread"
    assert fridge_item.expiration_date == date(2026, 12, 25)
    assert fridge_item.quantity == 8
    assert fridge_item.quantifier == 'slices'


def test_delete_item(client):
    response = client.post("/fridge_item/add", json={
        'fridge_id': 1,
        'itemName': "apple",
        'expirationDate': "2025-11-01",
        'quantity': 1,
        'quantifier': '',
    })
    itemId = response.json["itemId"]
    response = client.post("/fridge_item/delete", json={
        'itemId': itemId
    })
    assert response.status_code == 200
    assert response.json["message"] == "Successfully deleted fridge item"
    fridge_item = db.session.get(FridgeItems, itemId)
    assert fridge_item is None


def test_soon_to_expire(client):
    apple_expiration_date = date.today() + timedelta(days=2)
    response = client.get("fridge_item/soon_to_expire", json={
        'fridgeId': 1,
        'userId': 1,
        'days': 3
    })
    assert len(response.json["fridgeItems"]) == 0
    response = client.post("/fridge_item/add", json={
        'fridge_id': 1,
        'itemName': "apple",
        'expirationDate': apple_expiration_date.isoformat(),
        'quantity': 1,
        'quantifier': '',
    })
    itemId = response.json["itemId"]

    response = client.get("fridge_item/soon_to_expire", json={
        'fridgeId': 1,
        'userId': 1,
        'days': 3
    })

    # this test will fail starting 2025-11-01
    assert len(response.json["fridgeItems"]) == 1
    assert response.json["fridgeItems"][0]['id'] == itemId
