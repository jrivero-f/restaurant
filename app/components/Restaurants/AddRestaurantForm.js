import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Dimensions } from 'react-native';
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements';
import { map, size, filter, isObject } from 'lodash';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import uuid from 'random-uuid-v4';
import Modal from '../Modal';
import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
//import { LogBox } from 'react-native';

const db = firebase.firestore(firebaseApp);
//capturamos la dimension de la pantalla del celular
const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props){
    const {toastRef, setIsLoading, navigation} = props; // recuperamos nuestro toast por medio de props
    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [restaurantDescription, setRestaurantDescription] = useState("");
    const [imagesSelected, setImagesSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null);

  /*useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    }, [])*/

    //creamos nuestra funcion addRestaurant
    const addRestaurant = () => {
        if(!restaurantName || !restaurantAddress || !restaurantDescription){
            toastRef.current.show("Todos los campos del formulario son obligatorios");
        }else if(size(imagesSelected) === 0) {
            toastRef.current.show("El restaurante tiene que tener almenos una foto");
        }else if(!locationRestaurant){
            toastRef.current.show("Tienes que localizar el restaurant en el mapa");
         } else{
            setIsLoading(true);
                //console.log("ok")
                uploadImageStorage().then((response)=>{
                    //console.log(response);
                    //setIsLoading(false);
                    db.collection("restaurants")
                    .add({
                        name:restaurantName,
                        address:restaurantAddress,
                        description: restaurantDescription,
                        location: locationRestaurant,
                        images:response,
                        ratin: 0,
                        ratingTotal:0,
                        quantityVoting:0,
                        createAT: new Date(),
                        createBy: firebase.auth().currentUser.uid,
                        //Denvelop:"Jack",
                    }).then(()=>{
                        setIsLoading(false);
                        //console.log("Ok");
                        navigation.navigate("restaurants");//regresamos al menu principal
                    }).catch(()=>{
                        setIsLoading(false);
                        toastRef.current.show(
                            "Error al subir el restaurante, intentelo mas tarde"
                        )
                    })
                });
            }
        
        //console.log("Ok");
       /* console.log("restaurantName :" + restaurantName);
        console.log("restaurantAddress: " + restaurantAddress);
        console.log("restaurantDescription: " + restaurantDescription);
        console.log(imagesSelected);
        console.log(locationRestaurant);*/
    };

    //funcion para guardar nuestros datos del restaurant a firebase
    const uploadImageStorage = async ()=>{
        //console.log(imagesSelected);
        const imageBlob=[];

        await Promise.all( 
            map(imagesSelected,async image=>{
            const response = await fetch(image);
            //console.log(JSON.stringify(response));
            const blob = await response.blob();
            const ref = firebase.storage().ref("restaurants").child(uuid());
            await ref.put(blob).then(async (result) => {
                await firebase
                .storage()
                .ref(`restaurants/${result.metadata.name}`)
                .getDownloadURL()
                .then(photoUrl => {
                    imageBlob.push(photoUrl);
                    //console.log(photoUrl);
                });
                //console.log("OKkk");
            });
        })
     );       
        return imageBlob;
    };
    

    return (
        <ScrollView style = {styles.scrollView}>  
          <ImageRestaurant imageRestaurant = {imagesSelected[0]} /> 
        <FormAdd 
            setRestaurantName = {setRestaurantName}
            setRestaurantAddress = {setRestaurantAddress}
            setRestaurantDescription = {setRestaurantDescription}
            setIsVisibleMap = {setIsVisibleMap}
            locationRestaurant = {locationRestaurant}
        /> 
         <UploadImage 
            toastRef={toastRef} 
            imagesSelected={imagesSelected} 
            setImagesSelected = {setImagesSelected} 
        /> 
         <Button 
            title = "Crear Restaurante"
            onPress = {addRestaurant} // Llamamos nuestro componente 
            buttonStyle= {styles.btnAddRestaurant}
         />
        <Map 
            isVisibleMap={isVisibleMap} 
            setIsVisibleMap= {setIsVisibleMap}
            setLocationRestaurant = {setLocationRestaurant}
            toastRef={toastRef} 
         />
        </ScrollView>
        );
    }

    function ImageRestaurant(props){
        const { imageRestaurant } = props;
        
        return (
            <View style = {styles.viewPhoto}>
                <Image 
                source = {imageRestaurant //condicionamos si no tiene imagen colocamos una por default
                    ? { uri:imageRestaurant } 
                    : require("../../../assets/img/no-image.png") } 
                     //colocamos nuestra captura widthScreen
                style = {{width : widthScreen, height: 200 }}
                />
            </View>
        )
    }
