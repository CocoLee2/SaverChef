from flask import Blueprint, abort, request, jsonify, Response
from model.fridge import Fridge
from user_auth.models import Users
from database.database import db

fridge_bp = Blueprint('fridge', __name__, url_prefix='/fridge')


@fridge_bp.route('/<fridge_id>')
def get_fridge_by_id(fridge_id):
  """Acquire a specific fridge by its id
  Returns the fridge if a fridge with the passed in fridge_id exists
  Otherwise returns 400 error 
  """
  try:
    fridge = Fridge.query.get(fridge_id)
    if not fridge:
      return Response(response=str(f'fridge with id {fridge_id} does not exist'), status=400)
    return jsonify(fridge.serialize())
  except Exception as e:
    return Response(response=str(e), status=400)

@fridge_bp.route('/search_by_creator')
def get_fridges_by_creator():
  """Acquires all fridges that have an creator equal to the given user id
  Usage: server/fridge/search_by_owner?creator=20
  Otherwise returns 400 error
  """
  try:
    creator_id = int(request.args.get('creator'))
    fridges = db.session.scalars(db.select(Fridge).filter_by(creator=creator_id)).all()
    if not fridges:
      return Response(response=str(f'fridges created by user with id {creator_id} do not exist'), status=400)
    return jsonify([fridge.serialize() for fridge in fridges])
  except Exception as e:
    return Response(response=str(e), status=400)



@fridge_bp.route('/create', methods=["POST"])
def create_fridge():
  """Creates a fridge for a given user passed through the request's body

  Response codes:
    200, Successful creation of a fridge
    400, user does not exist or otherwise malformed id 
  """
  try:
    creator_id = int(request.form.get("creator_id"))
    fridge_name = request.form.get("fridge_name")
    if not Users.query.get(creator_id): # fails if does not exist
      return Response(response=str("creator does not exist"), status=400)
    new_fridge = Fridge(fridge_name, creator_id)
    db.session.add(new_fridge)
    db.session.commit()
    return "Fridge successfully created."
  except Exception as e:
    return Response(response=str(e), status=400)

@fridge_bp.route('/delete/<fridge_id>', methods=["POST"])
def delete_fridge_by_id(fridge_id):
  """Deletes a given fridge by id. TODO: figure out how to have proper permissions for this

  Response codes:
  200, Successful delete 
  400, fridge does not exist
  403, does not have permissions to delete this fridge
  """
  try:
    fridge = Fridge.query.get(fridge_id)
    if not fridge:
      return Response(response=str(f'fridge with id {fridge_id} does not exist'), status=400)
    # TODO: figure out some way to allow only users or
    # someone of privileged access to delete
    db.session.delete(fridge)
    db.session.commit()
    return Response(response=f'Successfully deleted fridge with id {fridge_id}', status=200)
  except Exception as e:
    return Response(response=str(e), status=400)