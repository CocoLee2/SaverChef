import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { AppState, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function camera() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('nothing scanned')


  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleCodeScan = ({ type, data }) => {
    // Call barcode API here
    /*
https://api.spoonacular.com/food/products/upc/{upc}?apiKey=bda660473059477187cbce1b4adde3b5
https://api.spoonacular.com/food/products/upc/096619756803?apiKey=bda660473059477187cbce1b4adde3b5
https://api.spoonacular.com/recipes/716429/information?apiKey=YOUR-API-KEY&includeNutrition=true.
https://api.spoonacular.com/food/products/upc/012546011075?apiKey=bda660473059477187cbce1b4adde3b5
https://api.spoonacular.com/food/products/415655?apiKey=bda660473059477187cbce1b4adde3b5

    */
    setScanned(true);
    setText(data)


  };
  
  


  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} onBarcodeScanned={scanned ? undefined : handleCodeScan}
      barcodeScannerSettings={{
        barcodeTypes: ["upc_e", "upc_a"],
      }}>
        <View style={styles.buttonContainer}>
        {scanned && <Button title={'Scan again?'} onPress={() => setScanned(false)} color='tomato' />}
            <Text style={styles.text}>{text}</Text>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
