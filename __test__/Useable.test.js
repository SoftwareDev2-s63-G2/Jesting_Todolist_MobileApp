import React from "react";
import {
  fireEvent,
  render,
  waitFor,
  act,
  cleanup,
} from "@testing-library/react-native";
import { View, Alert } from "react-native";
import App from "../App";
import Todolist from "../components/Todolist";
import Addtodo from "../components/Addtodo";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { NavigationContext } from "@react-navigation/native";
import DataService from "../services/service";

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
jest.mock("@react-native-community/datetimepicker", () => {
  const React = require("react");
  const RealComponent = jest.requireActual(
    "@react-native-community/datetimepicker"
  );

  class Picker extends React.Component {
    render() {
      return React.createElement("Picker", this.props, this.props.children);
    }
  }

  Picker.propTypes = RealComponent.propTypes;
  return Picker;
});
const navContext = {
  isFocused: () => true,
  // addListener returns an unscubscribe function.
  addListener: jest.fn(() => jest.fn()),
};
const MockResponse = {
  data: [
    {
      createdAt: "2022-03-27T09:16:36.000Z",
      description: "At market",
      favor: false,
      finished: false,
      id: 3,
      rtime: "31/3/2022 4:22",
      title: "Buy book",
      updatedAt: "2022-03-27T09:18:16.000Z",
      uri: null,
    },
    {
      createdAt: "2022-03-27T09:16:36.000Z",
      description: "At market2",
      favor: false,
      finished: false,
      id: 4,
      rtime: "31/3/2022 4:22",
      title: "Buy milk",
      updatedAt: "2022-03-27T09:18:17.000Z",
      uri: null,
    },
  ],
};
const deletedMessage = { message: "Todo was deleted successfully!" };
const spyAlert = jest.spyOn(Alert, "alert");
const getAllService = jest.spyOn(DataService, "getAll");
const updateService = jest.spyOn(DataService, "update");
const createService = jest.spyOn(DataService, "create");
const deleteService = jest.spyOn(DataService, "delete");
beforeEach(() => {
  getAllService.mockResolvedValue(MockResponse);
  deleteService.mockResolvedValue(deletedMessage);
});
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});
jest.useFakeTimers();
///////////////////////////////////////////////////////////////////////////////////////////
describe("Observing Todolist", () => {
  it("Display Todo", async () => {
    const TodoComp = render(
      <NavigationContext.Provider value={navContext}>
        <Todolist />
      </NavigationContext.Provider>
    );
    await TodoComp.findByTestId("list").then((e) => {
      expect(e.props.data).toEqual(MockResponse.data);
    });
  });
  it("Testing Modal popup", async () => {
    const TodoComp = render(
      <NavigationContext.Provider value={navContext}>
        <Todolist />
      </NavigationContext.Provider>
    );
    const item = await TodoComp.findByTestId("item3"); // can get data
    fireEvent.press(item);
    expect(await TodoComp.findByTestId("Modal-popup-title")).toBeDefined();
    expect(
      await TodoComp.findByText(
        "Description : " + MockResponse.data[0].description
      ) //data[0] -> id : 3
    ).toBeDefined();
  });
});
///////////////////////////////////////////////////////////////////////////////////////////
describe("Searching Todo", () => {
  it("Tesitng Search Textinput", () => {
    const AppComp = render(<App />);
    const srch_inp = AppComp.getByTestId("search_inp");
    const keyword = "Buy milk";
    fireEvent.changeText(srch_inp, keyword);
    expect(srch_inp.props.value).toEqual("Buy milk");
  });
  it("Display Search Todo", async () => {
    const keyword = "Buy milk";
    const TodoComp = render(
      <NavigationContext.Provider value={navContext}>
        <Todolist textInput={keyword} />
      </NavigationContext.Provider>
    );
    await TodoComp.findByTestId("list").then((e) => {
      expect(e.props.data).toEqual([MockResponse.data[1]]);
      expect(e.props.data.length).toBe(1);
    });
  });
});
///////////////////////////////////////////////////////////////////////////////////////////
describe("Adding Todo", () => {
  it("navigate to Adding page", async () => {
    const component = render(<App />);
    const { getByTestId, findByText } = component;
    const add_btn = getByTestId("add_btn"); // Screen Header Todolist Add Button
    fireEvent.press(add_btn);
    const newScreen = await findByText("Add todo"); // Screen Add todo
    expect(newScreen).toBeTruthy();
  });
  it("Fill Adding Form", async () => {
    const AddForm = render(
      <NavigationContext.Provider value={navContext}>
        <Addtodo />
      </NavigationContext.Provider>
    );
    const title_inp = AddForm.getByTestId("title_input");
    fireEvent.changeText(title_inp, "Jest Test");
    expect(title_inp.props.value).toEqual("Jest Test");
    const desc_inp = AddForm.getByTestId("description_input");
    fireEvent.changeText(desc_inp, "Testing Adding form by insert text.");
    expect(desc_inp.props.value).toEqual("Testing Adding form by insert text.");
    const dateTimeButton = AddForm.getByTestId("dateTime_btn");
    fireEvent.press(dateTimeButton);
    const Timepicker = await AddForm.findByTestId("dateTimePicker");
    // fireEvent(Timepicker, 'onChange', null, date)
    const date = new Date(156e10);
    const MockedDate = date
      .toLocaleString("el-GR", {
        day: "numeric", // numeric, 2-digit
        year: "numeric", // numeric, 2-digit
        month: "numeric", // numeric, 2-digit, long, short, narrow
        hour: "numeric", // numeric, 2-digit
        minute: "numeric", // numeric, 2-digit
        hour12: false,
      })
      .replace(",", "");
    //change Date
    fireEvent(Timepicker, "onChange", null, date);
    //change Time
    fireEvent(Timepicker, "onChange", null, date);
    expect(await AddForm.findByText(MockedDate)).toBeTruthy();
    //wait for image test
    const submit_btn = await AddForm.findByTestId("submit");
    fireEvent.press(submit_btn);
    expect(createService).toBeCalledWith(
      expect.objectContaining({
        title: "Jest Test",
        description: "Testing Adding form by insert text.",
        rtime: MockedDate,
        uri: null,
      })
    );
  });
});
///////////////////////////////////////////////////////////////////////////////////////////
describe("Editing Todo", () => {
  it("Edit page", async () => {
    //Todo : navigate to edit page
    const component = render(<App />);
    const { getByTestId, findByText, findByTestId } = component;
    const item = await findByTestId("item4");
    fireEvent.press(item);
    edit_btn = getByTestId("Edit_btn");
    expect(edit_btn).toBeDefined();
    fireEvent.press(edit_btn);
    edit_page = await findByText("Edit todo");
    expect(edit_page).toBeTruthy();

    //Todo : show correct data
    const test_data = 1;
    const title_val = getByTestId("title_input").props.value;
    expect(title_val).toEqual(MockResponse.data[test_data].title);
    const desc_val = getByTestId("description_input").props.value;
    expect(desc_val).toEqual(MockResponse.data[test_data].description);
    let rtime_val = getByTestId("rtime").props.children[0];
    rtime_val = rtime_val.slice(0, rtime_val.length - 1);
    expect(rtime_val).toEqual(MockResponse.data[test_data].rtime);
    const status = getByTestId("status").props.children == "Yes" ? true : false;
    expect(status).toEqual(MockResponse.data[test_data].finished);
    const favor = getByTestId("favor").props.children == "Yes" ? true : false;
    expect(favor).toEqual(MockResponse.data[test_data].favor);
    const uri = getByTestId("image_container").props.value;
    expect(uri).toEqual(MockResponse.data[test_data].uri);

    //Todo : edit data
    const title_inp = getByTestId("title_input");
    const desc_inp = getByTestId("description_input");
    const rtime_btn = getByTestId("dateTime_btn");
    fireEvent.changeText(title_inp, "Do Homework");
    expect(title_inp.props.value).toEqual("Do Homework");
    fireEvent.changeText(desc_inp, "At home");
    expect(desc_inp.props.value).toEqual("At home");
    const status_cb = getByTestId("status_cb");
    fireEvent.press(status_cb);
    expect(status_cb.props.accessibilityState.checked).toEqual(
      !MockResponse.data[test_data].finished
    );
    const favor_cb = getByTestId("favor_cb");
    fireEvent.press(favor_cb);
    expect(favor_cb.props.accessibilityState.checked).toEqual(
      !MockResponse.data[test_data].favor
    );

    fireEvent.press(rtime_btn);
    const Timepicker = await findByTestId("dateTimePicker");
    const date = new Date(156e10);
    const MockedDate = date
      .toLocaleString("el-GR", {
        day: "numeric",
        year: "numeric",
        month: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      })
      .replace(",", "");
    fireEvent(Timepicker, "onChange", null, date); //date
    fireEvent(Timepicker, "onChange", null, date); //time

    //Todo : update when submitted
    const submit_btn = getByTestId("submit_btn");
    fireEvent.press(submit_btn);
    expect(updateService).toBeCalledWith(
      4,
      expect.objectContaining({
        description: "At home",
        favor: !MockResponse.data[test_data].favor,
        finished: !MockResponse.data[test_data].finished,
        rtime: MockedDate,
        title: "Do Homework",
        uri: null,
      })
    );
  });
});
///////////////////////////////////////////////////////////////////////////////////////////
describe("Deleting Todo", () => {
  it("Delete Todo via TodoPopip", async () => {
    const TodoComp = render(
      <NavigationContext.Provider value={navContext}>
        <Todolist />
      </NavigationContext.Provider>
    );
    const item = await TodoComp.findByTestId("item3"); // can get data
    fireEvent.press(item);
    expect(await TodoComp.findByTestId("Modal-popup-title")).toBeDefined();
    const deleteButton = TodoComp.getByTestId("delete_btn"); // testID='delete_btn' at >faTrash< icon.
    fireEvent.press(deleteButton);
    await spyAlert.mock.calls[0][2][1].onPress();
    expect(deleteService).toHaveBeenCalledTimes(1);
    expect(deleteService).toBeCalledWith(MockResponse.data[0].id);
    expect(getAllService).toHaveBeenCalledTimes(2); // first call at app start (when Todolist is created) , second call at after delete
  });
});
///////////////////////////////////////////////////////////////////////////////////////////
describe("Update favorite Todo", () => {
  it("Press on star Icon", async () => {
    const TodoComp = render(
      <NavigationContext.Provider value={navContext}>
        <Todolist />
      </NavigationContext.Provider>
    );
    const Favorite_btn = await TodoComp.findByTestId("star3");
    fireEvent.press(Favorite_btn);
    expect(updateService).toBeCalledWith(
      3,
      expect.objectContaining({
        description: "At market",
        favor: true,
        finished: false,
        id: 3,
        rtime: "31/3/2022 4:22",
        title: "Buy book",
        uri: null,
      })
    );
  });
});
