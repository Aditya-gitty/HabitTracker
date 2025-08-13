import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [habit, setHabit] = useState("");
  const [habits, setHabits] = useState([]);

  // Load saved habits
  useEffect(() => {
    loadHabits();
  }, []);

  // Save habits whenever they change
  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const saveHabits = async (data) => {
    try {
      await AsyncStorage.setItem("habits", JSON.stringify(data));
    } catch (error) {
      console.log("Error saving habits:", error);
    }
  };

  const loadHabits = async () => {
    try {
      const saved = await AsyncStorage.getItem("habits");
      if (saved) setHabits(JSON.parse(saved));
    } catch (error) {
      console.log("Error loading habits:", error);
    }
  };

  const addHabit = () => {
    if (habit.trim() === "") return;
    setHabits([...habits, { id: Date.now().toString(), name: habit, done: false }]);
    setHabit("");
  };

  const toggleHabit = (id) => {
    setHabits(
      habits.map((h) =>
        h.id === id ? { ...h, done: !h.done } : h
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>💪 Habit Tracker</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter habit"
          value={habit}
          onChangeText={setHabit}
        />
        <TouchableOpacity style={styles.addButton} onPress={addHabit}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.habitItem, item.done && styles.habitDone]}
            onPress={() => toggleHabit(item.id)}
          >
            <Text style={styles.habitText}>
              {item.done ? "✅ " : "⬜ "} {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  inputContainer: { flexDirection: "row", marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 10 },
  addButton: { backgroundColor: "#2196F3", paddingHorizontal: 20, justifyContent: "center", borderRadius: 8, marginLeft: 10 },
  addButtonText: { color: "white", fontWeight: "bold" },
  habitItem: { padding: 10, backgroundColor: "#fff", borderRadius: 8, marginBottom: 8 },
  habitDone: { backgroundColor: "#d4edda" },
  habitText: { fontSize: 16 },
});
