import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle, TextStyle, Image } from 'react-native';

interface Props {
    onPress: () => void;
    disabled: boolean;
}

export function DemoButton({
    disabled,
    onPress,
    children,
}: React.PropsWithChildren<Props>) {
    return (
        <Pressable
            disabled={disabled}
            onPress={onPress}
            style={({ pressed }) => [
                {
                    backgroundColor: pressed ? 'skyblue' : 'steelblue',
                },
                styles.container,
            ]}>
            <Image
                style={{ width: 70, height: 70, alignSelf: "center", display: children!="Take Image"? "none":"flex" }}
                source={require("../../images/camera.png")}
            />
            <Image
                style={{ width: 70, height: 70, alignSelf: "center", display: children=="Take Image"? "none":"flex" }}
                source={require("../../images/add-image.png")}
            />
            <Text style={styles.text}>{children}</Text>
        </Pressable>
    );
}

interface Styles {
    container: ViewStyle;
    text: TextStyle;
}

const styles = StyleSheet.create<Styles>({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        minWidth: '45%',
        maxWidth: '100%',
        marginHorizontal: 8,
        marginVertical: 4,
        borderRadius: 8,
        height: 120
    },
    text: {
        textAlign: 'center',
        color: 'white',
    },
});