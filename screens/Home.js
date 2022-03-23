import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import DataService from '../services/service';
import Header from "../components/Header";
import Todolist from "../components/Todolist";
import { useFocusEffect } from '@react-navigation/native';

export default function Home() {
  const [textInput, onChangeInput] = useState("");
  
  return (
    <View style={styles.container}>
      <Header
        onChangeInput={onChangeInput}
      />
      <Todolist textInput={textInput}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
    color: "#EEEEEE",
  },
});
