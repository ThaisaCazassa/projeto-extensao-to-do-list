import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {

  const [task, setTask] = useState("");
  const [listTask, setListTask] = useState<{ text: string }[]>([]);
  const [doneTasks, setDoneTasks] = useState<{ text: string }[]>([]);

  useEffect(() => {
    async function loadData() {
      const savedList = await AsyncStorage.getItem("listTask");
      const savedDone = await AsyncStorage.getItem("doneTasks");
      if (savedList) setListTask(JSON.parse(savedList));
      if (savedDone) setDoneTasks(JSON.parse(savedDone));
    }
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("listTask", JSON.stringify(listTask));
    AsyncStorage.setItem("doneTasks", JSON.stringify(doneTasks));
  }, [listTask, doneTasks]);

  function addToTask() {
    if (task.trim() === "") return;
    setListTask([...listTask, { text: task }]);
    setTask("");
  }

  function removeFromTask(index: number) {
    setListTask(listTask.filter((_, i) => i !== index));
  }

  function removeFromDone(index: number) {
    setDoneTasks(doneTasks.filter((_, i) => i !== index));
  }

  function markAsDone(index: number) {
    const taskDone = listTask[index];
    setDoneTasks([...doneTasks, taskDone]);
    removeFromTask(index);
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.contentHeader}>

          <TextInput
            value={task}
            onChangeText={setTask}
            style={styles.input}
            placeholder="Adicione uma nova tarefa"
            placeholderTextColor="#FFF"
          />

          <TouchableOpacity
            onPress={addToTask}
            style={styles.button}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>

        </View>

        {/* Tarefas a fazer */}
        <Text style={styles.sectionTitle}>Tarefas a fazer:</Text>
        <FlatList
          data={listTask}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <View style={styles.textContainer}>
                <Text
                  style={styles.textCardList}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.text}
                </Text>
              </View>
              <View style={styles.iconCardList}>
                <TouchableOpacity onPress={() => markAsDone(index)}>
                  <MaterialIcons name="done" size={24} color="#9E78CF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeFromTask(index)}>
                  <MaterialIcons
                    name="delete-outline"
                    size={24}
                    color="#9E78CF"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {/* Tarefas concluídas */}
        <Text style={styles.sectionTitle}>Tarefas concluídas:</Text>
        <FlatList
          data={doneTasks}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <View style={styles.textContainer}>
                <Text
                  style={styles.textDone}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.text}
                </Text>
              </View>
              <View style={styles.iconCardList}>
                <TouchableOpacity onPress={() => removeFromDone(index)}>
                  <MaterialIcons
                    name="delete-outline"
                    size={24}
                    color="#9E78CF"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0D0714",
    paddingHorizontal: 30,
    paddingVertical: 50,
  },

  content: {
    backgroundColor: "#1D1825",
    flex: 1,
    width: "100%",
    borderRadius: 20,
    padding: 20,
    gap: 25,
    elevation: 5
  },

  contentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  buttonText: {
    color: "#FFFFFF"
  },

  input: {
    padding: 10,
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#9E78CF",
    color: "#FFFFFF"
  },

  button: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#9E78CF"
  },

  textCardList: {
    color: "#9E78CF",
  },

  textDone: {
    color: "#FFFFFF",
    textDecorationLine: "line-through",
  },

  card: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#15101C",
    flexDirection: "row",
    elevation: 5,
    marginVertical: 7,
    justifyContent: "space-between"
  },

  iconCardList: {
    flexDirection: "row",
    gap: 10
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },

  textContainer: {
    flex: 1,
    marginRight: 5,
  },

});