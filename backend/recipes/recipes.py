from flask import Flask, request, jsonify, render_template, Blueprint
import requests
import os

app = Blueprint('recipes', __name__)

# Use environment variables or store API credentials here
EDAMAM_APP_ID = os.getenv("EDAMAM_APP_ID", "YOUR_APP_ID")
EDAMAM_APP_KEY = os.getenv("EDAMAM_APP_KEY", "YOUR_APP_KEY")

# Define the base URL for the Edamam Recipe Search API
EDAMAM_URL = "https://api.edamam.com/search"

@app.route('/search', methods=['GET'])
def search():
    # query = request.args.get('q')
    data = request.json
    ingredients = data['ingredients']
    # Set up the parameters to pass to the API
    params = {
        "q": ingredients,
        "app_id": EDAMAM_APP_ID,
        "app_key": EDAMAM_APP_KEY,
        "from": 0,
        "to": 10,  # Number of results
    }
    
    # Send the request to Edamam API
    response = requests.get(EDAMAM_URL, params=params)
    
    # Check if the request was successful
    if response.status_code == 200:
        res = response.json()  # Parse the JSON response
        recipes = []
        # Get information in JSON
        for hit in res.get('hits', []):
            recipe = hit.get('recipe', {})
            if recipe:
                recipe_data = {
                    "uri": recipe.get('uri', ''),
                    "name": recipe.get('label', ''),
                    "image": recipe.get('image', ''),
                    "details": {
                        "ingredients": recipe.get('ingredientLines', [])
                    },
                    "url": recipe.get('url', ''),
                    "time": recipe.get('totalTime', '')
                }
                recipes.append(recipe_data)
        
        return jsonify({"recipes": recipes})  # Return the structured JSON response
    else:
        return jsonify({"error": "Failed to fetch data from Edamam"}), response.status_code

# For test
@app.route('/')
def index():
    return render_template('search.html')