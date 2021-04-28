COMPONENTES A INSTALAR ANTES DE EMPEZAR EL PROYECTO

npx create-react-app nombre:proyecto
expo init nombre del proyecto
instalar el react-navigation
desde el cmd
yarn add compon@~1.7.9

desde el navegador
https://reactnavigation.org/docs/getting-started
nosotros instalamos con yarn

aqui le metemos la version con la que se trabajara....
yarn add @react-navigation/native@~5.1.5

instalamos el global Cli
yarn global add expo-cli

instalamos todos los siguientes paquetes con esas versiones

expo install react-native-gesture-handler@~1.6.0
expo install react-native-reanimated@~1.7.0
expo install react-native-screens@~2.2.0
expo install react-native-safe-area-context@~0.7.3
expo install @react-native-community/masked-view@~0.1.6

despues instalamos lo siguiente
https://reactnavigation.org/docs/hello-react-navigation

Hello React Navigation
yarn add @react-navigation/stack@~5.2.10

Tab navigation

yarn add @react-navigation/bottom-tabs@~5.2.6

IINSTALADORES DE COMPONENTES
yarn add @react-navigation/native@~5.1.5

expo install react-native-gesture-handler@~1.6.0
expo install react-native-reanimated@~1.7.0
expo install react-native-screens@~2.2.0
expo install react-native-safe-area-context@~0.7.3
expo install @react-native-community/masked-view@~0.1.6

yarn add @react-navigation/stack@~5.2.10
yarn add @react-navigation/bottom-tabs@~5.2.6

para subir el input del teclado
yarn add react-native-keyboard-aware-scroll-view@~0.9.1

React Native Elements
yarn add react-native-elements@~1.2.7

instalamos paquete de firebase
yarn add firebase@~7.14.0
yarn add firebase@~7.9.0

expo install firebase@~7.9.0
While He Watches

Darya Astafeva - Swingers (2018)

instalamos lodash
para saber el tama�o de una string

actualizar expo

instalar el componente (para mandar unmensaje de alerta Toast)
yarn add react-native-easy-toast@~1.2.0

0
Hola Juan Antonio el problema lo tienes en el NodeJs, quiz�s has
instalado la �ltima versi�n y de ah� el problema al momento de querer
instalar firebase 7.9.0. As� que lo que debes hacer es
instalar NodeJs en su versi�n 12.14.1

Para solucionar el error en Toast se debe tener instalada yarn add react-native-web@~0.11.7

Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`

Para tapar lo he usado una t�cnica:

import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
]);

Es un bug del componente, en la ruta TU-PROYECTO\node_modules\react-native-easy-toast busca el fichero llamado index.js en la linea 47

this.animation = Animated.timing(
this.state.opacityValue,
{
toValue: this.props.opacity,
duration: this.props.fadeInDuration,
useNativeDriver: true, <--------- poner esto
}
)
mismo caso en la linea 69

this.animation = Animated.timing(
this.state.opacityValue,
{
toValue: 0.0,
duration: this.props.fadeOutDuration,
useNativeDriver: true, <--------- poner esto
}
)
a nivel de c�digo (TU PROYECTO) seria omitir en error usando LogBox (Recomendado Hasta que el bug sea arreglado)

import React, { useRef, useEffect } from "react";
import { LogBox } from 'react-native';
y luego usar useEffect y ya con eso deber�a de omitir el error..

useEffect(() => {
LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
}, [])

!!!!Instalacion de packages para poder acceder a la galeria del telefono!!!!!
yarn add expo-permissions@~8.1.0
yarn add expo-image-picker@~8.1.0
