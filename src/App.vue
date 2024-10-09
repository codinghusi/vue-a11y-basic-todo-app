<script>
import Header from './components/Header.vue'
import TodoList from './components/TodoList.vue'

export default {
  components: {
    Header,
    TodoList
  },
  data() {
    return {
      todos: [
        { id: 1, description: "Erster Todo Punkt",  done: false },
        { id: 2, description: "Zweiter Todo Punkt", done: true },
        { id: 3, description: "Dritter Todo Punkt", done: false },
      ]
    }
  }
}
</script>

<template>
  <div id="app" class="mx-auto w-1/2">
    <Header />

    <main class="mt-4">
      <TodoList :todos="todos" class="w-full" />

      <div class="flex justify-end">
        <button class="border rounded p-2 mt-4">
          add
        </button>
      </div>
    </main>
      
  </div>
</template>