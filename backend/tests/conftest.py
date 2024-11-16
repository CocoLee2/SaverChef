import pytest
from app import create_app
from database.database import db
from dotenv import load_dotenv
from model.fridge import Fridge
from model.users import Users
from os import getenv


@pytest.fixture()
def app():
    load_dotenv()
    app = create_app(getenv("TEST_DATABASE_URI"))
    app.config.update({
        "TESTING": True,
    })
    # populate_database()
    yield app

    # clean up / reset resources here
    with app.app_context():
        db.drop_all()


@pytest.fixture()
def client(app):
    populate_database()
    return app.test_client()


def populate_database():
    new_user = Users(
        username="superchef",
        email="superchef@superchef.com",
        password="supercoolpassword",
        favoriteRecipes=[]
    )
    db.session.add(new_user)
    db.session.commit()
    new_fridge = Fridge("superchef's fridge", new_user.id)
    db.session.add(new_fridge)
    db.session.commit()
