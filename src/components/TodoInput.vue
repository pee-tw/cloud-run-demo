<script setup lang="ts">
import { reactive } from "vue";

const state = reactive({
  todoItem: "",
});

const emit = defineEmits<{
  (e: "submit", value: string): void;
}>();

const submit = () => {
  emit("submit", state.todoItem);
  state.todoItem = "";
};
</script>

<template>
  <input
    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    type="text"
    placeholder="What needs to be done?"
    v-model="state.todoItem"
    @keyup.enter="submit"
  />
</template>
