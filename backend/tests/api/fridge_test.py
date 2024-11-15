def test_unknown_fridge(client):
    response = client.get("/fridge/1000")
    assert response.status_code == 400
