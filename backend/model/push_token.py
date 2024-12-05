from database.database import db
from model.users import Users  # Import Users for the foreign key relationship

class PushToken(db.Model):
    __tablename__ = 'push_tokens'  # Database table name
    id = db.Column(db.Integer, primary_key=True)  # Unique ID
    user_id = db.Column(db.Integer, db.ForeignKey(Users.id), nullable=False)  # Link to user
    token = db.Column(db.String(255), nullable=False, unique=True)  # Push token

    def __init__(self, user_id, token):
        self.user_id = user_id
        self.token = token

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "token": self.token,
        }

# A user may log in on multiple devices, each with its own push token. 
# Storing a single token in the Users table wouldn’t support this scenario,
# and that's one of the reasons why we created this PushToken table