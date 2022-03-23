import React, { useState } from "react";
import {  View,StyleSheet, TextInput, TouchableOpacity, Text } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMagnifyingGlass,faPlus } from '@fortawesome/free-solid-svg-icons'
import * as RootNavigation from '../RootNavigation.js';

const Header = (props) => {
  const [text, onChangeText] = useState("");

  const pressHandler = () => {
    RootNavigation.navigate('Add')
    }
    
  return (
    <View style={styles.header}>
        <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            placeholder='Search ...'
            value={text}
        />
        <TouchableOpacity style={{width:50}} onPress={()=>{props.onChangeInput(text)}}>
            <FontAwesomeIcon size={30} color={"#EEEEEE"} icon={faMagnifyingGlass}/>
        </TouchableOpacity>
        <TouchableOpacity style={{width:50}} onPress = {pressHandler}>
            <FontAwesomeIcon size={30} color={"#EEEEEE"} icon={faPlus }/>
            </TouchableOpacity>
        </View>
  );
};


const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 10,
        paddingTop:26,
        flexDirection: "row",
        justifyContent:'center',
        width:'100%',
        height:120,
        backgroundColor: '#fff',
        alignItems: 'center',
        backgroundColor:'#00ADB57D',
        color:'#EEEEEE',
    },
    input: {
        paddingHorizontal: 10,
        marginRight:15,
        width:'70%',
        height:40,
        borderRadius:24,
        backgroundColor:'#EEEEEE',
        color:'black',
        fontSize: 15
    },
});

export default Header