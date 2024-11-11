from database.database import db
from model.fridge import Fridge


class FridgeItems(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    fridge_id: int = db.Column(
        db.Integer, db.ForeignKey(Fridge.id), nullable=False)
    name: str = db.Column(db.String(255), nullable=False)
    description: str = db.Column(db.String(255), nullable=True)
    expiration_date = db.Column(db.Date, nullable=False)
    quantity: int = db.Column(db.Integer, nullable=False)
    quantifier: str = db.Column(db.String(255), nullable=False)

    def __init__(self, fridge_id, name, description, expiration_date, quantity, quantifier):
        self.name = name
        self.fridge_id = fridge_id
        self.description = description
        self.expiration_date = expiration_date
        self.quantity = quantity
        self.quantifier = quantifier

    def serialize(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
