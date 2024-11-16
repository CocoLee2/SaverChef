import { StatusBar, View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, TextInput, Alert, Dimensions, Image} from 'react-native'
import React, { useState, useEffect, useRef, useContext } from 'react'
import { ListItem, SearchBar } from "react-native-elements";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from "expo-router";
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import images from '../../constants/images';
import { GlobalContext } from "../GlobalContext";
import { useNavigation } from '@react-navigation/native';


const Inventory = () => {
  const { userId, setUserId, username, setUsername, email, setEmail, password, setPassword, 
    fridgeItems, setFridgeItems, favoriteRecipes, setFavoriteRecipes, randomRecipes, setRandomRecipes } = useContext(GlobalContext);
  const [selectedFridge, setSelectedFridge] = useState(fridgeItems.length > 0 ? fridgeItems[0].fridgeId : null);
  const [fridgeIds, setFridgeIds] = useState(fridgeItems.map(fridge => fridge.fridgeId));
  const selectedFridgeObj = fridgeItems.find(fridge => fridge.fridgeId === selectedFridge);
  const getFridgeNameById = (id) => {
    const fridge = fridgeItems.find((fridge) => fridge.fridgeId === id);
    return fridge ? fridge.fridgeName : "No Fridge Selected";
  };

  const [search, setSearch] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('pcs');
  const [selectedItem, setSelectedItem] = useState({ id: '', name: '', quantity: '', unit: 'pcs', bestBefore: new Date() });
  const scrollViewRef = useRef(null);
  const [newFridgeName, setNewFridgeName] = useState('');
  const [isEditingFridge, setIsEditingFridge] = useState(false);
  const [editingFridgeIndex, setEditingFridgeIndex] = useState(null);
  const [editedFridgeName, setEditedFridgeName] = useState('');

 
  const getImage = (foodName) => {
    const sanitizedFoodName = foodName.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const image = images[sanitizedFoodName];
    return image ? image : require('../../assets/images/placeHolder.png');
  };

  useEffect(() => {
    const selectedFridgeExists = fridgeItems.some(fridge => fridge.fridgeId === selectedFridge);

    if (!selectedFridgeExists) {
      const defaultFridgeId = fridgeItems.length > 0 ? fridgeItems[0].fridgeId : null;
      if (defaultFridgeId) {
        setSelectedFridge(defaultFridgeId);
      }
    }
  }, [selectedFridge, fridgeItems]);


  const addNewFridge = () => {
    // tidi: connect to backend, this newFridgeId should be get from the returned data
    const newFridgeId = 12345;
    if (newFridgeName.trim()) {
      const newFridge = {
        fridgeId: newFridgeId,
        fridgeName: newFridgeName.trim(),
        fridgeItems: []
      };
      setFridgeIds((fridgeIds) => [...fridgeIds, newFridgeId]);
      setFridgeItems((prevFridgeItems) => [...prevFridgeItems, newFridge]);
      setNewFridgeName('');
      setSelectedFridge(newFridgeId);
      setDropdownVisible(false);
    } else {
      Alert.alert("Invalid Name", "Please enter a valid fridge name.");
    }
  };

  // const editFridgeName = () => {
  //   if (editedFridgeName.trim()) {
  //       setFridgeIds(fridgeIds.map((fridge) => (fridge === selectedFridge ? editedFridgeName.trim() : fridge)));
  //       setFridgeItems((prevItemsByFridge) => {
  //           const updatedItems = { ...prevItemsByFridge };
  //           updatedItems[editedFridgeName.trim()] = updatedItems[selectedFridge];
  //           delete updatedItems[selectedFridge];
  //           return updatedItems;
  //       });
  //       setSelectedFridge(editedFridgeName.trim());
  //       setIsEditingFridge(false);
  //   } else {
  //       Alert.alert("Invalid Name", "Please enter a valid fridge name.");
  //   }
  // };

  // // Start editing a specific fridge name
  // const startEditingFridge = (index) => {
  //   setEditingFridgeIndex(index);
  //   setEditedFridgeName(fridgeIds[index]);
  //   setIsEditingFridge(true);
  // };

  // // Save the edited fridge name
  // const saveEditedFridgeName = () => {
  //   if (editedFridgeName.trim()) {
  //       const updatedFridges = [...fridgeIds];
  //       const oldFridgeName = updatedFridges[editingFridgeIndex];
  //       updatedFridges[editingFridgeIndex] = editedFridgeName.trim();
        
  //       setFridgeIds(updatedFridges);

  //       // Update fridgeItems to match the new fridge name
  //       setFridgeItems((prevItemsByFridge) => {
  //           const updatedItems = { ...prevItemsByFridge };
  //           updatedItems[editedFridgeName.trim()] = updatedItems[oldFridgeName];
  //           delete updatedItems[oldFridgeName];
  //           return updatedItems;
  //       });

  //       // Update the selected fridge if it was being edited
  //       if (selectedFridge === oldFridgeName) {
  //           setSelectedFridge(editedFridgeName.trim());
  //       }

  //       setIsEditingFridge(false);
  //       setEditingFridgeIndex(null);
  //     } else {
  //         Alert.alert("Invalid Name", "Please enter a valid fridge name.");
  //     }
  //   };

    // // Cancel editing the fridge name
    // const cancelEditFridgeName = () => {
    //   setIsEditingFridge(false);
    //   setEditingFridgeIndex(null);
    //   setEditedFridgeName('');
    // };


    const deleteFridge = (index) => {
      const fridgeToDelete = fridgeItems[index];
    
      Alert.alert(
        'Delete Fridge',
        `Are you sure you want to delete ${fridgeToDelete.fridgeName}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete', style: 'destructive', onPress: () => {

              // Update the selected fridge if the deleted fridge was the selected one
              if (selectedFridge === fridgeToDelete.fridgeId) {
                const remainingFridgeIds = fridgeIds.filter(id => id !== fridgeToDelete.fridgeId);
                const newSelectedFridge = remainingFridgeIds.length > 0 ? remainingFridgeIds[0] : null;
                setSelectedFridge(newSelectedFridge);
              }

              // Remove the fridge from fridgeIds and fridgeItems array 
              setFridgeIds((prevFridgeIds) => prevFridgeIds.filter(id => id !== fridgeToDelete.fridgeId));
              setFridgeItems((prevFridgeItems) =>
                prevFridgeItems.filter(fridge => fridge.fridgeId !== fridgeToDelete.fridgeId)
              );

              // tidi: connect to the backend, the fridgeId i will pass in is fridgeToDelete.fridgeId
            }
          }
        ]
      );
    };
    


  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);
  const toggleModal = () => setModalVisible(!isModalVisible);

  const openEditModal = (item) => {
    setSelectedItem(item);
    setSelectedUnit(item.unit || 'pcs');
    setModalVisible(true);
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const screenWidth = Dimensions.get('window').width;
    const currentIndex = Math.round(scrollPosition / screenWidth);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedItem.bestBefore;
    setShowDatePicker(false);
    setSelectedItem({ ...selectedItem, bestBefore: currentDate });
  };

  const saveChanges = () => {
    // check if the information is valid
    if (selectedItem.name === "" || selectedItem.quantity === ""){
      Alert.alert('Incomplete Information', 'Please enter both the item name and quantity before proceeding.');
      return
    }
    if (selectedItem.quantity <= 0){
      Alert.alert('Invalid Information', 'Please make sure that quantity is positive.');
      return
    }

    // tidi: connect to backend (update_item)
    setFridgeItems((prevItemsByFridge) =>
      prevItemsByFridge.map((fridge) =>
        fridge.fridgeId === selectedFridge
          ? {
              ...fridge,
              fridgeItems: fridge.fridgeItems.map((item) =>
                item.id === selectedItem.id ? { ...selectedItem, unit: selectedUnit } : item
              ),
            }
          : fridge
      )
    );
    setModalVisible(false);
  };
  

  const addItem = () => {
    // check if the information is valid
    if (selectedItem.name === "" || selectedItem.quantity === ""){
      Alert.alert('Incomplete Information', 'Please enter both the item name and quantity before proceeding.');
      return
    }
    if (selectedItem.quantity <= 0){
      Alert.alert('Invalid Information', 'Please make sure that quantity is positive.');
      return
    }

    // tidi: connect to the backend, and change id (add_item)
    const newItem = { ...selectedItem, id: Date.now().toString(), unit: selectedUnit };
    setFridgeItems((prevItemsByFridge) =>
      prevItemsByFridge.map((fridge) =>
        fridge.fridgeId === selectedFridge
          ? { ...fridge, fridgeItems: [...fridge.fridgeItems, newItem] }
          : fridge
      )
    );
    setModalVisible(false);
  };
  
  const deleteItem = (itemId) => {
    // tidi: connect to backend (delete_item)
    setFridgeItems((prevItemsByFridge) =>
      prevItemsByFridge.map((fridge) =>
        fridge.fridgeId === selectedFridge
          ? {
              ...fridge,
              fridgeItems: fridge.fridgeItems.filter((item) => item.id !== itemId),
            }
          : fridge
      )
    );
  };

  const handleLongPress = (itemId) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteItem(itemId),
        },
      ]
    );
  };


  const renderItem = (item, isExpired) => (
    <TouchableOpacity onPress={() => openEditModal(item)} onLongPress={() => handleLongPress(item.id)} style={styles.foodItem}>
      <Image 
        source={getImage(item.name)} 
        style={styles.foodImage} 
      />
      <View style={styles.foodInfo}>
        {/* Use isExpired parameter to conditionally apply styles */}
        <Text style={[styles.foodName, isExpired && styles.expiredFoodName]}>
          {item.name}
        </Text>
        <Text style={[styles.foodDate, isExpired && styles.expiredFoodDate]}>Best before {item.bestBefore.toDateString()}</Text>
      </View>
      <Text style={[styles.quantityText, isExpired && styles.expiredFoodDate]}>
      {`${item.quantity} ${item.unit}`}
      </Text>
    </TouchableOpacity>
  );
  

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownTrigger}>
        <Text style={styles.header}>
          {selectedFridge ? getFridgeNameById(selectedFridge) : "No Fridge Selected"}
        </Text>

          <Ionicons name="caret-down-outline" size={20} color="#F36C21" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { setSelectedItem({ id: '', name: '', quantity: '', unit: 'pcs', bestBefore: new Date() }); toggleModal(); }}>
          <Ionicons name="add-circle-outline" size={30} color="#F36C21" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '../(other)/scan' })}>
          <MaterialIcons name="qr-code-scanner" size={30} color="#F36C21" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: '../(other)/share' })}>
          <MaterialIcons name="share" size={30} color="#F36C21" />
        </TouchableOpacity>
      </View>

      <SearchBar
        placeholder="Type your ingredients"
        onChangeText={setSearch}
        value={search}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInput}
      />


      {selectedFridgeObj && selectedFridgeObj.fridgeItems.length > 0 ? (
        <FlatList
          data={selectedFridgeObj.fridgeItems}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          renderItem={({ item }) => (
            renderItem(item, item.bestBefore < new Date()) // Pass isExpired as a parameter
          )}
        />
      ) : (
        <Text style={styles.emptyMessage}>No ingredients yet</Text>
      )}


      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.carouselContainer}
      ></ScrollView>

      {/* Dropdown Modal */}
      <Modal isVisible={isDropdownVisible} onBackdropPress={toggleDropdown} backdropOpacity={0.3} style={styles.dropdownModal}>
        <View style={styles.dropdown}>
            {fridgeIds.map((fridge, index) => (
                <View key={index} style={styles.dropdownItemContainer}>
                    {editingFridgeIndex === index ? (
                        // Render input field for editing fridge name
                        <TextInput
                            style={styles.input}
                            value={editedFridgeName}
                            onChangeText={setEditedFridgeName}
                            placeholder="Edit fridge name"
                        />
                    ) : (
                        // Render fridge name with edit button
                        <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => {
                                setSelectedFridge(fridge);
                                setDropdownVisible(false);
                            }}
                        >
                            <Text style={styles.dropdownText}>
        {fridge ? getFridgeNameById(fridge) : "Unnamed Fridge"}
    </Text>
                        </TouchableOpacity>
                    )}

                    {/* Action Buttons: Edit and Delete or Save and Cancel */}
                    {editingFridgeIndex === index ? (
                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.saveButton} onPress={saveEditedFridgeName}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={cancelEditFridgeName}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.actionButtons}>
                            {/* <TouchableOpacity style={styles.editButton} onPress={() => startEditingFridge(index)}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteFridge(index)}>
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity> 
                        </View>
                    )}
                </View>
            ))}

            {/* Input and button to create a new fridge */}
            <TextInput
                style={styles.input}
                placeholder="New fridge name"
                value={newFridgeName}
                onChangeText={setNewFridgeName}
            />
            <TouchableOpacity style={styles.addButton} onPress={addNewFridge}>
                <Text style={styles.addButtonText}>Create New Fridge</Text>
            </TouchableOpacity>
        </View>
    </Modal>




      {/* Modal for Editing Fridge Name */}
      <Modal isVisible={isEditingFridge} onBackdropPress={() => setIsEditingFridge(false)} style={styles.modal}>
          <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Fridge Name</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Enter new fridge name"
                  value={editedFridgeName}
                  onChangeText={setEditedFridgeName}
              />
              {/* <TouchableOpacity style={styles.doneButton} onPress={editFridgeName}>
                  <Text style={styles.doneButtonText}>Save Changes</Text>
              </TouchableOpacity> */}
          </View>
      </Modal>


      {/* Modal for editing item */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add / Edit Item</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={selectedItem?.name}
            onChangeText={(text) => setSelectedItem({ ...selectedItem, name: text })}
            placeholder="Enter item name"
          />

          <Text style={styles.label}>Quantity</Text>
          <View style={styles.quantityRow}>
            <TextInput
              style={styles.inputQuantity}
              keyboardType="numeric"
              value={selectedItem?.quantity}
              onChangeText={(text) => setSelectedItem({ ...selectedItem, quantity: text })}
              placeholder="Enter quantity"
            />
            <TouchableOpacity style={styles.unitButton} onPress={() => setShowUnitPicker(true)}>
              <Text style={styles.unitButtonText}>{selectedUnit}</Text>
            </TouchableOpacity>
          </View>

          {/* Unit Picker Modal */}
          {showUnitPicker && (
            <Modal isVisible={showUnitPicker} onBackdropPress={() => setShowUnitPicker(false)} style={styles.unitModal}>
              <View style={styles.unitModalContent}>
                {['pcs', 'lbs', 'kg', 'g', 'box', 'carton'].map((unit) => (
                  <TouchableOpacity key={unit} onPress={() => { setSelectedUnit(unit); setShowUnitPicker(false); }}>
                    <Text style={styles.unitOption}>{unit}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Modal>
          )}

          <Text style={styles.label}>Best Before Date</Text>
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              value={selectedItem?.bestBefore || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || selectedItem.bestBefore;
                setSelectedItem({ ...selectedItem, bestBefore: currentDate });
              }}
              style={styles.datePicker}
            />
          </View>

          <TouchableOpacity style={styles.doneButton} onPress={selectedItem.id ? saveChanges : addItem}>
            <Text style={styles.doneButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9ED',
    paddingHorizontal: 20,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 70,
  },

  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  dropdownText: {
    fontSize: 16,
    color: '#333',
  },

  dropdownModal: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 130,
    marginLeft: 10,
  },

  dropdown: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: 300,
    borderWidth: 1,
    borderColor: '#DDD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  
  button: {
    marginLeft: 'auto',
    padding: 5,
  },

  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#F36C21',
    marginRight: 5,
  },

  searchContainer: {
    width: '100%',
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    marginVertical: 20,
  },

  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 10,
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
    width: '100%',
  },

  emptyMessage: {
    marginTop: 20,
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },

  foodList: {
    paddingTop: 10,
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

  // foodIcon: {
  //   fontSize: 32,
  //   marginRight: 15,
  // },

  foodInfo: {
    flex: 1,
  },

  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  expiredFoodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f01e2c',
  },

  foodDate: {
    color: '#888',
  },

  expiredFoodDate: {
    color: '#ee6b6e',
  },

  foodQuantity: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F36C21',
    marginTop: 2,
  },

  modal: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 0,
    marginTop: 100,
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


  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },

  input: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
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

  unitButton: {
    backgroundColor: '#F36C21',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },

  unitButtonText: {
    color: '#FFF',
    fontSize: 16,
  },

  unitModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },

  unitOption: {
    fontSize: 18,
    paddingVertical: 10,
    textAlign: 'center',
  },

  dateButton: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },

  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },

  doneButton: {
    backgroundColor: '#F36C21',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },

  doneButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 10,
    padding: 10,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  datePickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
  },
  
  datePicker: {
    alignSelf: 'center',
  },

  addButton: {
    backgroundColor: '#F36C21',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
      color: '#FFF',
      fontSize: 16,
  },

  dropdownItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '100%', 
  },

  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  editButton: {
      backgroundColor: '#007AFF',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
  },

  deleteButton: {
      backgroundColor: '#FF3B30',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
  },

  saveButton: {
      backgroundColor: '#28A745', 
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
  },

  cancelButton: {
      backgroundColor: '#FF3B30',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
  },

  buttonText: {
      color: '#FFF',
      fontSize: 14,
      fontWeight: 'bold',
  },

  addButton: {
    backgroundColor: '#F36C21',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },

  addButtonText: {
    color: '#FFF',
    fontSize: 16,
  },

  foodImage: {
    width: 40,  
    height: 40,  
    marginRight: 10,
  },

})

export default Inventory
