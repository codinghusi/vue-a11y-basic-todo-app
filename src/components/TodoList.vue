<script setup>
import ScreenReaderAnnouncer from "./ScreenReaderAnnouncer.vue";
import TodoEntry from "./TodoEntry.vue";
import TodoFilters from "./TodoFilters.vue";
</script>

<template>
  <div class="flex flex-col gap-3">
    <ScreenReaderAnnouncer ref="announcer" />

    <TodoFilters v-model="setFilter" v-if="filters" />

    <!-- Todo List -->
    <ul
      class="w-full flex flex-col gap-2"
      :aria-label="`${
        setFilter === 'none'
          ? 'all'
          : setFilter === 'finished'
          ? 'finished'
          : 'unfinished'
      } todos`"
    >
      <li v-for="(todo, index) in filteredTodos" :key="todo.id">
        <TodoEntry
          :todo="todo"
          :isFirst="index === 0"
          :isLast="index === filteredTodos.length - 1"
          :position="index + 1"
          :ref="`entry-${index}`"
          @moveUp="onMoveUp(todo, index)"
          @moveDown="onMoveDown(todo, index)"
          @updateDescription="
            (value) => onUpdateDescription(todo, index, value)
          "
          @updateDoneState="(value) => onUpdateDoneState(todo, index, value)"
          @deleteEntry="onDelete(todo, index)"
          @enteringEditMode="onEnteringEditMode(todo, index)"
        />
      </li>
    </ul>

    <!-- Add Button -->
    <div class="flex justify-end" v-if="controls">
      <button
        class="btn btn-primary"
        @click="addRow"
        aria-label="add a new todo"
      >
        Add todo entry <v-icon icon="plus" />
      </button>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  props: {
    todoList: {
      required: true,
      type: Array,
    },
    controls: {
      type: Boolean,
    },
    filters: {
      type: Boolean,
    },
  },
  components: {
    "v-icon": FontAwesomeIcon,
  },
  data() {
    return {
      rowInEditMode: null,
      editinigDescription: "",
      nextId: Math.max(...this.todoList.map((todo) => todo.id)) + 1,
      setFilter: "none",
      announcementMessage: "",
      announcementDebounce: null,
      todos: this.todoList,
    };
  },
  computed: {
    filteredTodos() {
      return this.todos.filter(
        (todo) =>
          this.setFilter === "none" ||
          (this.setFilter === "finished" && todo.done) ||
          (this.setFilter === "unfinished" && !todo.done)
      );
    },
  },
  methods: {
    onMoveUp(todo, index) {
      if (index <= 0 || index >= this.todos.length) {
        return;
      }
      this.todos.splice(index - 1, 2, this.todos[index], this.todos[index - 1]);
      this.emitUpdate();
      this.$nextTick(() => {
        if (index <= 1) {
          this.$refs[`entry-${index - 1}`][0].focusElement("down-button");
        } else {
          this.$refs[`entry-${index - 1}`][0].focusElement("up-button");
        }
      });
      this.announce(
        `moved entry up from position ${index + 1} to ${index}` +
          (index <= 1 ? "reached top, you are now on the move down button" : "")
      );
    },

    onMoveDown(todo, index) {
      if (index < 0 || index + 1 >= this.todos.length) {
        return;
      }
      this.todos.splice(index, 2, this.todos[index + 1], this.todos[index]);
      this.$nextTick(() => {
        if (index + 2 >= this.todos.length) {
          this.$refs[`entry-${index + 1}`][0].focusElement("up-button");
        } else {
          this.$refs[`entry-${index + 1}`][0].focusElement("down-button");
        }
      });
      this.announce(
        `moved entry down from position ${index + 1} to ${index + 2}` +
          (index + 2 >= this.todos.length
            ? "reached bottom, you are now on the move up button"
            : "")
      );
      this.emitUpdate();
    },

    onUpdateDescription(todo, index, value) {
      todo.description = value;
      this.announce("saved description for entry");
      this.emitUpdate();
    },

    onUpdateDoneState(todo, index, value) {
      todo.done = value;
      this.emitUpdate();
      this.announce(`entry set to ${value ? "finished" : "unfinished"}`);
    },

    onDelete(todo, index) {
      this.todos.splice(this.todos.indexOf(todo), 1);
      const nextIndex = index === this.todos.length ? index - 1 : index;
      if (nextIndex >= 0) {
        this.$nextTick(() =>
          this.$refs[`entry-${nextIndex}`][0].focusElement("finish-checkbox")
        );
      }
      this.announce(
        `deleted entry at position ${index + 1}, you are now on the next entry`
      );
      this.emitUpdate();
    },

    addRow() {
      const newTodo = {
        id: this.nextId++,
        description: "",
        done: false,
        isNew: true,
      };
      this.todos.push(newTodo);
      this.announce("Added new entry. Type in the description.");
    },

    emitUpdate() {
      this.$emit("update", this.todos);
    },

    announce(message) {
      this.$refs.announcer.announce(message);
      console.log(`announcement: ${message}`);
    },
  },
};
</script>

<style scoped>
@import "../assets/button.css";
</style>