//Hacemos un componente interno que crear un formulario
function FormAdd(props) {
//console.log(props);
//recuperamos los estados a travez de los props
const {
    setRestaurantName,
    setRestaurantAddress,
    setRestaurantDescription,
    setIsVisibleMap,
    locationRestaurant
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
                
                rightIcon = {{
                    type: "material-community",
                    name: "google-maps",
                    color: locationRestaurant ? "#00a680": "#c2c2c2", // comprobamos si tiene ubicacion para habilitar el color del icono
                  onPress: () => setIsVisibleMap(true),
                }}
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

//creando un componente del Mapa de ubicacion
function Map(props){
    const { isVisibleMap, setIsVisibleMap, toastRef, setLocationRestaurant } = props;
    const [location, setLocation] = useState(null);
    
    //funcion anonima asyncrona para pedir permiso de localizacion
    useEffect(() => {
        (async ()=>{
            const resultPermissions = await Permissions.askAsync(
               Permissions.LOCATION 
            );
            //console.log(resultPermissions);
            const statusPermissions = resultPermissions.permissions.location.status;
            
            if (statusPermissions !== "granted"){
                toastRef.current.show(
                    "Tienes que aceptar los permisos de localizacion para crear un restaurante",
                    3000
                    );
            } else {
                const loc = await Location.getCurrentPositionAsync({accuracy: 6});
                //console.log(loc);
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                });
        }
     })();
    }, []);

    const confirmLocation = () =>{
        setLocationRestaurant(location);
        toastRef.current.show("Localizcion guardada correctamente");
        setIsVisibleMap(false);
    }

  return(
        <Modal 
        isVisible = {isVisibleMap} 
        setIsVisible = {setIsVisibleMap}>
            <View>
                {location && (
                <MapView
                    style={styles.mapStyle}
                    initialRegion = {location}
                    showsUserLocation = {true}
                    onRegionChange= {(region) => setLocation(region)}
                    >
                    <MapView.Marker // creamos un marcador en nuestra localizacion              
                    coordinate = {{
                        latitude: location.latitude,
                        longitude: location.longitude,
                    }} draggable 
                    />
                    </MapView>
                )}
               <View style = { styles.viewMapBtn}>
                <Button title = "Guardar Ubicacion"
                containerStyle = {styles.viewMapBtnContainerSave}
                buttonStyle = {styles.viewMapBtnSave}
                onPress = {confirmLocation}
                />
                <Button title = "Cancelar Ubicacion" 
                containerStyle = {styles.viewMapBtnContainerCancel} 
                buttonStyle = {styles.viewMapBtnCancel}
                onPress = {() => setIsVisibleMap(false)}
                />
                </View>
            </View>
        </Modal>
    );
}

// creamos una funcion para subir nuestra imagen
function UploadImage(props){
const { toastRef, imagesSelected, setImagesSelected } = props;
    //funcion que reacciona al click del mouse


    const imageSelect = async () => {
        //console.log("Imagenes....");
        const resultPermissions = await Permissions.askAsync(
            Permissions.CAMERA
        );

        //validamos permiso para accesar a la galerias de imagen
        if(resultPermissions === "denied"){
        toastRef.current.show("Es necesario aceptar los permisos de la galeria, si los has rechazado tienes que ir ha ajustes y activarlos manualmente.",3000);
                }else {
                    const result = await ImagePicker.launchImageLibraryAsync({
                        allowsEditing: true,
                        aspect: [4,3],
                    });
                    //console.log(result);
                    if(result.cancelled){
                        toastRef.current.show("Has cerrado la galeria sin seleccionar ninguna imagen",2000);
                    }else{
                        //console.log("ok");
                        //console.log(result.uri);
                        //setImagesSelected(result.uri);
                        setImagesSelected([...imagesSelected, result.uri]); //agregamos nuestra imagen al array
                    }
                }
        //console.log(resultPermissions);
    };
// constante para eliminar imagen selccionada
    const removeImage = (image) => {
       //const arrayImages = imagesSelected;

    Alert.alert(
            "Elimar Imagen",
            "¿Estas seguro de que quieres eliminar la imagen?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                    {
                        text: "Eliminar",
                        onPress: () => {
              //console.log("Eliminado");
         const test = filter(imagesSelected, (imageUrl) => imageUrl !== image); //aqui devolvemos la imagenes que son diferente a la que se borrara
         setImagesSelected(test); // actualizamos estado
           //setImagesSelected = test;
        //console.log(test);
        //console.log(setImagesSelected);
            },
                    },
                ],
            {cancelable:false }
        );
        };

    return(
        <View style={styles.viewImages}>
            {size(imagesSelected) < 4 && (
                <Icon // nuestro icono para subir imagenes del restaurant
                type="material-community"
                name = "camera"
                color = "#7a7a7a"
                containerStyle = {styles.containerIcon}
                onPress = {imageSelect}
                />
            )}

  {map(imagesSelected, (imageRestaurant,index) => (// mostramos nuesttro mapa de imagenes
        <Avatar 
        key={index}
        style={styles.miniatureStyle}
        source = {{ uri: imageRestaurant }}
        onPress = {()=>removeImage(imageRestaurant)}
        />
    ))}
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
        viewImages: {
            flexDirection: "row",
            marginLeft: 20,
            marginRight: 20,
            marginTop:30,
        },
        containerIcon : {
            alignItems: "center",
            justifyContent : "center",
            marginRight:10,
            height: 70,
            width: 70,
            backgroundColor: "#e3e3e3",
        },
        miniatureStyle: {
            width : 70,
            height: 70,
            marginRight:10,
        },
        viewPhoto : {
            alignItems : "center",
            height : 200,
            marginBottom : 20,
        },
        mapStyle:{
            width:"100%",
            height: 550,
        },
        viewMapBtn: {
            flexDirection : "row",
            justifyContent: "center",
            marginTop: 10,
        },
        viewMapBtnContainerCancel: {
            paddingLeft: 5,
        },
        viewMapBtnCancel:{
            backgroundColor: "#a60d0d",
        },
        viewMapBtnContainerSave:{
            paddingRight: 5, 
        },
        viewMapBtnSave: {
            backgroundColor: "#00a680",
        },
    });
