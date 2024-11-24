from model.users import Users
from database.database import db
from model.fridge import Fridge


def test_unknown_fridge(client):
    response = client.get("/fridge/1000")
    assert response.status_code == 400


def test_share_fridge(client):
    response = client.post(
        "/signup",
        json={
            'username': "testperson",
            'email': "testemail@email.com",
            'password': "bad_password"})
    user_id = response.json["user_id"]
    fridge_id = response.json["fridge_id"]
    fridge_passcode = response.json["fridge_passcode"]
    # testing sharing testperson's fridge with superchef
    superchef_id = db.session.query(Users).where(
        Users.email == "superchef@superchef.com").one().id
    response = client.post("/fridge/share", json={
        'fridgePasscode': fridge_passcode,
        'userId': superchef_id
    })
    assert response.status_code == 200
    assert len(response.json["fridgeData"]) == 2
    assert response.json["fridgeData"][0]["fridgeId"] == fridge_id or response.json["fridgeData"][1]["fridgeId"] == fridge_id

    # test to make sure testperson can't see superchef's fridge
    response = client.post(
        "/login",
        json={
            'email': "testemail@email.com",
            'password': "bad_password"})
    assert len(response.json["fridgeData"]) == 1


"""
Need tests for:
- creating a fridge
- deleting fridge
- attempting to delete fridge with wrong user_id
- getting fridges
- trying to share the same fridge twice (checking for error)
"""
