import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { size } from 'lodash';
import * as firebase from 'firebase';
import { reauthenticate } from '../../utils/api';


export default function ChangePasswordForm(props) {
    const { setShowModal, toastRef } = props;
    const [ShowPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultValue());
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    console.log(formData);

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text });
    };

    const onSubmit = async () => {
        let isSetErrors = true;
        let errorsTemp = {};
        setErrors({});
        if (!formData.password ||
            !formData.newPassword ||
            !formData.repeatNewPassword
        ) {
            errorsTemp = {
                password: !formData.password ? "La contraseña no puede estar vacia." : "",
                newPassword: !formData.newPassword ? "La contraseña no puede estar vacia." : "",
                repeatNewPassword: !formData.repeatNewPassword ? "La contraseña no puede estar vacia." : "",
            };
        } else if (formData.newPassword !== formData.repeatNewPassword) {
            errorsTemp = {
                newPassword: "Las contraseñas no son igualaes.",
                repeatNewPassword: "Las contraseñas no son igualaes.",
            };
        } else if (size(formData.newPassword) < 6) {
            errorsTemp = {
                newPassword: "La contraseña tiene que ser mayor a 5 caracteres.",
                repeatNewPassword: "La contraseña tiene que ser mayor a 5 caracteres.",
            };
        } else {
            setIsLoading(true);
            await reauthenticate(formData.password)
                .then(async () => {
                    await firebase
                        .auth()
                        .currentUser.updatePassword(formData.newPassword)
                        .then(() => {
                            isSetErrors = false;
                            setIsLoading(false);
                            setShowModal(false);
                            firebase.auth().signOut();
                        }).catch(() => {
                            errorsTemp = {
                                other: "Error al actualizar la contraseña."
                            };
                            setIsLoading(false);
                        });
                })
                .catch(() => {
                    errorsTemp = {
                        password: "La contraseña no es correcta.",
                    };
                    setIsLoading(false);
                });
            //console.log("ok");
        }
        isSetErrors && setErrors(errorsTemp);
    };

    return (
        <View style={styles.view} >
            <Input
                placeholder="Contraseña actual"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={ShowPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: ShowPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!ShowPassword),
                }}
                onChange={(e) => onChange(e, "password")}
                errorMessage={errors.password}
            />
            <Input
                placeholder="Nueva contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={ShowPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: ShowPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!ShowPassword),
                }}
                onChange={(e) => onChange(e, "newPassword")}
                errorMessage={errors.newPassword}
            />
            <Input
                placeholder="Repetir nueva contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={ShowPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: ShowPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!ShowPassword),
                }}
                onChange={(e) => onChange(e, "repeatNewPassword")}
                errorMessage={errors.repeatNewPassword}
            />
            <Button
                title="cambiar contraseña"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
            <Text> {errors.other} </Text>
        </View>
    );
}

function defaultValue() {
    return {
        password: "",
        newPassword: "",
        repeatNewPassword: "",
    };
}


const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        padding: 10,
        paddingBottom: 10,
    },
    input: {
        marginBottom: 10,
    },
    btnContainer: {
        marginTop: 20,
        width: "95%",
    },
    btn: {
        backgroundColor: "#00a680",
    },
});
