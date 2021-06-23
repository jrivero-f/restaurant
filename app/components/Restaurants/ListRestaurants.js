import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';

import { Image } from 'react-native-elements';
import {size} from 'lodash';
//import Restaurants from '../../screens/Restaurants/Restaurants';

// Funcion para hacer el listado de restaurants
export default function ListRestaurants(props) {
    const {restaurants, handleLoadMore, isLoading } = props;
    //const restaurants = ["ss"];
    return (
       <View>
           {size(restaurants) > 0 ? (
             <FlatList
                data = {restaurants}
                renderItem = {(restaurant) =>
                <Restaurant restaurant = {restaurant} />}
                keyExtractor = {(item, index) => index.toString()}
                onEndReachedThreshold = {0.5}
                onEndReached = {handleLoadMore}
                ListFooterComponent = {<FooterList isLoading={isLoading}/>}
             />
           ) : (
               <View style = {styles.loaderRestaurants} >
                <ActivityIndicator size = "large" />
                <Text>Cargando Restaurantes</Text>
             </View>
           )}
       </View>

    );
}


//componente que renderiza el listado
function Restaurant(props){
    const {restaurant} = props;
    const { images, name, description, address } = restaurant.item;
    const imageRestaurant = images[0];
    //console.log(restaurant);
    
const goRestaurant = () => {
    console.log("ok");
}

    return (
        <TouchableOpacity onPress = {goRestaurant}>
           <View style = {styles.viewRestaurant}>
            <View style = {styles.viewRestaurantImage}>
                <Image 
                resizeMode = "cover"
                PlaceholderContent = {<ActivityIndicator color = "fff"/> }
        //cargamos la imagen y la condicionamos en caso de que no traiga imagen le cargamos una por default
                source ={
                      imageRestaurant 
                    ? {uri : imageRestaurant }
                    : require("../../../assets/img/no-image.png")
                }
                //le damos el estilo del tamaño de la imagen
                style = {styles.imageRestaurant}
                />
            </View>
                <View>
                    <Text style= {styles.restaurantName}>{name}</Text>
                    <Text style= {styles.restaurantAddress}>{address}</Text>
                    <Text style={styles.restaurantDescription}>
                        {description.substr(0,60)}...
                    </Text>
                </View>
           </View>
        </TouchableOpacity>
    );
}

function FooterList(props) {
    const { isLoading } = props;
    
    if (isLoading){
        return(
            <View style = {styles.loaderRestaurants}>
                <ActivityIndicator size = "large" />
            </View>
        );
  } else {
      return(
          <View styele = {styles.notFoundRestaurants}>
            <Text> No quedan Restaurantes por cargar</Text>
          </View>
      );
  }
}


const styles = StyleSheet.create({
    loaderRestaurants : {
        marginTop : 10,
        marginBottom :10,
        alignItems:"center",
    },
    viewRestaurant: {
        flexDirection : "row",
        margin : 10,
    },
    viewRestaurantImage : {
        marginRight: 15,
    },
    imageRestaurant: {
        width: 80,
        height: 80,
    },
    restaurantName : {
        fontWeight : "bold",
    },
    restaurantAddress:{
        paddingTop : 2,
        color : "grey",
    },
    restaurantDescription : {
        paddingTop:2,
        color: "grey",
        maxWidth : 300,
    },
    notFoundRestaurants : {
        marginTop: 10,
        marginBottom: 20,
        alignItems : "center",
    }
  
});
