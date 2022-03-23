import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import * as RootNavigation from "../RootNavigation.js";

const HeaderAdd = (props) => {
  const pressHandler = () => {
    RootNavigation.navigate("Home");
  };
  return (
    <View style={styles.header}>
      <TouchableOpacity style={{ width: 50 }} onPress={pressHandler}>
        <FontAwesomeIcon size={40} color={"#EEEEEE"} icon={faCaretLeft} />
      </TouchableOpacity>
      <Text
        style={{
          color: "#EEEEEE",
          fontSize: 28,
        }}
      >
        {props.titletodo}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 10,
    paddingTop: 26,
    flexDirection: "row",
    width: "100%",
    height: 80,
    backgroundColor: "#fff",
    alignItems: "center",
    backgroundColor: "#00ADB57D",
    color: "#EEEEEE",
  },
});

export default HeaderAdd;
