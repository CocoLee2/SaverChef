import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Platform } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { router } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';

const AddManually = () => {
  const [search, setSearch] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('pcs');
  const [foodItems, setFoodItems] = useState([
    { id: '1', name: 'Tomatoes', quantity: '3', unit: 'pcs', icon: '🍅', bestBefore: new Date(2024, 10, 28) },
    { id: '2', name: 'Potatoes', quantity: '5', unit: 'pcs', icon: '🥔', bestBefore: new Date(2024, 11, 15) },
    { id: '3', name: 'Cabbage', quantity: '2', unit: 'pcs', icon: '🥬', bestBefore: new Date(2024, 11, 4) },
  ]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

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
    if (selectedItem) {
      setFoodItems((prevItems) =>
        prevItems.map((item) =>
          item.id === selectedItem.id ? { ...selectedItem, unit: selectedUnit } : item
        )
      );
    }
    setModalVisible(false);
  };

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity onPress={() => openEditModal(item)} style={styles.foodItem}>
      <Text style={styles.foodIcon}>{item.icon}</Text>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodDate}>Best before {item.bestBefore.toDateString()}</Text>
      </View>
      <Text style={styles.foodQuantity}>{item.quantity} {item.unit}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F36C21" />
        </TouchableOpacity>
        <Text style={styles.header}>Your food</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => { setSelectedItem({ id: '', name: '', quantity: '', unit: 'pcs', bestBefore: new Date() }); toggleModal(); }}>
          <Ionicons name="add-circle-outline" size={30} color="#F36C21" />
        </TouchableOpacity>
      </View>

      <SearchBar
        placeholder="Type your ingredients"
        onChangeText={setSearch}
        value={search}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInput}
      />

      <FlatList
        data={foodItems}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.foodList}
      />

      {/* Modal for adding/editing food item */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedItem?.id ? "Edit Food" : "Add Food"}</Text>
            <TouchableOpacity onPress={toggleModal}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Editable Name Field */}
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={selectedItem?.name}
            onChangeText={(text) => setSelectedItem({ ...selectedItem, name: text })}
            placeholder="Enter item name"
          />

          {/* Editable Quantity Field with Unit Picker */}
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

          {/* Best Before Date with Date Picker */}
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
    marginBottom: 10,
  },

  backButton: {
    marginRight: 10,
  },

  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#F36C21',
    flex: 1,
  },

  addButton: {
    marginLeft: 'auto',
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
});

export default AddManually;
