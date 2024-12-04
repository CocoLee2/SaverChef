from model.fridge_items import FridgeItems
from database.database import db
from model.fridge import Fridge
from model.users import Users


def test_create_user(client):
    response = client.post(
        "/signup",
        json={
            'username': "testperson",
            'email': "testemail@email.com",
            'password': "bad_password"})
    assert response.status_code == 201
    assert len(response.json["fridge_passcode"]) == 6
    assert db.session.query(Fridge).join(Users).where(
        Users.email == "testemail@email.com").one().passcode == response.json["fridge_passcode"]


def test_create_user_again(client):
    client.post(
        "/signup",
        json={
            'username': "testperson",
            'email': "testemail@email.com",
            'password': "bad_password"})
    response = client.post(
        "/signup",
        json={
            'username': "testperson",
            'email': "testemail@email.com",
            'password': "bad_password"})
    assert response.status_code != 201


def test_login(client):
    response = client.post(
        "/login",
        json={
            'email': "superchef@superchef.com",
            'password': "supercoolpassword"})
    assert len(response.json["fridgeData"][0]["fridgeItems"]) == 4
    assert len(response.json["fridgeData"][0]["fridgePasscode"]) == 6
    assert db.session.query(Fridge).join(Users).where(
        Users.email == "superchef@superchef.com").one().passcode == response.json["fridgeData"][0]["fridgePasscode"]


def test_delete_user(client):
    response = client.post(
        "/delete_account",
        json={'email': "superchef@superchef.com"})
    assert db.session.query(Fridge).join(Users).where(
        Users.email == "superchef@superchef.com").count() == 0
    assert db.session.query(FridgeItems).count() == 0
