import React, { useState, useEffect } from "react";
import * as firebase from "firebase";
import Loading from "../../components/Loading";
import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged";


export default function Account() {
    const [login, setLogin] = useState(null);
       
      useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
       !user ? setLogin(false) : setLogin(true);
      });    
  }, []);
 
 //if (login === null) return <Loading isVisible={true} text="cargando..." />;
if (login === null) return <Loading isVisible={true} text="Cargando...Jack"/>;

//if (login === null) return <Text>Cargando.....</Text>;
return login ? <UserLogged /> : <UserGuest />;
//return  <UserGuest /> 
}
