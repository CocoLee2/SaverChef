from database.database import db
from model.users import Users
from model.fridge import Fridge


class FridgeMembers(db.Model):
    __tablename__ = 'fridge_members'
    fridge_id = db.Column(db.Integer, db.ForeignKey(
        Fridge.id), nullable=False, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey(
        Users.id), nullable=False, primary_key=True)

    def __init__(self, fridge_id, member_id):
        self.fridge_id = fridge_id
        self.member_id = member_id

    def serialize(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
