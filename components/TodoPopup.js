import React from "react";
import {
  StyleSheet,
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faXmarkCircle,
  faGear,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import * as RootNavigation from "../RootNavigation.js";
import DataService from "../services/service";

const TodoPopup = (props) => {
  const visible = props.visible;
  const todo = props.todo;

  const pressHandler = () => {
    props.setVisible(false);
    RootNavigation.navigate("Edit", props.todo);
  };

  const getAll = () => {
    DataService.getAll()
      .then((response) => {
        const data = response.data;
        const showedTodo = [];
        if (data !== [] && props.textInput !== "") {
          data.forEach((value) => {
            if (
              value.title.toLowerCase().includes(props.textInput.toLowerCase())
            ) {
              showedTodo.push(value);
            }
          });
          props.onChangeDATA(showedTodo);
        } else {
          props.onChangeDATA(data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteHandler = (todo) => {
    Alert.alert(
      "Are you sure to delete this?",
      "You won't be able to revert this!",
      [
        {
          text: "Cancel",
          // onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "ํYes, Delete it",
          onPress: () => {
            // console.log("OK Pressed");
            DataService.delete(todo.id)
              .then((response) => {
                props.setVisible(false);
                getAll();
              })
              .catch((e) => {
                console.log(e);
              });
          },
        },
      ]
    );
  };

  return (
    <Modal transparent={true} visible={visible}>
      <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
        <View style={styles.container}>
          <ScrollView>
            <View style={{ marginLeft: "85%" }}>
              <TouchableOpacity
                onPress={() => {
                  props.setVisible(false);
                }}
              >
                <FontAwesomeIcon
                  size={30}
                  color={"#EEEEEE"}
                  icon={faXmarkCircle}
                />
              </TouchableOpacity>
            </View>
            {todo === null ? (
              <noscript></noscript>
            ) : (
              <>
                <View>
                  <Text style={styles.title}>{todo.title}</Text>
                </View>
                <View>
                  <Text style={styles.info}>
                    Description : {todo.description}
                  </Text>
                  <Text style={styles.info}>
                    Finished : {todo.finished ? "Yes" : "No"}
                  </Text>
                  <Text style={styles.info}>
                    Favorite : {todo.favor ? "Yes" : "No"}
                  </Text>
                  <Text style={styles.info}>
                    Remind Time : {"\n"}
                    {"\t\t\t\t"}
                    {todo.rtime}
                  </Text>
                  <Text style={styles.info}>Image :</Text>
                  <View>
                    <Image
                      source={{ uri: todo.uri }}
                      style={styles.thumbnail}
                    />
                  </View>
                </View>
              </>
            )}
            {todo !== null ? (
              <View style={{ flexDirection: "row", marginLeft: "70%" }}>
                <TouchableOpacity style={{ marginRight: 20 }}>
                  <FontAwesomeIcon
                    size={30}
                    color={"#EEEEEE"}
                    icon={faTrash}
                    onPress={() => {
                      deleteHandler(todo);
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <FontAwesomeIcon
                    size={30}
                    color={"#EEEEEE"}
                    icon={faGear}
                    onPress={pressHandler}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <noscript></noscript>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#393E46",
    color: "#EEEEEE",
    // justifyContent: 'center',
    marginHorizontal: 16,
    margin: 80,
    borderRadius: 30,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#EEEEEE",
    marginBottom: 8,
  },
  info: {
    fontSize: 22,
    textAlign: "left",
    color: "#EEEEEE",
    marginVertical: 8,
  },
  thumbnail: {
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "center",
    width: 360,
    height: 150,
    resizeMode: "contain",
  },
});

export default TodoPopup;
