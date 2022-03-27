import React from "react"
import { fireEvent, render } from "@testing-library/react-native"
import App from "../App"

it('Search Text input', () => {
    jest.useFakeTimers();
    const AppComp = render(
        <App />,
    );
    const srch_inp = AppComp.getByTestId('search_inp');
    const keyword = 'dasdad';
    fireEvent.changeText(srch_inp, keyword);
    expect(srch_inp.props.value).toEqual('dasdad');
});

it('Search Text input 2', () => {
    jest.useFakeTimers();
    const AppComp = render(
        <App />,
    );
    const srch_inp = AppComp.getByTestId('search_inp');
    const keyword = 'dasdad';
    fireEvent.changeText(srch_inp, keyword);
    expect(srch_inp.props.value).not.toEqual('ABCD');
});

describe("Testing Navigate",() => {
    jest.useFakeTimers();
    it("Not click add on screen header todolist", async () => {
        const component = render(
        <App/>
        );
        const { findByText } = (component)
        try{
            await findByText("Add todo"); // Screen Add todo
        }
        catch(e){
            console.log(e)
        }
    });

    it("click add on screen header todolist", async () => {
        const component = render(
        <App/>
        );
        const { getByTestId , findByText } = (component)
        const add_btn = getByTestId('add_btn'); // Screen Header Todolist Add Button
        fireEvent.press(add_btn);
        const newScreen = await findByText("Add todo"); // Screen Add todo
        expect(newScreen).toBeTruthy();
    });
});
