def test_unknown_fridge(client):
    response = client.get("/fridge/1000")
    assert response.status_code == 400


"""
Need tests for:
- creating a fridge
- deleting fridge
- attempting to delete fridge with wrong user_id
- getting fridges
"""
