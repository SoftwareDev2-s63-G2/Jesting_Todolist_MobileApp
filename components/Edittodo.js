import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
// import CheckBox from "@react-native-community/checkbox";
import CheckBox from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import DataService from "../services/service";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClock, faImage } from "@fortawesome/free-solid-svg-icons";
import * as RootNavigation from "../RootNavigation.js";

const Edittodo = (props) => {
  // console.log(RootNavigation.navigationRef.getCurrentRoute().params.favor);
  const parameters = RootNavigation.navigationRef.getCurrentRoute().params;
  const [state, setState] = useState({
    id: parameters.id,
    title: parameters.title,
    description: parameters.description,
    finished: parameters.finished,
    favor: parameters.favor,
    rtime: parameters.rtime,
    uri: parameters.uri,
  });
  const [selectedTiming, setSelectedTiming] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  var remind_time = "";

  const onChange = (event, selectedValue) => {
    if (Platform.OS === "ios") {
      setShow(Platform.OS === "ios");
      if (mode == "date") {
        const currentDate = selectedValue || new Date();
        setDate(currentDate);
        setMode("time");
      } else {
        const selectedTime = selectedValue || new Date();
        setTime(selectedTime);
        setShow(false);
        setMode("date");
      }
    } else {
      setShow(Platform.OS === "ios");
      if (mode == "date") {
        const currentDate = selectedValue || new Date();
        setDate(currentDate);
        setMode("time");
        setShow(Platform.OS !== "ios");
      } else {
        const selectedTime = selectedValue || new Date();
        setTime(selectedTime);
        setShow(Platform.OS === "ios");
        setMode("date");
      }
    }
    setSelectedTiming(formatDate(date, time));
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera is required");
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }
    setState({ ...state, uri: pickerResult.uri });
    setSelectedImage({ localUri: pickerResult.uri });
  };

  const handler = () => {
    if (selectedImage === null) {
      var uri = { uri: state.uri };
    } else {
      var uri = { uri: selectedImage.localUri };
    }

    var id = state.id;
    var data = {
      title: state.title,
      description: state.description,
      finished: state.finished,
      favor: state.favor,
      rtime: formatDate(date, time),
      uri: uri.uri,
    };
    if (data.title.length == 0) {
      alert("Title field is missing");
    } else {
      DataService.update(id, data)

        .then(() => {
          setState({
            title: data.title,
            description: data.description,
            finished: data.finished,
            favor: data.favor,
            rtime: data.rtime,
            uri: data.imageUri,
          });

          alert("Todo updated");
          RootNavigation.navigate("Home");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const formatDate = (date, time) => {
    let minute_str = time.getMinutes();
    if (time.getMinutes() < 10) {
      minute_str = "0" + time.getMinutes();
    }
    let return_val = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${time.getHours()}:${minute_str}`;

    remind_time = return_val;
    return return_val;
  };

  return (
    <ScrollView>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View>
          <KeyboardAvoidingView>
            <Text style={styles.label}>Title:</Text>
            <TextInput
              multiline={true}
              placeholderTextColor={"#222831"}
              style={styles.input_title}
              placeholder="Enter title"
              value={state.title}
              onChangeText={(newtext) => setState({ ...state, title: newtext })}
            />
            <Text style={styles.label}>Alarm at:</Text>
            <View>
              <TouchableOpacity onPress={showDatepicker}>
                <Text style={styles.remind_time}>
                  {selectedTiming !== null
                    ? formatDate(date, time)
                    : state.rtime + " "}
                  <FontAwesomeIcon size={26} color={"#00ADB5"} icon={faClock} />
                </Text>
              </TouchableOpacity>
            </View>

            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={420}
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
            <Text style={styles.label}>Description:</Text>
            <TextInput
              multiline={true}
              placeholderTextColor={"#222831"}
              style={styles.input_desc}
              placeholder="Enter description"
              value={state.description}
              onChangeText={(newtext) =>
                setState({ ...state, description: newtext })
              }
            />
            <View
              style={{ marginTop: 10, marginBottom: 25, flexDirection: "row" }}
            >
              <Text style={styles.label}>
                Finish:{"\t"}
                {"\t"}
                <CheckBox
                  value={state.finished}
                  onValueChange={() =>
                    setState({ ...state, finished: !state.finished })
                  }
                />
              </Text>

              <Text
                style={{
                  color: "#00ADB5",
                  width: "100%",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginTop: 10,
                  marginLeft: 10,
                }}
              >
                {state.finished ? "Yes" : "No"}
              </Text>
            </View>

            <View
              style={{ marginTop: 10, marginBottom: 25, flexDirection: "row" }}
            >
              <Text style={styles.label}>
                Favourite:{"\t"}
                {"\t"}
                <CheckBox
                  value={state.favor}
                  onValueChange={() =>
                    setState({ ...state, favor: !state.favor })
                  }
                />
              </Text>
              <Text
                style={{
                  color: "#00ADB5",
                  width: "100%",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginTop: 10,
                  marginLeft: 10,
                }}
              >
                {state.favor ? "Yes" : "No"}
              </Text>
            </View>

            <Text style={styles.label}>Upload image:</Text>
            <View>
              {state.uri !== null ? (
                <View>
                  <TouchableOpacity onPress={openImagePickerAsync}>
                    <Image
                      source={{ uri: state.uri }}
                      style={styles.thumbnail}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.clear_img}>
                    <Text
                      style={{
                        color: "#EEEEEE",
                        fontWeight: "bold",
                        fontSize: 13,
                      }}
                      onPress={() => {
                        setState({ ...state, uri: null });
                        setSelectedImage(null);
                      }}
                    >
                      Clear Image
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={openImagePickerAsync}
                  style={styles.button}
                >
                  <FontAwesomeIcon size={60} color={"#00ADB5"} icon={faImage} />
                </TouchableOpacity>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
      <TouchableOpacity style={styles.add_button} onPress={handler}>
        <Text style={styles.button_text}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  finfav: {
    color: "#00ADB5",
    width: "100%",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 25,
    marginLeft: 20,
  },
  label: {
    marginTop: 10,
    marginLeft: 20,
    color: "#00ADB5",
    fontSize: 20,
  },
  input_desc: {
    textAlignVertical: "top",
    marginTop: 10,
    marginBottom: 25,
    marginLeft: "auto",
    marginRight: "auto",
    color: "#222831",
    minHeight: 140,
    width: "90%",
    fontSize: 18,
    borderRadius: 20,
    backgroundColor: "#EEEEEE",
    padding: 10,
  },
  input_title: {
    marginTop: 10,
    marginBottom: 25,
    marginLeft: "auto",
    marginRight: "auto",
    color: "#222831",
    minHeight: 45,
    width: "90%",
    fontSize: 24,
    borderRadius: 25,
    backgroundColor: "#EEEEEE",
    padding: 10,
  },
  remind_time: {
    marginTop: 10,
    marginBottom: 25,
    marginLeft: 20,
    color: "#00ADB5",
    alignItems: "center",
    height: 40,
    fontSize: 28,
    fontWeight: "bold",
  },
  button: {
    marginTop: 55,
    marginBottom: 55,
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center",
    alignContent: "center",
  },
  add_button: {
    backgroundColor: "#00ADB5",
    width: "100%",
    height: 45,
    bottom: 0,
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center",
    alignContent: "center",
  },
  button_text: {
    fontWeight: "bold",
    fontSize: 30,
    color: "#EEEEEE",
    textAlign: "center",
  },
  thumbnail: {
    margin: 10,
    width: 360,
    height: 150,
    resizeMode: "contain",
  },
  clear_img: {
    position: "absolute",
    left: "80%",
    bottom: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    color: "#EEEEEE",
    backgroundColor: "red",
    borderRadius: 25,
  },
});

export default Edittodo;
