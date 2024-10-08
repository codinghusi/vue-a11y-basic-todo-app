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
        { id: 2, description: "Zweiter Todo Punkt", done: false },
        { id: 3, description: "Dritter Todo Punkt", done: false },
      ]
    }
  }
}
</script>

<template>
  <div id="app">
    <Header />

    <main>
      <TodoList :todos="todos" />

      <button class="border rounded p-2 m-4">
        ADD
      </button>
    </main>
  </div>
</template>