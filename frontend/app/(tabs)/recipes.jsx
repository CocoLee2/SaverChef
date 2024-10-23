import { StatusBar, View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native'
import React, {useState} from 'react'
import { ListItem, SearchBar } from "react-native-elements";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Recipes = () => {
  const [search, setSearch] = useState('');
  const useIngredients = () => {
    console.log("search");
  }
  const recipes = [
    {
      id: '1',
      title: 'Maple Syrup Pancake',
      image: require('../../assets/images/recipe1.jpg'),
    },
    {
      id: '2',
      title: 'Creamy Pumpkin Soup',
      image: require('../../assets/images/recipe5.jpg'),
    },
    {
      id: '3',
      title: 'Barbecued Salmon',
      image: require('../../assets/images/recipe3.jpg'),
    },
    {
      id: '4',
      title: 'Creamy Tomato Rigatoni',
      image: require('../../assets/images/recipe4.jpg'),
    },
  ];

  const handleRecipePress = (item) => {
    console.log(`Recipe selected: ${item.title}`);
    // navigate to a detailed recipe screen
  };

  const renderRecipe = ({ item }) => (
    <View style={styles.recipeCard}>
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle}>{item.title}</Text>
      <TouchableOpacity style={styles.favoriteButton}>
        <MaterialIcons name="favorite-border" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"  
      />

      <Text style={styles.header}>What's in your Kitchen?</Text>

      <SearchBar
        placeholder="Type your ingredients"
        onChangeText={setSearch}
        value={search}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInput}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={useIngredients}>
          <Text style={styles.buttonText}>Use my ingredients</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subHeader}>Suggested Recipes</Text>

      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.recipeRow}
        contentContainerStyle={styles.recipeList}
      />
     
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9ED',
    alignItems: 'center',
  },

  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#F36C21',
    marginTop: 70,
    marginLeft: 20,
    textAlign: "left",
    alignSelf: 'flex-start',
  },

  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F36C21',
    marginTop: 30,
    marginLeft: 20,
    textAlign: "left",
    alignSelf: 'flex-start',
  },


  searchContainer: {
    width: '90%',
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    marginVertical: 20,
  },

  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 10,
  },

  button: {
    backgroundColor: '#F36C21',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  buttonContainer: {
    width: '90%',
    pmarginTop: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  recipeList: {
    paddingHorizontal: 10,
  },

  recipeRow: {
    justifyContent: 'space-between',
  },

  recipeCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    overflow: 'hidden',
    width: '48%', // Adjust based on spacing needs
    alignItems: 'center',
    position: 'relative',
  },

  recipeImage: {
    width: '100%',
    height: 120,
  },

  recipeTitle: {
    padding: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },

  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
  },
})


export default Recipes

