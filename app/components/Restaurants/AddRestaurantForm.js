import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, Dimensions } from 'react-native';
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements';

export default function AddRestaurantForm(props){
    const {toastRef, setIsLoading, navigation} = props; // recuperamos nuestro toast por medio de props
    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [restaurantDescription, setRestaurantDescription] = useState("");

    //creamos nuestra funcion addRestaurant
    const addRestaurant = () => {
        console.log("Ok");
        console.log("restaurantName :" + restaurantName);
        console.log("restaurantAddress: " + restaurantAddress);
        console.log("restaurantDescription: " + restaurantDescription);
    };


    return (
        <ScrollView style = {styles.scrollView}>  
            <FormAdd 
            setRestaurantName = {setRestaurantName}
            setRestaurantAddress = {setRestaurantAddress}
            setRestaurantDescription = {setRestaurantDescription}
            /> 
            <Button 
                title = "Crear Restaurante"
                onPress = {addRestaurant} // Llamamos nuestro componente 
                buttonStyle= {styles.btnAddRestaurant}
            />

        </ScrollView>
        );
    }

//Hacemos un componente interno que cera un formulario
function FormAdd(props) {
//console.log(props);
//recuperamos los estados a travez de los props
const {
    setRestaurantName,
    setRestaurantAddress,
    setRestaurantDescription,
 } = props;
    // con el return regresamo una vista
    return(
        <View style = {styles.viewForm}>
            
            <Input  // hacemos nuestros input de alta de restaurants
                placeholder = "Nombre del Restaurante"
                containerStyle = {styles.input}
                onChange = {(e) => setRestaurantName(e.nativeEvent.text)}
            />
            <Input
                placeholder = "Direccion"
                containerStyle = {styles.input}
                onChange = {(e) => setRestaurantAddress(e.nativeEvent.text)}
            />
            <Input 
                placeholder = "Descripcion del restaurants"
                multiline = {true} // lo hacemo multilinea
                inputContainerStyle = {styles.textArea} 
                onChange = {(e) => setRestaurantDescription(e.nativeEvent.text)}
            />
        </View>
    );
}


// Creamos nuestros estilos
    const styles = StyleSheet.create({
        scrollView: { 
            height: "100%",
        },
        viewForm:{
            marginLeft : 10,
            marginRight : 10,
        },
        input : {
            marginBottom : 10,
        },
        textArea : {
            height : 100,
            width : "100%",
            padding : 0,
            margin : 0,
        },
        btnAddRestaurant : {
            backgroundColor : '#00a680',
            margin : 20,
        },
    });
