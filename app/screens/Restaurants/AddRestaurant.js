import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';
import AddRestaurantForm from '../../components/Restaurants/AddRestaurantForm';

export default function AddRestaurant(props) {
    const { navigation } = props; // Recibimos la navegacion de RestaurantsStacks
    const [isLoading, setIsLoading] = useState(false); // Para cargar nuestro loadin
    const toastRef = useRef(); //Referencia del Toast
    
    return (
    <View> 
        <AddRestaurantForm
        toastRef = {toastRef}
        setIsLoading = {setIsLoading}
        navigation = {navigation}
        />

        <Toast ref = {toastRef} position="center" opacity={0.9} />
        <Loading isVisible = {isLoading} text = "Creando Restaurante" />
   </View>
  );
}


