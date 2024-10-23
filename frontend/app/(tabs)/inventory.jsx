import { StatusBar, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, {useState} from 'react'
import { ListItem, SearchBar } from "react-native-elements";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Inventory = () => {
  const [search, setSearch] = useState('');
  const [isMenuOpen, openMenu] = useState(false);
  const toggleMenu = () => {
    openMenu(!isMenuOpen);
  };
  const [items, setItems] = useState([
    // Example items
    { id: '1', name: 'Tomatoes', quantity: '3 pcs', bestBefore: 'Nov 28' },
    { id: '2', name: 'Potatoes', quantity: '5 pcs', bestBefore: 'Dec 15' },
  ]);
  const renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <MaterialIcons name="local-grocery-store" size={24} color="black" />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{`Best before ${item.bestBefore}`}</ListItem.Subtitle>
      </ListItem.Content>
      <Text>{item.quantity}</Text>
    </ListItem>
  );
  
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"  
      />

      <Text style={styles.header}>My Fridge</Text>

      <SearchBar
        placeholder="Type your ingredients"
        onChangeText={setSearch}
        value={search}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInput}
      />

      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      ) : (
        <Text style={styles.emptyMessage}>No ingredients yet</Text>
      )}

      {isMenuOpen && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => alert('Add Manually')}>
            <MaterialIcons name="edit" size={24} color="black" />
            <Text style={styles.menuItemText}>Add Manually</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => alert('Scan Barcode')}>
            <MaterialIcons name="qr-code-scanner" size={24} color="black" />
            <Text style={styles.menuItemText}>Scan Barcode</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => alert('Share')}>
            <MaterialIcons name="share" size={24} color="black" />
            <Text style={styles.menuItemText}>Share</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleMenu}>
          <MaterialIcons name={isMenuOpen ? "close" : "add"} size={30} color="white" />
        </TouchableOpacity>
      </View>

     
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
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    alignItems: 'center',
  },

  menu: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  menuItemText: {
    marginLeft: 10,
    fontSize: 16,
  },

  list: {
    width: '90%',
  },

  emptyMessage: {
    marginTop: 20,
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
})

export default Inventory
