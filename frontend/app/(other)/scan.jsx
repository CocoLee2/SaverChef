import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from "expo-router";
import { RNCamera } from 'react-native-camera';
import Modal from 'react-native-modal';

const Scan = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [scannedItem, setScannedItem] = useState({
        name: 'Organic whole milk',
        expirationDate: '2024-10-20',
        quantity: '1 carton'
    });

    const handleBarCodeScanned = ({ data }) => {
        // Handle barcode data here and fetch product details if necessary
        console.log('Barcode scanned:', data);
        // Simulate setting the scanned item details
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

            <RNCamera
                style={styles.camera}
                onBarCodeRead={handleBarCodeScanned}
                captureAudio={false}
            />

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
