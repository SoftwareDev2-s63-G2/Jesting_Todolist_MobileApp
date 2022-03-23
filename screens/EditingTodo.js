import React from "react";
import { StyleSheet, View } from "react-native";

import Edittodo from "../components/Edittodo";
import HeaderAdd from "../components/HeaderAdd";
export default function EditingTodo() {
  return (
    <View style={styles.container}>
      <HeaderAdd titletodo='Edit todo'/>
      <Edittodo />
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
