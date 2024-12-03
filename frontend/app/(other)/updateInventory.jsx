import { StatusBar, View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, TextInput, Alert, Dimensions, Image} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { React, useContext, useState } from 'react';
import CustomButton from '../../components/CustomButton'
import { GlobalContext } from "../GlobalContext";
import { Ionicons } from '@expo/vector-icons';
import images from '../../constants/images';
import Modal from 'react-native-modal';


const UpdateInventory = () => {
  const { userId, setUserId, username, setUsername, email, setEmail, password, setPassword, 
    fridgeItems, setFridgeItems, favoriteRecipes, setFavoriteRecipes, randomRecipes, setRandomRecipes } = useContext(GlobalContext);
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { matchedItemsString } = useLocalSearchParams();
  const initialMatchedItems = JSON.parse(matchedItemsString);

  const [matchedItems, setMatchedItems] = useState(
    initialMatchedItems.map((fridge) => ({
      ...fridge,
      items: fridge.items.map(({ bestBefore, ...item }) => ({
        ...item,
        quantity: 0, 
      })),
    }))
  );

  function filterMatchedItems(matchedItems) {
    const result = [];
    matchedItems.forEach((fridge) => {
      fridge.items.forEach((item) => {
        if (item.quantity > 0) {
          result.push({ id: item.id, quantity: item.quantity });
        }
      });
    });
    return result;
  }
                        
  const handleUpdate = async () => {  
    console.log("handleUpdate is called");
    const filteredList = filterMatchedItems(matchedItems);
    console.log("Filtered List:", filteredList);
  
    try {
      // Call handleUpdateHelper for each item in the filteredList
      await Promise.all(
        filteredList.map(({ id, quantity }) => handleUpdateHelper(id, quantity))
      );
  
      refresh();
      Alert.alert(
        "Update Completed",
        "The items have been updated successfully.",
        [{text: "Done", onPress: () => router.back(),},]
      );
    } catch (error) {
      console.error("Error updating items:", error);
      Alert.alert('Error', 'Something went wrong while updating items.');
    }
  };
  

  const handleUpdateHelper = async (id, quantity) => {
    await fetch('http://127.0.0.1:5001/fridge_item/update_or_delete_item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemId: id,
        quantity: quantity,
      }),
    });
  };

  const processFridgeData = (fridgeData) => {
    return fridgeData.map(fridge => {
      const processedItems = fridge.fridgeItems.map(item => {
        const expirationDate = new Date(item.expiration_date);
        return {
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.quantifier,
          bestBefore: new Date(
            expirationDate.getFullYear(),
            expirationDate.getMonth(),
            expirationDate.getDate()+1
          ),
        };
      });
  
      return {
        fridgeId: fridge.fridgeId,
        fridgeName: fridge.fridgeName,
        fridgeItems: processedItems,
        fridgePasscode: fridge.fridgePasscode
      };
    });
  };

  const refresh = async() => {
    try {
      const response = await fetch('http://127.0.0.1:5001/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,  
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (fridgeItems.length === 0) {
          setFridgeItems((prevFridgeItems) => [...prevFridgeItems, processFridgeData(data["fridgeData"])]);
        } else {
          setFridgeItems(processFridgeData(data["fridgeData"]));
        }
      } else {
        Alert.alert('Error', data.message || 'Request failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Network Error', 'Something went wrong. Please try again later.');
    }
  }

  const getImage = (foodName) => {
    const normalizeName = (name) => {
      let lowerName = name.toLowerCase();
      if (lowerName.endsWith("es")) {
        return lowerName.slice(0, -2); // Remove "es"
      } else if (lowerName.endsWith("s")) {
        return lowerName.slice(0, -1); // Remove "s"
      }
      return lowerName;
    };
  
    const sanitizedFoodName = foodName.replace(/[^a-zA-Z]/g, '').toLowerCase();
    let image = images[sanitizedFoodName];
    if (!image) {
      const normalizedFoodName = normalizeName(sanitizedFoodName);
      image = images[normalizedFoodName];
    }
    return image ? image : require('../../assets/images/placeHolder.png');
  };
  

  const openEditModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };


  const saveChanges = () => {
    // Validate the quantity
    if (selectedItem.quantity === "" || selectedItem.quantity < 0) {
      Alert.alert('Incomplete Information', 'Please enter a valid quantity before proceeding.');
      return;
    }
  
    // Update matchedItems immutably
    const updatedMatchedItems = matchedItems.map((fridge) => ({
      ...fridge,
      items: fridge.items.map((item) =>
        item.id === selectedItem.id
          ? { ...item, quantity: selectedItem.quantity } // Update the quantity
          : item
      ),
    }));
  
    setMatchedItems(updatedMatchedItems); // Update the state with the new matchedItems
    setModalVisible(false);
  };
  

  return (
    <View style={styles.container}>
      {/* Header with Back Arrow and Title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#F36C21" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Enter Ingredients Used</Text>
      </View>

      {/* Fridge and Items List */}
      <FlatList
        data={matchedItems}
        keyExtractor={(fridge) => fridge.fridgeName}
        style={styles.list}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item: fridge }) => (
          <View>
            {/* Fridge Name */}
            <Text style={styles.fridgeName}>{fridge.fridgeName}</Text>

            {/* Items in Fridge */}
            {fridge.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => openEditModal(item)}
                style={styles.foodItem}
              >
                <Image source={getImage(item.name)} style={styles.foodImage} />
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{item.name}</Text>
                </View>
                <Text style={styles.quantityText}>{`${item.quantity} ${item.unit}`}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        ListEmptyComponent={<Text>No items to display</Text>}
      />

      {/* Modal for editing item */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Update quantity</Text>

          <Text style={styles.label}>Quantity</Text>
          <View style={styles.quantityRow}>
            <TextInput
              style={styles.inputQuantity}
              keyboardType="numeric"
              value={selectedItem?.quantity?.toString()} // Ensure value is a string
              onChangeText={(text) => setSelectedItem((prev) => ({ ...prev, quantity: parseFloat(text) || "" }))}
              placeholder="Enter quantity"
            />
          </View>
          <TouchableOpacity style={styles.doneButton} onPress={saveChanges}>
            <Text style={styles.doneButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <CustomButton 
        title="Update"
        handlePress={handleUpdate}
        containerStyles={styles.customContainer}
      />
    </View>
  )
}

export default UpdateInventory

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  customContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center', // Ensure the button is centered
  },
  list: {
    width: '100%',
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 18,
    color: '#333',
  },
  foodDate: {
    color: '#888',
  },
  foodQuantity: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F36C21',
    marginTop: 2,
  },
  container: {
    flex: 1,
    backgroundColor: '#FEF9ED',
    paddingHorizontal: 20,
  },
  foodImage: {
    width: 40,  
    height: 40,  
    marginRight: 10,
  },
  modal: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 0,
    marginTop: 50,
  },

  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignSelf: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: '#F36C21',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputQuantity: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  fridgeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#5A5A5A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 45,
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F36C21', 
    marginLeft: 10, 
  },
});