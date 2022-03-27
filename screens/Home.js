import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Header from '../components/Header';
import Todolist from '../components/Todolist';

export default function Home() {
  const [textInput, onChangeInput] = useState('');

  return (
    <View testID="first_container" style={styles.container}>
      <Header testID="header" onChangeInput={onChangeInput} />
      <Todolist testID="list" textInput={textInput} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
    color: '#EEEEEE',
  },
});
