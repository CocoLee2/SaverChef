from flask import Flask, request, jsonify, render_template, Blueprint
import requests
import os

app = Blueprint('recipes', __name__)

# # Use environment variables or store API credentials here
# EDAMAM_APP_ID = os.getenv("EDAMAM_APP_ID", "2c7b70d9")
# EDAMAM_APP_KEY = os.getenv("EDAMAM_APP_KEY", "63116b5cc07d35c79baefa1530647068")

# # Define the base URL for the Edamam Recipe Search API
# EDAMAM_URL = "https://api.edamam.com/search"

# @app.route('/search', methods=['GET', 'POST'])
# def search():
#     print("backend recipes, line16")
#     # query = request.args.get('q')
#     data = request.json
#     ingredients = data['ingredients']
#     print(ingredients)
#     # Set up the parameters to pass to the API
#     params = {
#         "q": ingredients,
#         "app_id": EDAMAM_APP_ID,
#         "app_key": EDAMAM_APP_KEY,
#         "from": 0,
#         "to": 10,  # Number of results
#     }
    
#     # Send the request to Edamam API
#     response = requests.get(EDAMAM_URL, params=params)
    
#     # Check if the request was successful
#     if response.status_code == 200:
#         res = response.json()  # Parse the JSON response
#         recipes = []
#         # Get information in JSON
#         for hit in res.get('hits', []):
#             recipe = hit.get('recipe', {})
#             if recipe:
#                 recipe_data = {
#                     "uri": recipe.get('uri', ''),
#                     "name": recipe.get('label', ''),
#                     "image": recipe.get('image', ''),
#                     "details": {
#                         "ingredients": recipe.get('ingredientLines', [])
#                     },
#                     "url": recipe.get('url', ''),
#                     "time": recipe.get('totalTime', '')
#                 }
#                 recipes.append(recipe_data)
        
#         return jsonify({"recipes": recipes})  # Return the structured JSON response
#     else:
#         return jsonify({"error": "Failed to fetch data from Edamam"}), response.status_code


# replace with other API key, since I have run out of access...
API_KEY = "f67757c32f8740a8aadbe9a628fc18f8"

def get_info(id):
    URL = f'https://api.spoonacular.com/recipes/{id}/information'
    response = requests.get(f"{URL}?apiKey={API_KEY}")
    if response.status_code == 200:
        res = response.json()  # Parse the JSON response
        title = res.get('title', '')
        image = res.get('image', '')
        serves = res.get('servings', '')
        readyIn = res.get('readyInMinutes', '')
        
        # get steps
        steps_list = []
        analyzed_instructions = res.get("analyzedInstructions", [])
        if analyzed_instructions:
            steps = analyzed_instructions[0].get("steps", [])
            for step in steps:
                steps_list.append(step.get("step", ""))
        
        # get ingredients
        formatted_ingredients = []
        for ingredient in res.get("extendedIngredients", []):
            name = ingredient['name']
            quantity = f"{ingredient['amount']} {ingredient['unit']}".strip()  # Combine amount and unit
            formatted_ingredients.append({
                "name": name,
                "quantity": quantity
            })

        return title, image, serves, readyIn, steps_list, formatted_ingredients
    else:
        return None, None, None, None, None, None, response.status_code

@app.route('/search', methods=['GET', 'POST'])
def search():
    URL = "https://api.spoonacular.com/recipes/findByIngredients"
    data = request.json
    ingredients = data['ingredients']
    params = {
        "ingredients": ingredients,
        "number": 10,
        "ignorePantry": True,
        "rank": 1,
    }
    response = requests.get(f"{URL}?apiKey={API_KEY}", params=params)
    
    if response.status_code == 200:
        res = response.json() 
        recipes = []
        for recipe in res:
            if recipe:
                title, image, serves, readyIn, steps_list, ingredients = get_info(recipe.get('id', ''))
                # skip if there is no steps or response failed
                if steps_list != [] and title != None:
                    recipe_data = {
                        "id": recipe.get('id', ''),
                        "name": title,
                        "image": image,
                        "details": {
                            "ingredients": ingredients,
                            "directions": steps_list,
                            "readyIn": readyIn,
                            "serves": serves
                        },
                    }
                    recipes.append(recipe_data)
        return jsonify({"recipes": recipes})
    else:
        return jsonify({"error": "Failed to fetch data from Edamam"}), response.status_code


@app.route('/get_favorite', methods=['GET', 'POST'])
def get_favorite():
    data = request.json
    
    recipes = []
    for id in data["favoriet_recipes"]:
      title, image, serves, readyIn, steps_list, ingredients = get_info(id)
      # skip if there is no steps or response failed
      if steps_list != [] and title != None:
        recipe_data = {
            "id": id, 
            "name": title,
            "image": image,
            "details": {
                "ingredients": ingredients, 
                "directions": steps_list,
                "readyIn": readyIn,
                "serves": serves
            },
        }
        recipes.append(recipe_data)
    return jsonify({"recipes": recipes})


@app.route('/get_random', methods=['GET', 'POST'])
def get_random():
    URL = "https://api.spoonacular.com/recipes/random"
    data = request.json
    params = {
      "number": data['number'],
    }
    response = requests.get(f"{URL}?apiKey={API_KEY}", params=params)
    if response.status_code == 200:
        res = response.json()
        recipes = []
        for recipe in res.get('recipes', ''):
            if recipe:
                title, image, serves, readyIn, steps_list, ingredients = get_info(recipe.get('id', ''))
                if steps_list != []:
                    recipe_data = {
                        "id": recipe.get('id', ''),
                        "name": title,
                        "image": image,
                        "details": {
                            "ingredients": ingredients,
                            "directions": steps_list,
                            "readyIn": readyIn,
                            "serves": serves
                        },
                    }
                    recipes.append(recipe_data)
        return jsonify({"recipes": recipes})
    else:
        return jsonify({"error": "Failed to fetch data from Edamam"}), response.status_code


# For test
@app.route('/')
def index():
    return render_template('search.html')