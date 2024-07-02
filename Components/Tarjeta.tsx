// Tarjeta.tsx
import React from 'react';
import { View, Text } from 'react-native';

type TarjetaProps = {
    usuario: {
        key: string;
        name: string;
        email: string;
        coment: string;
    };
};

const Tarjeta: React.FC<TarjetaProps> = ({ usuario }) => {
    return (
        <View>
            <Text>{usuario.name}</Text>
            <Text>{usuario.email}</Text>
            <Text>{usuario.coment}</Text>
        </View>
    );
};

export default Tarjeta;
