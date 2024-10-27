import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function camera() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
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

// import { router } from 'expo-router';
// import React, {useState, useEffect, useRef} from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import { Camera } from 'expo-camera';

// export default function camera(){
//     let cameraRef = useRef();
//     const [hasCameraPermissions, setHasCameraPermissions] = useState(null);

//     useEffect(() => {
//         (async () => {
//             const cameraPermission = await Camera.requestCameraPermissionsAsync();

//             setHasCameraPermissions(cameraPermission.status === "granted");
//         })();
//     },[]);

//     if (hasCameraPermissions === undefined){
//         return <Text>waiting for camera  permission...</Text>
//     }else if (!hasCameraPermissions) {
//         return <Text>Permission for camera not granted. Please chnge in settings</Text>
//     }
//         // at this point, can add camera permissions



//     return(<Camera style={styles.container} ref={cameraRef}></Camera>
        
//     )
    
// }
// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     buttonContainer: {
//       backgroundColor: '#fff',
//       alignSelf: 'flex-end'
//     },
//     preview: {
//       alignSelf: 'stretch',
//       flex: 1
//     }
//   });