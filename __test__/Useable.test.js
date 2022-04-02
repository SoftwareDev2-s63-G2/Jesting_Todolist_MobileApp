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
///////////////////////////////////////////////////////////////////////////////////////////
describe("Observing Todolist", () => {
  it("Display Todo", async () => {
    const TodoComp = render(
      <NavigationContext.Provider value={navContext}>
        <Todolist />
      </NavigationContext.Provider>
    );
    let testComp;
    await TodoComp.findByTestId("list").then((e) => {
      expect(e.props.data).toEqual(MockResponse.data);
      testComp = e;
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
    jest.useFakeTimers();
    const component = render(<App />);
    const { getByTestId, findByText } = component;
    const add_btn = getByTestId("add_btn"); // Screen Header Todolist Add Button
    fireEvent.press(add_btn);
    const newScreen = await findByText("Add todo"); // Screen Add todo
    expect(newScreen).toBeTruthy();
  });
  it("Fill Adding Form", async () => {
    jest.useFakeTimers();
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
