import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Pressable } from 'react-native';
import { theme } from './color';
import React, { useState } from "react";
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';

export default function App() {

  const [working, setWorking] = useState(true);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const [text, setText] = useState("null");

  const [adding, setAdding] = useState(false);

  const [toDo, setTodo] = useState({});

  const subMit = () => {
    setAdding(false);
    if (text == "null") {
      return;
    }


    const newTodo = { ...toDo, [Date.now()]: { text, work: working, now: false } };

    setTodo(newTodo);
    setText("null");

  }

  const onChangeText = (event) => {
    setText(event);
  }

  const checking = (id) => {
    setTodo(Object.keys(toDo).map((key) =>
      key === id ? { ...toDo[key], now: !toDo[key].now } : toDo[key]
    ))
  }
  return (
    <View style={{ ...styles.container, backgroundColor: working ? "black" : "white" }}>

      <StatusBar style={working ? "inverted" : "auto"} />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={work}>
          <Text style={{ ...styles.btnText, color: working ? "white" : theme.realGrey }}>Work</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={travel}>
          <Text style={{ ...styles.btnText, color: working ? theme.grey : "black" }}>Travel</Text>
        </TouchableOpacity>

      </View>

      {adding ? (<View>
        <TextInput
          onChangeText={onChangeText}
          multiline={true}
          returnKeyType="done"
          style={styles.input}
          blurOnSubmit={true}
          onSubmitEditing={subMit}
          placeholder={working ? "Add a To Do" : "Add a Travel Plan"}
        ></TextInput>
      </View>) : (<View></View>)}

      <ScrollView style={{ marginTop: 10, }}>
        {Object.keys(toDo).map((key) => (toDo[key].work === working ?

          (<View key={key} style={styles.toDo}>
            <View style={{ flexDirection: "row" }}>
              <Checkbox
                style={styles.checkBox}
                value={toDo[key].now}
                onValueChange={() => checking(key)}
                color={working ? (toDo[key].now === true ? '#E9BD15' : undefined) : (toDo[key].now === true ? '#587558' : undefined)}
              />
              <Text style={{
                ...styles.toDoText,
                color: working ? (toDo[key].now === true ? theme.toDoBg : "white") :
                  (toDo[key].now === true ? "#999999" : "black"), ...(toDo[key].now ? (styles.checked) : (""))
              }}>
                {toDo[key].text}
              </Text>

            </View>
            <Pressable
              onPress={() => console.log("Del")}>
              <AntDesign name="delete" size={24} color="grey" style={styles.delBTN} />
            </Pressable>

          </View>) : null))}
      </ScrollView>

      <View style={{ justifyContent: "center", alignItems: "center", marginVertical: 25, }}>
        {!adding ? (<Pressable
          onPress={() => setAdding(true)}
          style={{ ...styles.add, backgroundColor: working ? "white" : "black" }}>
          <Text style={{ color: working ? "black" : "white", fontSize: 31, fontWeight: "500", }}>+</Text>
        </Pressable>) : (
          <Pressable
            onPress={() => setAdding(false)}
            style={{ ...styles.add, backgroundColor: working ? "white" : "black" }}>
            <MaterialIcons name="delete" size={25} color={working ? "black" : "white"} style={{ marginTop: 8, }} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },

  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 80,
  },

  btnText: {

    fontSize: 44,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 17,
    color: "black",
    borderWidth: 2,
    borderColor: theme.grey,
  },

  add: {
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 0,
    margin: 0,
  },

  toDo: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  toDoText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },

  checkBox: {
    width: 25,
    height: 25,
  },

  checked: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    fontWeight: "600",
  },

  delBTN: {
    alignContent: "flex-end"
  },

});
