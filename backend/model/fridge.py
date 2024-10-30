from database.database import db
from model.users import Users
class Fridge(db.Model):
  __tablename__ = 'fridge'
  id: int= db.Column(db.Integer, primary_key=True)
  name: str = db.Column(db.String(80), nullable=False)
  creator: int = db.Column(db.Integer, db.ForeignKey(Users.id), nullable=False)

  def __init__(self, fridge_name, creator_id):
    self.name = fridge_name
    self.creator = creator_id
  def serialize(self):
    return {c.name: getattr(self, c.name) for c in self.__table__.columns}