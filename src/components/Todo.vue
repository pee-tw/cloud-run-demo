<script setup lang="ts">
import { v4 } from "uuid";
import { onMounted, reactive } from "vue";
import axios from "axios";
import TodoInput from "./TodoInput.vue";

type Todo = {
  id: string;
  display: string;
  completed: boolean;
};

const state = reactive({
  todos: [] as Todo[],
});

const baseURL = import.meta.env.API_URL ?? "http://localhost:3001";
const apiKey = import.meta.env.API_KEY ?? "";

axios.defaults.headers.common["x-api-key"] = apiKey;

const onSubmit = async (display: string) => {
  const id = v4();
  const todo = { id, display, completed: false };
  state.todos.push(todo);
  await axios.post(`${baseURL}/todos`, todo);
};

const remove = async (id: string) => {
  state.todos = state.todos.filter((todo) => todo.id !== id);
  await axios.delete(`${baseURL}/todos/${id}`);
};
const toggleCompleted = async (id: string) => {
  let completed = false;

  state.todos = state.todos.map((todo) => {
    if (todo.id === id) {
      todo.completed = !todo.completed;
      completed = todo.completed;
    }
    return todo;
  });

  await axios.patch(`${baseURL}/todos/${id}`, {
    completed,
  });
};

onMounted(async () => {
  const remoteTodos = await axios.get(`${baseURL}/todos`);
  state.todos = remoteTodos.data;
});
</script>

<template>
  <div>
    <TodoInput @submit="onSubmit" />
    <ul>
      <li
        class="flex row items-center justify-between w-full py-1 px-4 my-1 rounded border bg-gray-100 text-gray-600"
        v-for="todo in state.todos"
      >
        <div class="items-center column">
          <input
            class="mx-1"
            type="checkbox"
            :checked="todo.completed"
            @input="toggleCompleted(todo.id)"
          />
          <span :class="{ 'line-through': todo.completed === true }">{{
            todo.display
          }}</span>
        </div>
        <div class="items-center row-reverse">
          <span class="py-2 float-right" @click="remove(todo.id)"> X </span>
        </div>
      </li>
    </ul>
  </div>
</template>
