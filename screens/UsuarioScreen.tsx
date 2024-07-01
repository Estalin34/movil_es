import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
//-- FIREBASE
import { ref, set, onValue } from "firebase/database";
import { db } from '../config/Config'

export default function UsuarioScreen() {
    const [cedula, setcedula] = useState("")
    const [nombre, setnombre] = useState("")
    const [correo, setcorreo] = useState("")
    const [comentario, setcomentario] = useState("")

    const [usuarios, setusuarios] = useState([])

    //-------- GUARDAR ----------//
    function guardarUsuario(cedula: string, nombre: string, correo: string, comentario: string) {

        set(ref(db, 'usuarios/' + cedula), {
            name: nombre,
            email: correo,
            coment: comentario
        });
        Alert.alert("Mensaje", "Información guardada")

        setcedula('')
        setnombre('')
        setcorreo('')
        setcomentario('')

    }

    // ---- LEER --------------------//
    useEffect(() => {
        const starCountRef = ref(db, 'usuarios/' );
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            //console.log(data);

            const dataTemp : any = Object.keys(data).map( (key)=> ({
                key, ...data[key]
            }) )

            console.log(dataTemp);
            setusuarios(dataTemp) 
        });

    }, [])

    type Usuario={
        name: string
    }


    return (
        <View style={styles.container}>
            <Text>USUARIOS</Text>
            <TextInput
                placeholder='Ingresar cédula'
                style={styles.txt}
                onChangeText={(texto) => setcedula(texto)}
                value={cedula}
                keyboardType='numeric'
            />

            <TextInput
                placeholder='Ingresar nombre'
                style={styles.txt}
                onChangeText={(texto) => setnombre(texto)}
                value={nombre}
            />
            <TextInput
                placeholder='Ingresar correo'
                style={styles.txt}
                onChangeText={(texto) => setcorreo(texto)}
                keyboardType='email-address'
                value={correo}
            />
            <TextInput
                placeholder='Ingresar comentario'
                style={styles.txt}
                onChangeText={(texto) => setcomentario(texto)}
                value={comentario}
                multiline
            />
            <Button title='guardar' onPress={() => guardarUsuario(cedula, nombre, correo, comentario)} />

            <FlatList 
                data={ usuarios}
                renderItem={ ( {item}: {item: Usuario} ) =>  
                <View>
                    <Text>{item.name}</Text>
                </View>
                }
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#b3caa5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    txt: {
        backgroundColor: '#a6a6fc',
        height: 50,
        width: "80%",
        margin: 2,
        fontSize: 20
    }
})