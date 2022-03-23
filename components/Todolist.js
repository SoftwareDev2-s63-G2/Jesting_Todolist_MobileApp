import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import TodoPopup from "./TodoPopup";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import * as RootNavigation from "../RootNavigation.js";
import DataService from "../services/service";
import { useFocusEffect } from "@react-navigation/native";

const Todolist = (props) => {
  const textInput = props.textInput || "";

  const [DATA, onChangeDATA] = useState([]);
  const navigation = RootNavigation;

  const getAll = () => {
    DataService.getAll()
      .then((response) => {
        const data = response.data;
        const showedTodo = [];
        if (data !== [] && textInput !== "") {
          data.forEach((value) => {
            if (value.title.toLowerCase().includes(textInput.toLowerCase())) {
              showedTodo.push(value);
            }
          });
          onChangeDATA(showedTodo);
        } else {
          onChangeDATA(data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getAll();
  }, [textInput]);

  useFocusEffect(
    React.useCallback(() => {
      // console.log('focused')
      getAll();
      return () => {
        // console.log('unfocused')
      };
    }, [])
  );

  const [selectedId, setSelectedId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [todo, setTodo] = useState(null);

  const onClickStar = (todo, status) => {
    var data = {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      finished: todo.finished,
      favor: status,
      rtime: todo.rtime,
      uri: todo.uri,
    };

    DataService.update(todo.id, data)
      .then((response) => {
        getAll();
        // console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const Item = ({ item, onPress, prvTitle }) => (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <Text style={[styles.title]}>{prvTitle}</Text>
      <TouchableOpacity
        style={styles.star}
        onPress={() => onClickStar(item, item.favor ? false : true)}
      >
        <FontAwesomeIcon
          size={45}
          color={item.favor ? "#FFD600" : "#EEEEEE"}
          icon={faStar}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const onClick = (item) => {
    setSelectedId(item.id);
    setVisible(true);
    setTodo(item);
  };

  const renderItem = ({ item }) => {
    let previewTitle = item.title;
    if (item.title.length > 15) {
      previewTitle = item.title.slice(0, 16) + "...";
    }

    return (
      <Item item={item} onPress={() => onClick(item)} prvTitle={previewTitle} />
    );
  };

  return (
    <View style={styles.container}>
      {DATA.length !== 0 ? (
        <View style={styles.container}>
          <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            extraData={selectedId}
          />
          <TodoPopup
            visible={visible}
            setVisible={setVisible}
            todo={todo}
            navigation={navigation}
            onChangeDATA={onChangeDATA}
            textInput={textInput}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.no_res}>No result found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    height: "100%",
  },
  item: {
    flexDirection: "row",
    paddingHorizontal: 25,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 25,
    marginBottom: 15,
    alignItems: "center",
    width: "90%",
    height: 65,
    borderRadius: 65 / 2,
    backgroundColor: "#00ADB57D",
    color: "#EEEEEE",
  },
  title: {
    color: "#EEEEEE",
    fontSize: 24,
  },
  no_res: {
    textAlignVertical: "top",
    color: "#00ADB5",
    fontSize: 18,
    alignSelf: "center",
  },
  star: {
    marginLeft: "75%",
    position: "absolute",
    right: 0,
  },
});

export default Todolist;
