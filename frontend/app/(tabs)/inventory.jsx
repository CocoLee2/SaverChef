import { StatusBar, View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, TextInput, Alert, Dimensions } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { ListItem, SearchBar } from "react-native-elements";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from "expo-router";
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';


const Inventory = () => {
  const [search, setSearch] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedFridge, setSelectedFridge] = useState('Fridge 1');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('pcs');
  const [selectedItem, setSelectedItem] = useState({ id: '', name: '', quantity: '', unit: 'pcs', bestBefore: new Date() });
  const scrollViewRef = useRef(null);
  const [fridges, setFridges] = useState(['Fridge 1', 'Fridge 2', 'Fridge 3']);
  const [newFridgeName, setNewFridgeName] = useState('');
  const [isEditingFridge, setIsEditingFridge] = useState(false);
  const [editingFridgeIndex, setEditingFridgeIndex] = useState(null);
  const [editedFridgeName, setEditedFridgeName] = useState('');




  const [itemsByFridge, setItemsByFridge] = useState({
    'Fridge 1': [
      { id: '1', name: 'Tomatoes', quantity: '3', unit: 'pcs', icon: '🍅', bestBefore: new Date(2024, 10, 28) },
      { id: '2', name: 'Potatoes', quantity: '5', unit: 'pcs', icon: '🥔', bestBefore: new Date(2024, 11, 15) },
    ],
    'Fridge 2': [
      { id: '3', name: 'Cabbage', quantity: '2', unit: 'pcs', icon: '🥬', bestBefore: new Date(2024, 11, 4) },
    ],
    'Fridge 3': [],
  });

  useEffect(() => {
    if (!itemsByFridge[selectedFridge]) {
        const defaultFridge = Object.keys(itemsByFridge)[0];
        if (defaultFridge) {
            setSelectedFridge(defaultFridge);
        }
    }
  }, [selectedFridge, itemsByFridge]);

  const addNewFridge = () => {
    if (newFridgeName.trim()) {
        setFridges([...fridges, newFridgeName.trim()]);
        setItemsByFridge((prevItemsByFridge) => ({
            ...prevItemsByFridge,
            [newFridgeName.trim()]: [],
        }));
        setNewFridgeName('');
        setSelectedFridge(newFridgeName.trim());
        setDropdownVisible(false);
    } else {
        Alert.alert("Invalid Name", "Please enter a valid fridge name.");
    }
};

  const editFridgeName = () => {
    if (editedFridgeName.trim()) {
        setFridges(fridges.map((fridge) => (fridge === selectedFridge ? editedFridgeName.trim() : fridge)));
        setItemsByFridge((prevItemsByFridge) => {
            const updatedItems = { ...prevItemsByFridge };
            updatedItems[editedFridgeName.trim()] = updatedItems[selectedFridge];
            delete updatedItems[selectedFridge];
            return updatedItems;
        });
        setSelectedFridge(editedFridgeName.trim());
        setIsEditingFridge(false);
    } else {
        Alert.alert("Invalid Name", "Please enter a valid fridge name.");
    }
  };

  // Start editing a specific fridge name
  const startEditingFridge = (index) => {
    setEditingFridgeIndex(index);
    setEditedFridgeName(fridges[index]);
    setIsEditingFridge(true);
  };

  // Save the edited fridge name
  const saveEditedFridgeName = () => {
    if (editedFridgeName.trim()) {
        const updatedFridges = [...fridges];
        const oldFridgeName = updatedFridges[editingFridgeIndex];
        updatedFridges[editingFridgeIndex] = editedFridgeName.trim();
        
        setFridges(updatedFridges);

        // Update itemsByFridge to match the new fridge name
        setItemsByFridge((prevItemsByFridge) => {
            const updatedItems = { ...prevItemsByFridge };
            updatedItems[editedFridgeName.trim()] = updatedItems[oldFridgeName];
            delete updatedItems[oldFridgeName];
            return updatedItems;
        });

        // Update the selected fridge if it was being edited
        if (selectedFridge === oldFridgeName) {
            setSelectedFridge(editedFridgeName.trim());
        }

        setIsEditingFridge(false);
        setEditingFridgeIndex(null);
      } else {
          Alert.alert("Invalid Name", "Please enter a valid fridge name.");
      }
    };

    // Cancel editing the fridge name
    const cancelEditFridgeName = () => {
      setIsEditingFridge(false);
      setEditingFridgeIndex(null);
      setEditedFridgeName('');
    };

    const deleteFridge = (index) => {
      const fridgeToDelete = fridges[index];
      
      Alert.alert(
          'Delete Fridge',
          `Are you sure you want to delete ${fridgeToDelete}?`,
          [
              { text: 'Cancel', style: 'cancel' },
              {
                  text: 'Delete', style: 'destructive', onPress: () => {
                      setFridges(fridges.filter((_, i) => i !== index));
                      setItemsByFridge((prevItemsByFridge) => {
                          const updatedItems = { ...prevItemsByFridge };
                          delete updatedItems[fridgeToDelete];
                          return updatedItems;
                      });
                      if (selectedFridge === fridgeToDelete) {
                          setSelectedFridge(fridges[0] || ''); // Select another fridge if possible
                      }
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
    setItemsByFridge((prevItemsByFridge) => ({
      ...prevItemsByFridge,
      [selectedFridge]: prevItemsByFridge[selectedFridge].map((item) =>
        item.id === selectedItem.id ? { ...selectedItem, unit: selectedUnit } : item
      ),
    }));
    setModalVisible(false);
  };

  const addItem = () => {
    const newItem = { ...selectedItem, id: Date.now().toString(), unit: selectedUnit };
    setItemsByFridge((prevItemsByFridge) => ({
      ...prevItemsByFridge,
      [selectedFridge]: [...prevItemsByFridge[selectedFridge], newItem],
    }));
    setModalVisible(false);
  };

  const deleteItem = (itemId) => {
    setItemsByFridge((prevItemsByFridge) => ({
      ...prevItemsByFridge,
      [selectedFridge]: prevItemsByFridge[selectedFridge].filter((item) => item.id !== itemId),
    }));
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

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openEditModal(item)} onLongPress={() => handleLongPress(item.id)} style={styles.foodItem}>
      <Text style={styles.foodIcon}>{item.icon || '🛒'}</Text>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodDate}>Best before {item.bestBefore.toDateString()}</Text>
      </View>
      <Text>{`${item.quantity} ${item.unit}`}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownTrigger}>
          <Text style={styles.header}>{selectedFridge}</Text>
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

      {itemsByFridge[selectedFridge] && itemsByFridge[selectedFridge].length > 0 ? (
          <FlatList
            data={itemsByFridge[selectedFridge]}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
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
            {fridges.map((fridge, index) => (
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
                            <Text style={styles.dropdownText}>{fridge}</Text>
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
                            <TouchableOpacity style={styles.editButton} onPress={() => startEditingFridge(index)}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
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
              <TouchableOpacity style={styles.doneButton} onPress={editFridgeName}>
                  <Text style={styles.doneButtonText}>Save Changes</Text>
              </TouchableOpacity>
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

  foodIcon: {
    fontSize: 32,
    marginRight: 15,
  },

  foodInfo: {
    flex: 1,
  },

  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
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

})

export default Inventory
