import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from "expo-router";
import { Camera } from 'expo-camera';
import Modal from 'react-native-modal';

const Scan = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [scannedItem, setScannedItem] = useState({
        name: 'Organic whole milk',
        expirationDate: '2024-10-20',
        quantity: '1 carton'
    });

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            if (status === 'granted') {
                setHasPermission(true);
            } else {
                setHasPermission(false);
                Alert.alert(
                    'Permission Denied',
                    'Camera permission is required to scan barcodes. Please enable it in settings.',
                    [{ text: 'OK' }]
                );
            }
        })();
    }, []);

    const handleBarCodeScanned = ({ data }) => {
        console.log('Barcode scanned:', data);
        setScannedItem({
            name: 'Organic whole milk',
            expirationDate: '2024-10-20',
            quantity: '1 carton'
        });
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#F36C21" />
                </TouchableOpacity>
                <Text style={styles.header}>Scan</Text>
            </View>

            {hasPermission ? (
                <Camera
                    style={styles.camera}
                    onBarCodeScanned={handleBarCodeScanned}
                    ratio="16:9"
                />
            ) : (
                <View style={styles.cameraPlaceholder}>
                    <Text style={styles.placeholderText}>Camera permission is required to scan barcodes.</Text>
                </View>
            )}

            {/* Confirmation Modal */}
            <Modal
                isVisible={isModalVisible}
                onBackdropPress={closeModal}
                style={styles.modal}
            >
                <View style={styles.modalContent}>
                    <Ionicons name="checkmark-circle" size={40} color="#F36C21" style={styles.checkIcon} />
                    <Text style={styles.modalTitle}>Item added!</Text>
                    <View style={styles.modalDetails}>
                        <Text style={styles.detailLabel}>Item Name:</Text>
                        <Text style={styles.detailValue}>{scannedItem.name}</Text>

                        <Text style={styles.detailLabel}>Expiration date:</Text>
                        <Text style={styles.detailValue}>{scannedItem.expirationDate}</Text>

                        <Text style={styles.detailLabel}>Quantity:</Text>
                        <Text style={styles.detailValue}>{scannedItem.quantity}</Text>
                    </View>
                    <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                            <Text style={styles.modalButtonText}>Add another item</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => { closeModal(); router.back(); }}>
                            <Text style={styles.modalButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
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

    camera: {
        flex: 1,
        width: '100%',
    },

    cameraPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEE',
        width: '100%',
    },

    placeholderText: {
        fontSize: 16,
        color: '#888',
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
        alignItems: 'center',
    },

    checkIcon: {
        marginBottom: 10,
    },

    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#F36C21',
        marginBottom: 20,
    },

    modalDetails: {
        width: '100%',
        marginBottom: 20,
    },

    detailLabel: {
        fontSize: 16,
        color: '#888',
    },

    detailValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },

    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },

    modalButton: {
        flex: 1,
        backgroundColor: '#FFD700',
        paddingVertical: 12,
        borderRadius: 10,
        marginHorizontal: 5,
        alignItems: 'center',
    },

    modalButtonText: {
        fontSize: 16,
        color: '#333',
    },
});

export default Scan;
