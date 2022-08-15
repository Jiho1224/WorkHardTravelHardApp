import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Pressable, Alert } from 'react-native';
import { theme } from './color';
import React, { useEffect, useState } from "react";
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';


const KEY = "@toDos";
let today="";


export default function App() {

  const [working, setWorking] = useState(true);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const [text, setText] = useState("null");

  const [adding, setAdding] = useState(false);

  const [toDo, setTodo] = useState({});

  const saveToDos = async (toSave) => {
    const s = JSON.stringify(toSave);
    await AsyncStorage.setItem(KEY, s);
  };

  const loadToDos = async () => {
    // AsyncStorage.clear();
    try {
      const s = await AsyncStorage.getItem(KEY);
      setTodo(JSON.parse(s));
      const cur = new Date();
      const year = cur.getFullYear();
      const month = cur.getMonth()+1;
      const date = cur.getDate();

      today = `${year}.${month}.${date}`;

      
    } catch (e) {
      Alert.alert("Sorry");
    }

  }

  useEffect(() => {
    loadToDos();
  }, []);

  const subMit = async () => {
    setAdding(false);
    if (text == "null") {
      return;
    }


    const newTodo = { ...toDo, [Date.now()]: { text, work: working, now: false,date:today } };

    setTodo(newTodo);
    await saveToDos(newTodo);
    setText("null");

    console.log(newTodo);

  }

  const onChangeText = (event) => {
    setText(event);
  }

  const checking = async (id) => {

    const newTodo = Object.keys(toDo).map((key) =>
      key === id ? { ...toDo[key], now: !toDo[key].now } : toDo[key]
    )
    setTodo(newTodo);
    await saveToDos(newTodo);
  }

  const delTodo = async (id) => {
    const newTodos = { ...toDo };
    delete newTodos[id];
    setTodo(newTodos);
    await saveToDos(newTodos);
  }

  const delAllCheck = async () => {
    Alert.alert('삭제', '체크된 항목을 모두 삭제하시겠습니까?', [
      {
        text: 'Cancel',
        style: 'cancel'
      }, {
        text: 'OK',
        onPress: async () => {
          const newTodo = { ...toDo };
          Object.keys(newTodo).map((key) =>
            (toDo[key].now === true) && (toDo[key].work === working) ? delete newTodo[key] : null);

          setTodo(newTodo);
          await saveToDos(newTodo);
        }
      }
    ]);
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
        {working?(<View>
          <Text style={{color:"white", fontWeight:"600",
        fontSize:20}}>Today</Text>
        <View style={{flex:1, height:1, width:"93%", backgroundColor:"white",marginTop:5,marginBottom:10,}}></View>
        </View>):null}

        
        {Object.keys(toDo).map((key) => ((toDo[key].work === working ) ?
        (toDo[key].date !== today && working === true)? null:
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
              onPress={() => delTodo(key)}
              onLongPress={delAllCheck}>
              <AntDesign name="delete" size={24} color="grey" style={styles.delBTN} />
            </Pressable>

          </View>) : null))}
          
          {working?(<View>
          <Text style={{color:"white",fontWeight:"600",
        fontSize:20,marginTop:15,}}>미뤄둔 일</Text>
        <View style={{flex:1, height:1, width:"93%", backgroundColor:"white",marginTop:5,marginBottom:10,}}>
        </View>
        </View>):null}
        

          {Object.keys(toDo).map((key) => ((toDo[key].work === working && working === true && toDo[key].date !== today ) ?
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
              onPress={() => delTodo(key)}
              onLongPress={delAllCheck}>
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
    marginTop: 75,
    marginBottom: 5,
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
    marginTop: 5,
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

  clearBTN: {
    backgroundColor: theme.realGrey,
    width: 80,
    height: 30,
    marginTop: 40,
    borderRadius: 30,
    padding: 5,
    paddingLeft: 7,
  },


});
