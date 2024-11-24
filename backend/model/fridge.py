from database.database import db
from model.users import Users
import secrets
import string


def passcode_unique(passcode):
    return not bool(
        db.session.query(Fridge).filter_by(
            passcode=passcode).first())


class Fridge(db.Model):
    __tablename__ = 'fridge'
    id: int = db.Column(db.Integer, primary_key=True)
    name: str = db.Column(db.String(80), nullable=False)
    creator: int = db.Column(
        db.Integer, db.ForeignKey(
            Users.id), nullable=False)
    passcode: str = db.Column(
        db.String(6), nullable=False, unique=True)  # used for sharing

    def __init__(self, fridge_name, creator_id):
        alphabet = string.ascii_letters + string.digits
        self.name = fridge_name
        self.creator = creator_id
        self.passcode = ''.join(secrets.choice(alphabet) for i in range(6))
        while not passcode_unique(self.passcode):
            self.passcode = ''.join(secrets.choice(alphabet) for i in range(6))

    def serialize(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
