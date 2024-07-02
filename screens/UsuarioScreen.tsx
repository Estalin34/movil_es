import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ref, set, onValue, update, remove } from 'firebase/database';
import { db } from '../config/Config';
import Tarjeta from '../Components/Tarjeta';

// Definir el tipo Usuario
type Usuario = {
    key: string;
    name: string;
    email: string;
    coment: string;
};

export default function UsuarioScreen() {
    const [cedula, setCedula] = useState<string>("");
    const [nombre, setNombre] = useState<string>("");
    const [correo, setCorreo] = useState<string>("");
    const [comentario, setComentario] = useState<string>("");
    const [editando, setEditando] = useState<boolean>(false);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    // Guardar/Editar 
    function guardarUsuario() {
        if (editando) {
            update(ref(db, `usuarios/${cedula}`), {
                name: nombre,
                email: correo,
                coment: comentario
            }).then(() => {
                Alert.alert("Mensaje", "Información editada");
            }).catch(error => {
                Alert.alert("Error", error.message);
            });
        } else {
            set(ref(db, `usuarios/${cedula}`), {
                name: nombre,
                email: correo,
                coment: comentario
            }).then(() => {
                Alert.alert("Mensaje", "Información guardada");
            }).catch(error => {
                Alert.alert("Error", error.message);
            });
        }
        limpiarFormulario();
    }

    // Editar usuario
    function editarUsuario(usuario: Usuario) {
        setCedula(usuario.key);
        setNombre(usuario.name);
        setCorreo(usuario.email);
        setComentario(usuario.coment);
        setEditando(true);
    }

    // Eliminar usuario
    function eliminarUsuario(key: string) {
        remove(ref(db, `usuarios/${key}`))
            .then(() => {
                Alert.alert("Mensaje", "Usuario eliminado");
                setUsuarios(usuarios.filter(usuario => usuario.key !== key));
            })
            .catch(error => {
                Alert.alert("Error", error.message);
            });
    }

    // Limpiar formulario
    function limpiarFormulario() {
        setCedula('');
        setNombre('');
        setCorreo('');
        setComentario('');
        setEditando(false);
    }

    // Leer usuarios
    useEffect(() => {
        const starCountRef = ref(db, 'usuarios/');
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const dataTemp: Usuario[] = Object.keys(data).map(key => ({
                    key,
                    name: data[key].name,
                    email: data[key].email,
                    coment: data[key].coment
                }));
                setUsuarios(dataTemp);
            } else {
                setUsuarios([]);
            }
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>USUARIOS</Text>
            <TextInput
                placeholder='Ingresar cédula'
                style={styles.input}
                onChangeText={texto => setCedula(texto)}
                value={cedula}
                keyboardType='numeric'
            />
            <TextInput
                placeholder='Ingresar nombre'
                style={styles.input}
                onChangeText={texto => setNombre(texto)}
                value={nombre}
            />
            <TextInput
                placeholder='Ingresar correo'
                style={styles.input}
                onChangeText={texto => setCorreo(texto)}
                keyboardType='email-address'
                value={correo}
            />
            <TextInput
                placeholder='Ingresar comentario'
                style={[styles.input, { height: 100 }]}
                onChangeText={texto => setComentario(texto)}
                value={comentario}
                multiline
            />
            <TouchableOpacity style={styles.button} onPress={guardarUsuario}>
                <Text style={styles.buttonText}>{editando ? 'Actualizar' : 'Guardar'}</Text>
            </TouchableOpacity>

            <FlatList
                data={usuarios}
                renderItem={({ item }) => (
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
                        <Tarjeta usuario={item} />
                    </View>
                )}
                keyExtractor={item => item.key}
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
