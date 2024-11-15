from flask import Flask, request, jsonify, render_template, Blueprint
import requests
import os

app = Blueprint('recipes', __name__)

# Nancy's API key: "f67757c32f8740a8aadbe9a628fc18f8"
# Leslie's API key: "970f703fdfec480aa59e58a3e9ccec77"
# if you get status code 402, replace API_KEY with another one
API_KEY = "970f703fdfec480aa59e58a3e9ccec77"


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
            # Combine amount and unit
            quantity = f"{ingredient['amount']} {ingredient['unit']}".strip()
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
                title, image, serves, readyIn, steps_list, ingredients = get_info(
                    recipe.get('id', ''))
                # skip if there is no steps or response failed
                if steps_list != [] and title is not None and image != "":
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
        return jsonify(
            {"error": "Failed to fetch data from Edamam"}), response.status_code


@app.route('/get_favorite', methods=['GET', 'POST'])
def get_favorite():
    data = request.json

    recipes = []
    for id in data["favoriet_recipes"]:
        title, image, serves, readyIn, steps_list, ingredients = get_info(id)
        # skip if there is no steps or response failed
        if steps_list != [] and title is not None and image != "":
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
                title, image, serves, readyIn, steps_list, ingredients = get_info(
                    recipe.get('id', ''))
                if steps_list != [] and title is not None and image != "":
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
        return jsonify(
            {"error": "Failed to fetch data from Edamam"}), response.status_code


# For test
@app.route('/')
def index():
    return render_template('search.html')
