def test_create_user(client):
    response = client.post("/signup", json={'username': "testperson", 'email': "testemail@email.com", 'password': "bad_password"})
    print(response)
    assert response.status_code == 201

def test_create_user_again(client):
    client.post("/signup", json={'username': "testperson", 'email': "testemail@email.com", 'password': "bad_password"})
    response = client.post("/signup", json={'username': "testperson", 'email': "testemail@email.com", 'password': "bad_password"})
    assert response.status_code != 201

# def test_delete_user(client):
    