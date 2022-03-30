import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import App from "../App";
import Todolist from "../components/Todolist";
import Addtodo from "../components/Addtodo";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { NavigationContext } from "@react-navigation/native";
import DataService from "../services/service";

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
it("Search Text input", () => {
  jest.useFakeTimers();
  const AppComp = render(<App />);
  const srch_inp = AppComp.getByTestId("search_inp");
  const keyword = "Buy Milk";
  fireEvent.changeText(srch_inp, keyword);
  expect(srch_inp.props.value).toEqual("Buy Milk");
});

describe("Fetching Todo's data and Search Todo", () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  // jest.useFakeTimers();
  const navContext = {
    isFocused: () => true,
    // addListener returns an unscubscribe function.
    addListener: jest.fn(() => jest.fn())
  };

  it("Display Todo", async () => {
    const data = {
      data: [
        {
          createdAt: "2022-03-27T09:16:36.000Z",
          description: "At market",
          favor: false,
          finished: false,
          id: 3,
          rtime: "31/3/2022 4:22",
          title: "test1",
          updatedAt: "2022-03-27T09:18:16.000Z",
          uri: null
        },
        {
          createdAt: "2022-03-27T09:16:36.000Z",
          description: "At market2",
          favor: false,
          finished: false,
          id: 4,
          rtime: "31/3/2022 4:22",
          title: "test2",
          updatedAt: "2022-03-27T09:18:17.000Z",
          uri: null
        }
      ]
    };
    const dataService = jest.spyOn(DataService, "getAll");
    dataService.mockResolvedValue(data);
    const TodoComp = render(
      <NavigationContext.Provider value={navContext}>
        <Todolist />
      </NavigationContext.Provider>
    );
    let testComp;
    await TodoComp.findByTestId("list").then(e => {
      expect(e.props.data).toEqual(data.data);
      testComp = e;
    });
  });

  it("Display Search Todo", async () => {
    const data = {
      data: [
        {
          createdAt: "2022-03-27T09:16:36.000Z",
          description: "At market",
          favor: false,
          finished: false,
          id: 3,
          rtime: "31/3/2022 4:22",
          title: "test1",
          updatedAt: "2022-03-27T09:18:16.000Z",
          uri: null
        },
        {
          createdAt: "2022-03-27T09:16:36.000Z",
          description: "At market2",
          favor: false,
          finished: false,
          id: 4,
          rtime: "31/3/2022 4:22",
          title: "test2",
          updatedAt: "2022-03-27T09:18:17.000Z",
          uri: null
        }
      ]
    };
    const dataService = jest.spyOn(DataService, "getAll");
    dataService.mockResolvedValue(data);
    const keyword = "test2";
    const TodoComp = render(
      <NavigationContext.Provider value={navContext}>
        <Todolist textInput={keyword} />
      </NavigationContext.Provider>
    );
    await TodoComp.findByTestId("list").then(e => {
      expect(e.props.data).toEqual([data.data[1]]);
      expect(e.props.data.length).toBe(1);
    });
  });
});
describe("Adding Todo", () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  // jest.useFakeTimers();
  const navContext = {
    isFocused: () => true,
    // addListener returns an unscubscribe function.
    addListener: jest.fn(() => jest.fn())
  };

  it("navigate to Adding page", async () => {
    jest.useFakeTimers();
    const component = render(<App />);
    const { getByTestId, findByText } = component;
    const add_btn = getByTestId("add_btn"); // Screen Header Todolist Add Button
    fireEvent.press(add_btn);
    const newScreen = await findByText("Add todo"); // Screen Add todo
    expect(newScreen).toBeTruthy();
  });
  // it("Fill Adding Form", async () => {
  //   jest.useFakeTimers();
  //   const AddForm = render(
  //     <NavigationContext.Provider value={navContext}>
  //       <Addtodo />
  //     </NavigationContext.Provider>
  //   );
  //   const title_inp = AddForm.getByTestId("title_input");
  //   fireEvent.changeText(title_inp, "Jest Test");
  //   expect(title_inp.props.value).toEqual("Jest Test");
  //   const desc_inp = AddForm.getByTestId("description_input");
  //   fireEvent.changeText(desc_inp, "Testing Adding form by insert text.");
  //   expect(desc_inp.props.value).toEqual("Testing Adding form by insert text.");
  //   const dateTimeButton = AddForm.getByTestId("dateTime_btn");
  //   fireEvent.press(dateTimeButton);
  //   expect(await AddForm.findByTestId("dateTimePicker")).toBeDefined();
  // });
});
describe("Testing modal", () => {
  const navContext = {
    isFocused: () => true,
    // addListener returns an unscubscribe function.
    addListener: jest.fn(() => jest.fn())
  };
  it("Testing Modal popup", async () => {
    const data = {
      data: [
        {
          createdAt: "2022-03-27T09:16:36.000Z",
          description: "At market",
          favor: false,
          finished: false,
          id: 3,
          rtime: "31/3/2022 4:22",
          title: "Buy Milk",
          updatedAt: "2022-03-27T09:18:16.000Z",
          uri: null
        },
        {
          createdAt: "2022-03-27T09:16:36.000Z",
          description: "At School",
          favor: false,
          finished: false,
          id: 4,
          rtime: "31/3/2022 4:22",
          title: "Study English",
          updatedAt: "2022-03-27T09:18:16.000Z",
          uri: null
        }
      ]
    };
    const dataService = jest.spyOn(DataService, "getAll");
    dataService.mockResolvedValue(data);

    const TodoComp = render(
      <NavigationContext.Provider value={navContext}>
        <Todolist />
      </NavigationContext.Provider>
    );
    const item = await TodoComp.findByTestId("item3"); // can get data
    fireEvent.press(item);
    expect(await TodoComp.findByTestId("Modal-popup-title")).toBeDefined();
    expect(
      await TodoComp.findByText("Description : " + data.data[0].description) //data[0] -> id : 3
    ).toBeDefined();
  });
});
