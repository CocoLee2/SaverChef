import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState, useContext } from "react";
import {
  AppState,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { GlobalContext } from "../GlobalContext";
import { router } from "expo-router";

/**
 * 
 * TODO: make sure to implement addFridge (blocked because the fridge information is stored in inventory.jsx, but should be global)
 * 
 * 
 * 
 * 
 */

export default function camera() {
    const { userId, setUserId, username, setUsername, email, setEmail, password, setPassword, 
        fridgeItems, setFridgeItems, favoriteRecipes, setFavoriteRecipes, randomRecipes, setRandomRecipes } = useContext(GlobalContext);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState("nothing scanned"); //barcode from scanned
  const [selectedItem, setSelectedItem] = useState({
    id: "",
    name: "",
    quantity: "",
    unit: "pcs",
    bestBefore: new Date(),
  });
  const [selectedUnit, setSelectedUnit] = useState("pcs");
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const addItem = () => {
    const newItem = {
      ...selectedItem,
      id: Date.now().toString(),
      unit: selectedUnit,
    };
    const foodItem = {
        id: Date.now(),
        itemName: selectedItem.name,
        expirationDate: selectedItem.bestBefore,
        quantity: Number(selectedItem.quantity),
        quantifier: selectedItem.unit
    }

    setFridgeItems((prevFridgeItems) =>
        prevFridgeItems.map((fridge) =>
          fridge.fridgeId === 1 // hardcoded right now to add to fridge 1
            ? {
                ...fridge,
                fridgeItems: [...fridge.fridgeItems, foodItem],
              }
            : fridge
        )
      );
    
    setModalVisible(false);
    router.push("/inventory")
  };


//test



  const handleCodeScan = ({ type, data }) => {
    setScanned(true);
    setModalVisible(true);
    setText(data);
    getBarcodeInfo(data);
    
  };

  const handleNotFound = () =>{
    alert("Couldn't find food with barcode. Please enter manually.")
  }

  const getBarcodeInfo = async (text) => {
    try {
      const response = await fetch('https://trackapi.nutritionix.com/v2/search/item/?upc=' + text, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': '578e0517',
          'x-app-key': '70d98d604caa0d1679183563f7bfb7b1',
        },
      });
  
      // Check for HTTP errors
      if (!response.ok) {
        // console.log(response)
        handleNotFound();
        return
      }
  
      const data = await response.json();
      console.log(data); // Use or return the data as needed
    
      setSelectedItem({ ...selectedItem, name: data.foods[0].food_name })


      return data;
    } catch (error) {
      console.error('Error fetching barcode info:', error);
      throw error; // Optionally re-throw the error
    }
  };
  
    



  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={"back"}
        onBarcodeScanned={scanned ? undefined : handleCodeScan}
        barcodeScannerSettings={{
          barcodeTypes: ["upc_e", "upc_a"],
        }}
      ></CameraView>

      {/* Modal for editing item */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => {
          setModalVisible(false);
          setScanned(false);
        }}
        style={styles2.modal}
      >
        <View style={styles2.modalContent}>
          <Text style={styles2.modalTitle}>Add / Edit Item</Text>

          <Text style={styles2.label}>Name</Text>
          <TextInput
            style={styles2.input}
            value={selectedItem?.name}
            onChangeText={(text) =>
              setSelectedItem({ ...selectedItem, name: text })
            }
            placeholder="Enter item name"
          />

          <Text style={styles2.label}>Quantity</Text>
          <View style={styles2.quantityRow}>
            <TextInput
              style={styles2.inputQuantity}
              keyboardType="numeric"
              value={selectedItem?.quantity}
              onChangeText={(text) =>
                setSelectedItem({ ...selectedItem, quantity: text })
              }
              placeholder="Enter quantity"
            />
            <TouchableOpacity
              style={styles2.unitButton}
              onPress={() => setShowUnitPicker(true)}
            >
              <Text style={styles2.unitButtonText}>{selectedUnit}</Text>
            </TouchableOpacity>
          </View>

          {/* Unit Picker Modal */}
          {showUnitPicker && (
            <Modal
              isVisible={showUnitPicker}
              onBackdropPress={() => setShowUnitPicker(false)}
              style={styles2.unitModal}
            >
              <View style={styles2.unitModalContent}>
                {["pcs", "lbs", "kg", "g", "box", "carton"].map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    onPress={() => {
                      setSelectedUnit(unit);
                      setShowUnitPicker(false);
                    }}
                  >
                    <Text style={styles2.unitOption}>{unit}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Modal>
          )}

          <Text style={styles2.label}>Best Before Date</Text>
          <View style={styles2.datePickerContainer}>
            <DateTimePicker
              value={selectedItem?.bestBefore || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || selectedItem.bestBefore;
                setSelectedItem({ ...selectedItem, bestBefore: currentDate });
              }}
              style={styles2.datePicker}
            />
          </View>

          <TouchableOpacity
            style={styles2.doneButton}
            onPress={selectedItem.id ? saveChanges : addItem}
          >
            <Text style={styles2.doneButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      
    </View>
  );
}

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEF9ED",
    paddingHorizontal: 20,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 70,
  },

  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  dropdownText: {
    fontSize: 16,
    color: "#333",
  },

  dropdownModal: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: 130,
    marginLeft: 10,
  },

  dropdown: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    width: 300,
    borderWidth: 1,
    borderColor: "#DDD",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  button: {
    marginLeft: "auto",
    padding: 5,
  },

  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#F36C21",
    marginRight: 5,
  },

  searchContainer: {
    width: "100%",
    borderTopWidth: 0,
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    marginVertical: 20,
  },

  searchInput: {
    backgroundColor: "#FFF",
    borderRadius: 10,
  },

  buttonContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
    alignItems: "center",
  },

  menu: {
    position: "absolute",
    bottom: 100,
    right: 30,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  menuItemText: {
    marginLeft: 10,
    fontSize: 16,
  },

  list: {
    width: "100%",
  },

  emptyMessage: {
    marginTop: 20,
    fontSize: 18,
    color: "#888",
    textAlign: "center",
  },

  foodList: {
    paddingTop: 10,
  },

  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#FFF",
    marginBottom: 10,
    shadowColor: "#000",
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
    fontWeight: "bold",
    color: "#333",
  },

  foodDate: {
    color: "#888",
  },

  foodQuantity: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F36C21",
    marginTop: 2,
  },

  modal: {
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 0,
    marginTop: 100,
  },

  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    alignSelf: "center",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  doneButton: {
    backgroundColor: "#F36C21",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },

  doneButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },

  input: {
    backgroundColor: "#F0F0F0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  inputQuantity: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },

  unitButton: {
    backgroundColor: "#F36C21",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },

  unitButtonText: {
    color: "#FFF",
    fontSize: 16,
  },

  unitModalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },

  unitOption: {
    fontSize: 18,
    paddingVertical: 10,
    textAlign: "center",
  },

  dateButton: {
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },

  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },

  doneButton: {
    backgroundColor: "#F36C21",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  doneButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderRadius: 10,
    padding: 10,
  },
  deleteButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  datePickerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: 10,
  },

  datePicker: {
    alignSelf: "center",
  },

  addButton: {
    backgroundColor: "#F36C21",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
  },

  dropdownItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: "100%",
  },

  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  editButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  saveButton: {
    backgroundColor: "#28A745",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },

  addButton: {
    backgroundColor: "#F36C21",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },

  addButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    alignSelf: "center",
  },
});
