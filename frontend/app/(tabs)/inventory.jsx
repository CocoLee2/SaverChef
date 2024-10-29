import { StatusBar, View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native'
import React, {useState} from 'react'
import { ListItem, SearchBar } from "react-native-elements";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from "expo-router";
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const Inventory = () => {
  const [search, setSearch] = useState('');
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedFridge, setSelectedFridge] = useState('Fridge 1');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('pcs');
  const [selectedItem, setSelectedItem] = useState(null);
  const fridges = ['Fridge 1', 'Fridge 2', 'Fridge 3'];

  const [items, setItems] = useState([
    { id: '1', name: 'Tomatoes', quantity: '3', unit: 'pcs', icon: '🍅', bestBefore: new Date(2024, 10, 28) },
    { id: '2', name: 'Potatoes', quantity: '5', unit: 'pcs', icon: '🥔', bestBefore: new Date(2024, 11, 15) },
    { id: '3', name: 'Cabbage', quantity: '2', unit: 'pcs', icon: '🥬', bestBefore: new Date(2024, 11, 4) },
  ]);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);

  const openEditModal = (item) => {
    setSelectedItem(item);
    setSelectedUnit(item.unit || 'pcs');
    setModalVisible(true);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedItem.bestBefore;
    setShowDatePicker(false);
    setSelectedItem({ ...selectedItem, bestBefore: currentDate });
  };

  const saveChanges = () => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === selectedItem.id ? { ...selectedItem, unit: selectedUnit } : item
      )
    );
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openEditModal(item)} style={styles.foodItem}>
      <Text style={styles.foodIcon}>{item.icon}</Text>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodDate}>Best before {item.bestBefore.toDateString()}</Text>
      </View>
      <Text>{`${item.quantity} ${item.unit}`}</Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"  
      />

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownTrigger}>
          <Text style={styles.header}>{selectedFridge}</Text>
          <Ionicons name="caret-down-outline" size={20} color="#F36C21" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={toggleMenu}>
          <MaterialIcons name={isMenuOpen ? "close" : "add"} size={30} color="white" />
        </TouchableOpacity>
      </View>

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

      {/* Dropdown Modal */}
      <Modal
        isVisible={isDropdownVisible}
        onBackdropPress={toggleDropdown}
        backdropOpacity={0.3}
        style={styles.dropdownModal} // Apply dropdownModal style here
      >
        <View style={styles.dropdown}>
          {fridges.map((fridge, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedFridge(fridge);
                setDropdownVisible(false);
              }}
            >
              <Text style={styles.dropdownText}>{fridge}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>


      {isMenuOpen && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push({pathname: '../(other)/addManually'})}>
            <MaterialIcons name="edit" size={24} color="black" />
            <Text style={styles.menuItemText}>Add Manually</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push({pathname: '../(other)/scan'})}>
            <MaterialIcons name="qr-code-scanner" size={24} color="black" />
            <Text style={styles.menuItemText}>Scan Barcode</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push({pathname: '../(other)/share'})}>
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleMenu}>
          <MaterialIcons name={isMenuOpen ? 'close' : 'add'} size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal for editing item */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Item</Text>

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
            <Modal
              isVisible={showUnitPicker}
              onBackdropPress={() => setShowUnitPicker(false)}
              style={styles.unitModal}
            >
              <View style={styles.unitModalContent}>
                {['pcs', 'lbs', 'kg', 'g'].map((unit) => (
                  <TouchableOpacity key={unit} onPress={() => { setSelectedUnit(unit); setShowUnitPicker(false); }}>
                    <Text style={styles.unitOption}>{unit}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Modal>
          )}

          <Text style={styles.label}>Best Before Date</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateButtonText}>
              {selectedItem?.bestBefore ? selectedItem.bestBefore.toDateString() : 'Select Date'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedItem?.bestBefore || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <TouchableOpacity style={styles.doneButton} onPress={saveChanges}>
            <Text style={styles.doneButtonText}>Done</Text>
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
    width: 150,
    borderWidth: 1,
    borderColor: '#DDD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
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
    justifyContent: 'flex-end',
    margin: 0,
  },

  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },

  input: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
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
})

export default Inventory
