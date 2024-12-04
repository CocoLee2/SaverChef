import { StatusBar, View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, TextInput, Alert, Dimensions, Image} from 'react-native'
import { React, useState, useEffect, useRef, useContext } from 'react'
import { SearchBar } from 'react-native-elements';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from "expo-router";
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import images from '../../constants/images';
import { GlobalContext } from "../GlobalContext";
import { format } from 'date-fns';
import CustomButton from '../../components/CustomButton';


const Inventory = () => {
  const [search2, setSearch2] = useState('');

  const { userId, setUserId, username, setUsername, email, setEmail, password, setPassword, 
    fridgeItems, setFridgeItems, favoriteRecipes, setFavoriteRecipes, randomRecipes, setRandomRecipes } = useContext(GlobalContext);
  const [selectedFridge, setSelectedFridge] = useState(fridgeItems.length > 0 ? fridgeItems[0].fridgeId : null);
  const [fridgeIds, setFridgeIds] = useState([]); // Initialize as an empty array
  useEffect(() => {
    if (Array.isArray(fridgeItems)) {
      const ids = fridgeItems.map(fridge => fridge.fridgeId);
      setFridgeIds(ids); // Update fridgeIds whenever fridgeItems changes
    }
  }, [fridgeItems]); // Dependency array ensures this runs whenever fridgeItems changes

  const selectedFridgeObj = fridgeItems.find(fridge => fridge.fridgeId === selectedFridge);
  const getFridgeNameById = (id) => {
    const fridge = fridgeItems.find((fridge) => fridge.fridgeId === id);
    // only show the first 10 letters of a fridge name
    return fridge ? fridge.fridgeName.slice(0, 10) : "No Fridge Selected";
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('pcs');
  const [selectedItem, setSelectedItem] = useState({ id: '', name: '', quantity: '', unit: 'pcs', bestBefore: new Date()});
  const scrollViewRef = useRef(null);
  const [newFridgeName, setNewFridgeName] = useState('');
  const [isEditingFridge, setIsEditingFridge] = useState(false);
  const [editingFridgeIndex, setEditingFridgeIndex] = useState(null);
  const [editedFridgeName, setEditedFridgeName] = useState('');

  const filteredFridgeItems = selectedFridgeObj ? selectedFridgeObj.fridgeItems.filter(item => 
    item.name.toLowerCase().includes(search2.toLowerCase())
  ) : [];

 
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
 

  useEffect(() => {
    const selectedFridgeExists = fridgeItems.some(fridge => fridge.fridgeId === selectedFridge);

    if (!selectedFridgeExists) {
      const defaultFridgeId = fridgeItems.length > 0 ? fridgeItems[0].fridgeId : null;
      if (defaultFridgeId) {
        setSelectedFridge(defaultFridgeId);
      }
    }
  }, [selectedFridge, fridgeItems]);


  const addNewFridge = async() => {
    // checks if the input fridge name is valid
    if (newFridgeName.trim()) {
      try {
        const response = await fetch('http://127.0.0.1:5001/fridge/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            creator_id: userId,  
            fridge_name: newFridgeName.trim(),
          }),
        });
  
        const data = await response.json();
        console.log(data);
  
        if (response.ok) {
          const newFridgeId = data["fridgeId"];
          const newFridge = {
            fridgeId: newFridgeId,
            fridgeName: newFridgeName.trim(),
            fridgeItems: [], 
            fridgePasscode: data["fridgePasscode"]
          };
          setFridgeIds((fridgeIds) => [...fridgeIds, newFridgeId]);
          setFridgeItems((prevFridgeItems) => [...prevFridgeItems, newFridge]);
          setNewFridgeName('');
          setSelectedFridge(newFridgeId);
          setDropdownVisible(false);
        } else {
          Alert.alert('Error', data.message || 'Request failed. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Network Error', 'Something went wrong. Please try again later.');
      }
    } else {
      Alert.alert("Invalid Name", "Please enter a valid fridge name.");
    }
  };


  const editFridgeName = async () => {
    const fridgeToEdit = fridgeIds[editingFridgeIndex];
  
    if (!editedFridgeName.trim()) {
      Alert.alert("Invalid Name", "Please enter a valid fridge name.");
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:5001/fridge/edit_name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fridge_id: fridgeToEdit,
          name: editedFridgeName.trim(),
          userId: userId,
        }),
      });
  
      const data = await response.json();

      setEditedFridgeName('');
      setIsEditingFridge(false);
      setEditingFridgeIndex(null);

      if (response.ok) {
        setFridgeItems((prevItemsByFridge) =>
          prevItemsByFridge.map((fridge) =>
            fridge.fridgeId === fridgeToEdit
              ? { ...fridge, fridgeName: editedFridgeName.trim() }
              : fridge
          )
        );
  
        Alert.alert('Success', 'Fridge name updated successfully.');
      } else if (response.status === 400) {
        Alert.alert('Error', `Fridge does not exist.`);
      } else if (response.status === 403) {
        Alert.alert(
          'Permission Denied',
          `You do not have permission to edit this fridge's name.`
        );
      } else {
        Alert.alert('Error', data.message || 'Request failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Network Error', 'Something went wrong. Please try again later.');
    }
  };
  

  // Start editing a specific fridge name
  const startEditingFridge = (index) => {
    setEditingFridgeIndex(index);
    // setEditedFridgeName(fridgeIds[index]);
    setIsEditingFridge(true);
  };

  const deleteFridge = async (index) => {
    const fridgeToDelete = fridgeItems[index];
  
    Alert.alert(
      'Delete Fridge',
      `Are you sure you want to delete ${fridgeToDelete.fridgeName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteFridge(fridgeToDelete.fridgeId, fridgeToDelete.fridgeName),
        },
      ]
    );
  };

  const handleNewButtonPress = async () => {
    let ingredients = search2.split(",").map(item => item.trim());
    const validIngredientRegex = /^[a-zA-Z\s]+$/;
    // do some simple checks on the input strings
    ingredients = ingredients.filter(item => validIngredientRegex.test(item));
    fetchRecipes(ingredients)
  }
    
  const handleDeleteFridge = async (deleteId, deleteName) => {
    try {
      const response = await fetch('http://127.0.0.1:5001/fridge/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          fridge_id: deleteId,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Update the selected fridge if the deleted fridge was the selected one
        if (selectedFridge === deleteId) {
          const remainingFridgeIds = fridgeIds.filter(id => id !== deleteId);
          const newSelectedFridge = remainingFridgeIds.length > 0 ? remainingFridgeIds[0] : null;
          setSelectedFridge(newSelectedFridge);
        }
  
        // Remove the fridge from fridgeIds and fridgeItems array
        setFridgeIds((prevFridgeIds) =>
          prevFridgeIds.filter(id => id !== deleteId)
        );
        setFridgeItems((prevFridgeItems) =>
          prevFridgeItems.filter(fridge => fridge.fridgeId !== deleteId)
        );
      } else if (response.status === 400) {
        Alert.alert('Error', `${deleteName} does not exist.`);
      } else if (response.status === 403) {
        Alert.alert(
          'Permission Denied',
          `You do not have permission to delete ${deleteName}.`
        );
      } else {
        Alert.alert('Error', data.message || 'Request failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Network Error', 'Something went wrong. Please try again later.');
    }
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

  const saveChanges = async() => {
    if (!selectedFridge) {
      Alert.alert('No Fridge Selected', 'Please create a fridge before proceeding.');
      return
    }
    // check if all information is valid
    if (selectedItem.name === "" || selectedItem.quantity === ""){
      Alert.alert('Incomplete Information', 'Please enter both the item name and quantity before proceeding.');
      return
    }
    if (selectedItem.quantity <= 0){
      Alert.alert('Invalid Information', 'Please make sure that quantity is positive.');
      return
    }    

    try {
      const response = await fetch('http://127.0.0.1:5001/fridge_item/update_item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: selectedItem.id,
          itemName: selectedItem.name,
          expirationDate: format(selectedItem.bestBefore, 'yyyy-MM-dd'), 
          quantity: selectedItem.quantity, 
          quantifier: selectedUnit,
        }),
      });

      const data = await response.json();

      if (response.ok) {
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
      } else {
        Alert.alert('Error', data.message || 'Request failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Network Error', 'Something went wrong. Please try again later.');
    }
  };
  

  const addItem = async() => {
    if (!selectedFridge) {
      Alert.alert('No Fridge Selected', 'Please create a fridge before proceeding.');
      return
    }
    // check if all information is valid
    if (selectedItem.name === "" || selectedItem.quantity === ""){
      Alert.alert('Incomplete Information', 'Please enter both the item name and quantity before proceeding.');
      return
    }
    if (selectedItem.quantity <= 0){
      Alert.alert('Invalid Information', 'Please make sure that quantity is positive.');
      return
    }    

    try {
      const response = await fetch('http://127.0.0.1:5001/fridge_item/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fridge_id: selectedFridge,  
          itemName: selectedItem.name,
          expirationDate: format(selectedItem.bestBefore, 'yyyy-MM-dd'), 
          quantity: selectedItem.quantity, 
          quantifier: selectedUnit,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const newItem = { ...selectedItem, id: data["itemId"], unit: selectedUnit };
        setFridgeItems((prevItemsByFridge) =>
          prevItemsByFridge.map((fridge) =>
            fridge.fridgeId === selectedFridge
              ? { ...fridge, fridgeItems: [...fridge.fridgeItems, newItem] }
              : fridge
          )
        );
        setModalVisible(false);
      } else {
        Alert.alert('Error', data.message || 'Request failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Network Error', 'Something went wrong. Please try again later.');
    }
  };
  

  const deleteItem = async(itemId) => {
    try {
      const response = await fetch('http://127.0.0.1:5001/fridge_item/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: itemId,  
        }),
      });

      const data = await response.json();

      if (response.ok) {
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
      } else {
        Alert.alert('Error', data.message || 'Request failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Network Error', 'Something went wrong. Please try again later.');
    }
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
        router.push('./inventory')
      } else {
        Alert.alert('Error', data.message || 'Request failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Network Error', 'Something went wrong. Please try again later.');
    }
  }
  

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

        <TouchableOpacity style={styles.button} onPress={refresh}>
          <MaterialIcons name="refresh" size={30} color="#F36C21" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => { setSelectedItem({ id: '', name: '', quantity: '', unit: 'pcs', bestBefore: new Date() }); toggleModal(); }}>
          <Ionicons name="add-circle-outline" size={30} color="#F36C21" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() =>
          router.push({
            pathname: '../(other)/scan',
            params: { fridgeId: selectedFridge }, // Pass the fridgeId dynamically
          })
        }>
          <MaterialIcons name="qr-code-scanner" size={30} color="#F36C21" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() =>
          router.push({
            pathname: '../(other)/share',
            params: { passcode: selectedFridgeObj ? selectedFridgeObj["fridgePasscode"] : "no selected fridge"}, 
          })
        }>
        <MaterialIcons name="share" size={30} color="#F36C21" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRowContainer}>
        <SearchBar
          placeholder="Type your ingredients"
          onChangeText={(text) => setSearch2(text)}
          value={search2}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInput}
          inputStyle={styles.searchText}
        />

        <CustomButton
          title="Search"
          handlePress={handleNewButtonPress}
          containerStyles={styles.newButtonContainer} 
          textStyles={styles.newButtonText}
        />
      </View>


      {selectedFridgeObj && selectedFridgeObj.fridgeItems.length > 0 ? (
        <FlatList
          data={filteredFridgeItems}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          renderItem={({ item }) => (
            renderItem(item, item.bestBefore < new Date(new Date().setDate(new Date().getDate() - 1)))
          )}
          ListEmptyComponent={<Text style={styles.emptyMessage}>No ingredients found</Text>}
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

                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.editButton} onPress={() => startEditingFridge(index)}>
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteFridge(index)}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity> 
                    </View>
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

  searchRowContainer: {
    flexDirection: 'row', // Arrange items in a row
    alignItems: 'center', // Center items vertically
    marginTop: 10, // Add top margin if needed
  },

  searchContainer: {
    flex: 7, // Use 80% of the space
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    height: 60, // Set a uniform height
  },

  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    height: 40, // Set the same height for the input
  },

  searchText: {
    fontSize: 14, 
  },

  newButtonContainer: {
    flex: 2, 
    marginLeft: 5, 
    minHeight: 40, 
    borderRadius: 10,
    justifyContent: 'center',
    backgroundColor: '#FFA500',
  }, 

  newButtonText: {
    color: '#FFFFFF', 
    fontWeight: '600', 
    fontSize: 14, 
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
