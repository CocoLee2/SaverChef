import pytest
from app import create_app
from database.database import db
from dotenv import load_dotenv
from os import getenv


@pytest.fixture()
def app():
    load_dotenv()
    app = create_app(getenv("TEST_DATABASE_URI"))
    app.config.update({
        "TESTING": True,
    })

    yield app

    # clean up / reset resources here
    with app.app_context():
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()

# @pytest.fixture(scope="function")
# def db_session(app):
#     with app.app_context():
#         yield db.session
#         db.session.rollback()

# def populate_database(db_session):
#     Users(username)