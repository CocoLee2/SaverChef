from flask_restful import Api

def add_resources(api: Api) -> None:
  """Adds API endpoints to Flask application"""
  # api.add_resource(first parameter should be a class defined in 
  # backend/controller/api_resources)
  # second defines the actual endpoint, we might want every endpoint to start
  # with "/api/..."
  # third parameter might be resource_class_kwargs where data access models
  # are included if needed.
def setup(api: Api) -> None:
  """Sets up Flask application"""

  # initialize any data access models here 

  add_resources(api) # include any data access models as well as parameters

  # TODO API calls
  # login, logout,
  # create, delete account 
  # change password 
  # TBD forget password?
  # get recipes 
  # get inventory items (soon to be expired?)
  # get favorite recipes
