from flask import Blueprint, request, jsonify, Response
from model.fridge import Fridge
from model.users import Users
from model.fridge_members import FridgeMembers
from user_auth.user_auth import get_fridge_data
from database.database import db

fridge_bp = Blueprint('fridge', __name__, url_prefix='/fridge')


@fridge_bp.route('/<fridge_id>')
def get_fridge_by_id(fridge_id):
    """Acquire a specific fridge by its id
    Returns the fridge if a fridge with the passed in fridge_id exists
    Otherwise returns 400 error
    """
    try:
        fridge = Fridge.session.get(fridge_id)
        if not fridge:
            return Response(response=str(
                f'fridge with id {fridge_id} does not exist'), status=400)
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
        fridges = db.session.scalars(
            db.select(Fridge).filter_by(
                creator=creator_id)).all()
        if not fridges:
            return Response(
                response=str(
                    f'fridges created by user with id {creator_id} do not exist'),
                status=400)
        return jsonify([fridge.serialize() for fridge in fridges])
    except Exception as e:
        return Response(response=str(e), status=400)


@fridge_bp.route('/create', methods=["POST"])
def create_fridge():
    """Creates a fridge for a given user passed through the request's body

    Response codes:
      201, Successful creation of a fridge
      400, user does not exist or otherwise malformed id
    """
    try:
        data = request.json
        creator_id = int(data["creator_id"])
        fridge_name = data["fridge_name"]
        # print(creator_id)
        # print(fridge_name)
        # if not Users.session.get(creator_id):  # fails if does not exist
        #     return Response(response=str("creator does not exist"), status=400)
        user = db.session.get(Users, creator_id)
        if not user:
            return Response(response="Creator does not exist", status=400)

        new_fridge = Fridge(fridge_name, creator_id)
        db.session.add(new_fridge)
        db.session.commit()
        return jsonify({"message": "Fridge successfully created.",
                       "fridgeId": new_fridge.id, "fridgePasscode": new_fridge.passcode}), 201
    except Exception as e:
        return Response(response=str(e), status=400)


# @fridge_bp.route('/delete', methods=["POST"])
# def delete_fridge_by_id():
#     """Deletes a given fridge by id.

#     Input: {
#         user_id: int,
#         fridge_id: int
#     }

#     Response codes:
#     200, Successful delete
#     400, fridge does not exist
#     403, does not have permissions to delete this fridge if user_id does not match fridge's creator_id
#     """
#     try:
#         fridge_id = request.json["fridge_id"]
#         user_id = request.json["user_id"]
#         fridge = Fridge.query.get(fridge_id)
#         # print(fridge_id)
#         if not fridge:
#             return Response(response=str(
#                 f'fridge with id {fridge_id} does not exist'), status=400)
#         if fridge.creator != user_id:
#             return Response(
#                 response=str(f'fridge\'s creator does not match provided id {user_id}'),
#                 status=403)
#         db.session.delete(fridge)
#         db.session.commit()
#         return Response(
#             response=f'Successfully deleted fridge with id {fridge_id}',
#             status=200)
#     except Exception as e:
#         return Response(response=str(e), status=400)
@fridge_bp.route('/delete', methods=["POST"])
def delete_fridge_by_id():
    """Deletes a given fridge by ID.

    Input:
    {
        "user_id": int,
        "fridge_id": int
    }

    Response codes:
    200 - Successful delete
    400 - Fridge does not exist or bad request
    403 - User does not have permission to delete this fridge
    """
    try:
        fridge_id = request.json["fridge_id"]
        user_id = request.json["user_id"]

        print(
            f"Request to delete fridge: fridge_id={fridge_id}, user_id={user_id}")

        fridge = Fridge.query.get(fridge_id)
        if not fridge:
            return jsonify({"error": f"Fridge with id {fridge_id} does not exist"}), 400

        if fridge.creator != user_id:  # Ensure you compare to the actual creator ID
            return jsonify({"error": f"User {user_id} does not have permission to delete this fridge"}), 403

        db.session.delete(fridge)
        db.session.commit()

        return jsonify({"message": f"Successfully deleted fridge with id {fridge_id}"}), 200

    except KeyError as e:
        return jsonify({"error": f"Missing key: {str(e)}"}), 400
    except Exception as e:
        print(f"Unhandled exception: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500


@fridge_bp.route("/share", methods=["POST"])
def share_fridge():
    """Gives the given user access to a fridge given that the corresponding passcode is given

    Input: {
        fridgePasscode: str,
        userId: int (the user who is to be added as a fridge member)
    }

    Output:
        return all of user's accessible fridges in the format:
            fridgeData: [
                {
                    fridgeId: int,
                    fridgeName: str,
                    fridgePasscode: str, 
                    fridgeItems: [...]
                }, ...
            ]
        with a status code of 200 if successful.
        If the userId already has access to the given fridge or is the creator, return error code 409
        If the passcode does not correspond to any fridge, return error code 404
    """

    fridge_passcode = request.json["fridgePasscode"]
    user_id = request.json["userId"]

    fridge = Fridge.query.filter_by(passcode=fridge_passcode).first()
    if not fridge:
        return jsonify({"error": f"Fridge with passcode {fridge_passcode} does not exist"}), 404
    if FridgeMembers.query.filter_by(fridge_id=fridge.id, member_id=user_id).first() is not None or fridge.creator == user_id:
        return jsonify({"error": "You already have access to this fridge"}), 409
    new_member = FridgeMembers(fridge.id, user_id)
    db.session.add(new_member)
    db.session.commit()
    return jsonify({"fridgeData": get_fridge_data(user_id)})
