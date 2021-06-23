import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
import ListRestaurants from '../../components/Restaurants/ListRestaurants';

const db = firebase.firestore(firebaseApp);


export default function Restaurants(props){
    const { navigation } = props;
    const [user, setUser] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [totalRestaurants, setTotalRestaurants] = useState(0);
    const [startRestaurants, setStartRestaurants] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const limitRestaurants = 6;

    //console.log(totalRestaurants);
    
    //console.log(restaurants);
       
    useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo)=>{
        setUser(userInfo);
    });  
   }, []);

   useEffect(() => {
       db.collection("restaurants")
       .get().then((snap) => {
            setTotalRestaurants(snap.size);
       });

     const resultRestaurants=[];

    db.collection("restaurants")
    .orderBy("createAT","desc")
    .limit(limitRestaurants)
    .get()
    .then((response) => {
    //console.log(response);
   setStartRestaurants(response.docs[response.docs.length - 1]);

        response.forEach((doc) => { //for para recorrer todo los retaurants
        //console.log(doc.id);
        const restaurant = doc.data();
        restaurant.id = doc.id;
        //console.log(restaurant);
        resultRestaurants.push(restaurant);
        //console.log(restaurant);
        });
         setRestaurants(resultRestaurants);
         //console.log(restaurants);
        });
   }, []);

   // funcion para cargar el listado de los siguientes restaurantes
   const handleLoadMore = () =>{
    const resultRestaurants = [];
    //si el restaurant es menor al total va acargar mas restaurant
    restaurants.length < totalRestaurants && setIsLoading(true);
    
    db.collection("restaurants")
    .orderBy("createAT","desc")
    .startAfter(startRestaurants.data().createAT)
    .limit(limitRestaurants)
    .get()
    .then((response) => {
        if (response.docs.length > 0) {
            setStartRestaurants(response.docs[response.docs.length-1]);
        }else {
            setIsLoading(false);
        }

            response.forEach((doc) => {
            const restaurant = doc.data();
            restaurant.id = doc.id;
            resultRestaurants.push(restaurant);
         });
        //añadimos los siguientes restaurantes a la lista
        setRestaurants([...restaurants,...resultRestaurants]);
    });
  };

return(
 <View style = {styles.viewBody}>
  <ListRestaurants 
  restaurants = {restaurants} 
  handleLoadMore = {handleLoadMore} 
  isLoading = {isLoading}/>


{user && ( // if user existe entonces mostramos lo siguiente
<Icon
    reverse
    type="material-community"
    name="plus"
    color = "#00a680"
    containerStyle={styles.btnContainer}
    onPress = {() => navigation.navigate("add-restaurant")} //Nuestra ruta en RestaurantsStacks
 />
 )}
 </View>
);
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff",
    },
    btnContainer:{
        position:'absolute',
        bottom:10,
        right:10,
        shadowColor:"black",
        shadowOffset:{ width:2, height:2 },
        shadowOpacity:0.5,
    },
});