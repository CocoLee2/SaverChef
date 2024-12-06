from model.fridge_members import FridgeMembers
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


def test_delete_shared_fridge(client):
    # tests to see if fridge members are correctly deleted when the fridge is deleted
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

    client.post("/fridge/delete",
                json={"user_id": user_id, "fridge_id": fridge_id})
    # assumes that no sharing occurs in conftest.py. if there is, need to rewrite this
    assert db.session.query(FridgeMembers).count() == 0
    # double check to make sure no users are deleted because of improper cascading
    assert db.session.query(Users).count() == 2


def test_delete_user_deletes_membership(client):
    # tests to see if fridge members are correctly deleted when a user who is a member is deleted
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

    assert db.session.query(FridgeMembers).count() == 1
    client.post("/delete_account",
                json={"email": "superchef@superchef.com"})
    # assumes that no sharing occurs in conftest.py. if there is, need to rewrite this
    assert db.session.query(FridgeMembers).count() == 0


def test_leave_shared_fridge(client):
    # tests to see if fridge members correctly leave a fridge
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

    response = client.post("/fridge/leave", json={
        'fridge_id': fridge_id,
        'user_id': superchef_id
    })
    assert response.status_code == 200
    # assumes that no sharing occurs in conftest.py. if there is, need to rewrite this
    assert db.session.query(FridgeMembers).filter(
        FridgeMembers.fridge_id == fridge_id).count() == 0

    # tests that creator cannot leave
    response = client.post("/fridge/leave", json={
        'fridge_id': fridge_id,
        'user_id': user_id
    })

    assert response.status_code == 403

    # tests that user who isn't part of shared fridge can't leave
    response = client.post("/fridge/leave", json={
        'fridge_id': fridge_id,
        'user_id': superchef_id
    })
    assert response.status_code == 400


"""
Need tests for:
- creating a fridge
- deleting fridge
- attempting to delete fridge with wrong user_id
- getting fridges
- trying to share the same fridge twice (checking for error)
"""
