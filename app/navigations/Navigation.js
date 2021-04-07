import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import RestaurantsStack from "./RestaurantsStack";
import FavoritesStack from "./FavoritesStack";
import TopRestaurantsStack from "./TopRestaurantsStack";
import SearchStack from "./SearchStack";
import AccountStack from "./AccountStack";

// import Restaurants from "../screens/Restaurants";
//import Favorites from "../screens/Favorites";
//import TopRestaurants from "../screens/TopRestaurants";
//import Search from "../screens/Search";
//import Account from "../screens/Account";
 

const Tab = createBottomTabNavigator();

export default function Navigation() {
    return(
        <NavigationContainer>
            <Tab.Navigator 
            initialRouteName = "restaurants" 
            tabBarOptions = {{
                inactiveTintColor: "#646464",
                activeTintColor: "#00a680",
            }}
            screenOptions = {({route}) => ({
                tabBarIcon: ({color}) => screenOptions(route,color),
            })}
            >
                <Tab.Screen 
                name = "restaurants" 
                //component = {Restaurants} 
                component = {RestaurantsStack}
                options = {{ title:"Restaurantes" }} />
                <Tab.Screen 
                name = "favorites" 
                //component = {Favorites} 
                component = { FavoritesStack }
                options = {{title: "Favoritos"}} />

                <Tab.Screen 
                name = {"top-restaurants"} 
                //component = {TopRestaurants}
                component = { TopRestaurantsStack }
                options = {{ title: "Top 5" }} />                

                <Tab.Screen     
                name = {"search"}
           //     component = {Search}
                component = {SearchStack}
                options = {{ title: "Buscador"}}
                />
                <Tab.Screen 
                name = {"account"}
                //component = {Account}
                component = {AccountStack}
                options = {{ title: "Cuenta" }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

function screenOptions(route,color){
    let iconName;
    switch (route.name) {
        case "restaurants":
            iconName = "compass-outline"
        break;
        case "favorites":
            iconName = "heart-outline"
        break;
        case "top-restaurants":
            iconName = "star-outline"
        break;
        case "search":
            iconName = "magnify"
        break;
        case "account":
            iconName = "home-outline"
        break;

        default:
            break;
    }
    return (
<Icon type = "material-community" name={iconName} size ={22} color = {color} />
    );
}