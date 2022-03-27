import React, {useState} from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import Todolist from './components/Todolist';
import Header from './components/Header';
//jest.mock('./services/service');
import DataService from './services/service';
jest.useFakeTimers();
jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: '',
}));
jest.mock('./RootNavigation.js');
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useFocusEffect: jest.fn(),
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
    }),
  };
});

const data = ['Test1', 'Test2', 'Test3'];
const dataService = jest.spyOn(DataService, 'getAll');
dataService.mockResolvedValue(data);
//jest.setTimeout(100000);
describe('Hello', () => {
  it('Seacrh Text input', () => {
    const HeaderComp = render(
      <Header onChangeText={jest.fn()} onChangeInput={jest.fn()} />,
    );
    const srch_btn = HeaderComp.getByTestId('search_btn');
    const srch_inp = HeaderComp.getByTestId('search_inp');
    const keyword = 'dasdad';
    fireEvent.changeText(srch_inp, keyword);
    fireEvent.press(srch_btn);
    // console.log(srch_inp.props.value);
    expect(srch_inp.props.value).toEqual('dasdad');
  });
  it('Checking flatlist after search', () => {
    const HeaderComp = render(
      <Header onChangeText={jest.fn()} onChangeInput={jest.fn()} />,
    );
    const srch_btn = HeaderComp.getByTestId('search_btn');
    const srch_inp = HeaderComp.getByTestId('search_inp');
    const keyword = 'dasdad';
    fireEvent.changeText(srch_inp, keyword);
    fireEvent.press(srch_btn);
    const {getByTestId, asFragment} = render(<Todolist />);
    const listNode = waitFor(() => getByTestId('flatlist'));
    console.log(listNode);
    // expect(listNode.children).toHaveLength(2);
    // expect(asFragment()).toMatchSnapshot();
  });
});
