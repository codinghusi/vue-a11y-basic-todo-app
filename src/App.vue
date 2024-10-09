<script>
import Header from './components/Header.vue'
import TodoList from './components/TodoList.vue'

const defaultTodos = [
  { id: 1, description: "Erster Todo Punkt",  done: false },
  { id: 2, description: "Zweiter Todo Punkt", done: true },
  { id: 3, description: "Dritter Todo Punkt", done: false },
]

export default {
  components: {
    Header,
    TodoList
  },
  data() {
    return {
      todos: this.load()
    }
  },
  methods: {
    save(todos) {
      localStorage.setItem('todos', JSON.stringify(todos))
    },
    load() {
      const loaded = JSON.parse(localStorage.getItem('todos'))
      if (loaded === null || loaded === undefined || !Array.isArray(loaded)) {
        return defaultTodos
      }
      return loaded
    }
  }
}
</script>

<template>
  <div id="app" class="mx-auto w-1/2">
    <Header />

    <main class="mt-4">
      <TodoList :todos="todos" class="w-full" :controls="true" @update="save" />
    </main>
      
  </div>
</template>