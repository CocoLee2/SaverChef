from model.users import Users
from database.database import db
from datetime import date


def test_add_item(client):
    response = client.post("/fridge_item/add", json={
        'fridge_id': 1,
        'itemName': "apple",
        'expirationDate': "2025-11-01",
        'quantity': 1,
        'quantifier': '',
    })
    assert response.status_code == 201
    assert response.json["itemId"] == 1
