import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddManually = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [bestBefore, setBestBefore] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  const unitOptions = ['pcs', 'lbs', 'kg', 'g', 'oz'];

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBestBefore(selectedDate);
    }
  };

  const handleConfirm = () => {
    router.push({
      pathname: '/inventory',
      params: {
        name,
        quantity,
        unit,
        bestBefore: bestBefore.toISOString().split('T')[0],
      },
    });
  };

  const openUnitPicker = () => setShowUnitPicker(true);
  const closeUnitPicker = () => setShowUnitPicker(false);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Add New Item</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Item Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Apples"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantity</Text>
            <View style={styles.quantityRow}>
              <TextInput
                style={styles.quantityInput}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
                placeholder="e.g., 3"
              />
              <TouchableOpacity style={styles.unitButton} onPress={openUnitPicker}>
                <Text style={styles.unitButtonText}>{unit}</Text>
              </TouchableOpacity>
            </View>

            {/* Unit Selection Modal */}
            <Modal
              visible={showUnitPicker}
              transparent={true}
              animationType="fade"
              onRequestClose={closeUnitPicker}
            >
              <TouchableWithoutFeedback onPress={closeUnitPicker}>
                <View style={styles.modalOverlay}>
                  <View style={styles.unitModal}>
                    {unitOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.unitOption}
                        onPress={() => {
                          setUnit(option);
                          closeUnitPicker();
                        }}
                      >
                        <Text style={styles.unitOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Best Before Date</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateButtonText}>
                {bestBefore ? bestBefore.toDateString() : 'Select Date'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={bestBefore || new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={() => router.back()}>
            <Text style={styles.confirmButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF9ED',
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F36C21',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityInput: {
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    flex: 1,
    marginRight: 10,
  },
  unitButton: {
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  unitButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dateButton: {
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#F36C21',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitModal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 200,
  },
  unitOption: {
    paddingVertical: 10,
  },
  unitOptionText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default AddManually;
