import { Alert, Button, FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
//-- FIREBASE
import { ref, set, onValue, update, remove } from "firebase/database";
import { db } from '../config/Config';

// Definir el tipo Usuario
type Usuario = {
    key: string,
    name: string,
    email: string,
    coment: string
};

export default function UsuarioScreen() {
    const [cedula, setcedula] = useState<string>("");
    const [nombre, setnombre] = useState<string>("");
    const [correo, setcorreo] = useState<string>("");
    const [comentario, setcomentario] = useState<string>("");
    const [editando, seteditando] = useState<boolean>(false);
    const [usuarios, setusuarios] = useState<Usuario[]>([]);

    //-------- GUARDAR/EDITAR ----------//
    function guardarUsuario() {
        if (editando) {
            update(ref(db, 'usuarios/' + cedula), {
                name: nombre,
                email: correo,
                coment: comentario
            });
            Alert.alert("Mensaje", "Información actualizada");
        } else {
            set(ref(db, 'usuarios/' + cedula), {
                name: nombre,
                email: correo,
                coment: comentario
            });
            Alert.alert("Mensaje", "Información guardada");
        }

        limpiarFormulario();
    }

    function limpiarFormulario() {
        setcedula('');
        setnombre('');
        setcorreo('');
        setcomentario('');
        seteditando(false);
    }

    // ---- LEER --------------------//
    useEffect(() => {
        const starCountRef = ref(db, 'usuarios/');
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();

            const dataTemp: Usuario[] = Object.keys(data).map((key) => ({
                key, ...data[key]
            }));

            setusuarios(dataTemp);
        });
    }, []);

    // ---- EDITAR -------------------//
    function editarUsuario(usuario: Usuario) {
        setcedula(usuario.key);
        setnombre(usuario.name);
        setcorreo(usuario.email);
        setcomentario(usuario.coment);
        seteditando(true);
    }

    //------ ELIMINAR -----------------//
    function eliminarUsuario(key: string) {
        remove(ref(db, 'usuarios/' + key))
            .then(() => {
                Alert.alert("Mensaje", "Usuario eliminado");
                // Actualizar la lista de usuarios localmente después de eliminar
                setusuarios(usuarios.filter(usuario => usuario.key !== key));
            })
            .catch(error => {
                Alert.alert("Error", error.message);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>USUARIOS</Text>
            <TextInput
                placeholder='Ingresar cédula'
                style={styles.input}
                onChangeText={(texto) => setcedula(texto)}
                value={cedula}
                keyboardType='numeric'
            />

            <TextInput
                placeholder='Ingresar nombre'
                style={styles.input}
                onChangeText={(texto) => setnombre(texto)}
                value={nombre}
            />
            <TextInput
                placeholder='Ingresar correo'
                style={styles.input}
                onChangeText={(texto) => setcorreo(texto)}
                keyboardType='email-address'
                value={correo}
            />
            <TextInput
                placeholder='Ingresar comentario'
                style={styles.input}
                onChangeText={(texto) => setcomentario(texto)}
                value={comentario}
                multiline
            />
            <TouchableOpacity style={styles.button} onPress={guardarUsuario}>
                <Text style={styles.buttonText}>{editando ? 'Actualizar' : 'Guardar'}</Text>
            </TouchableOpacity>

            <FlatList
                data={usuarios}
                renderItem={({ item }: { item: Usuario }) =>
                    <View style={styles.userCard}>
                        <Text style={styles.userText}><Text style={styles.boldText}>Cédula:</Text> {item.key}</Text>
                        <Text style={styles.userText}><Text style={styles.boldText}>Nombre:</Text> {item.name}</Text>
                        <Text style={styles.userText}><Text style={styles.boldText}>Correo:</Text> {item.email}</Text>
                        <Text style={styles.userText}><Text style={styles.boldText}>Comentario:</Text> {item.coment}</Text>
                        <View style={styles.userActions}>
                            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => eliminarUsuario(item.key)}>
                                <Text style={styles.actionButtonText}>Eliminar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => editarUsuario(item)}>
                                <Text style={styles.actionButtonText}>Editar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                keyExtractor={(item) => item.key}
            />
            <StatusBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        backgroundColor: '#e0e0e0',
        height: 50,
        marginBottom: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        borderRadius: 8,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    userCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 3,
    },
    userText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    boldText: {
        fontWeight: 'bold',
    },
    userActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    actionButton: {
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    deleteButton: {
        backgroundColor: '#E53935',
    },
    editButton: {
        backgroundColor: '#2196F3',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
    },
});
