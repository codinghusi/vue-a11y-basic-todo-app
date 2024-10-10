<script setup>
import ScreenReaderAnnouncer from './ScreenReaderAnnouncer.vue';
import TodoEntry from './TodoEntry.vue';
import TodoFilters from './TodoFilters.vue';
</script>

<template>
    <div class="flex flex-col gap-3">
        <ScreenReaderAnnouncer ref="announcer" />
        
        <TodoFilters v-model="setFilter" v-if="filters" />

        <!-- Todo List -->
        <ul class="w-full flex flex-col gap-2" :aria-label="`${setFilter === 'none'
                ? 'all'
                : setFilter === 'finished'
                    ? 'finished'
                    : 'unfinished'
            } todos`">
            <li v-for="(todo, index) in filteredTodos" :key="todo.id">
                <TodoEntry
                    :todo="todo"
                    :isFirst="index === 0"
                    :isLast="index === filteredTodos.length - 1"
                    :position="index + 1"

                    @moveUp="onMoveUp"
                    @moveDown="onMoveDown"
                    @updateDescription="onUpdateDescription"
                    @updateDoneState="onUpdateDoneState"
                    @deleteEntry="onDelete"
                    @enteringEditMode="onEnteringEditMode"
                    />
            </li>
            
        </ul>

        <!-- Add Button -->
        <div class="flex justify-end" v-if="controls">
            <button class="btn btn-primary" @click="addRow" aria-label="add a new todo">
                Add todo entry <v-icon icon="plus" />
            </button>
        </div>
    </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

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
        'v-icon': FontAwesomeIcon
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
            return this.todos.filter(this.checkFilterOn);
        },
    },
    methods: {

        onMoveUp() {

        },
        onMoveDown() {

        },
        onUpdateDescription() {

        },
        onUpdateDoneState() {

        },
        onDelete() {

        },
        onEnteringEditMode() {
            
        },


        isRowInEditMode(todo) {
            return this.rowInEditMode?.id === todo.id;
        },
        putRowInEditMode(todo) {
            this.rowInEditMode = todo;
            this.editinigDescription = todo.description;
            Promise.resolve().then(() => {
                this.saveTabIndex();
                this.$refs.editableDescription?.[0]?.focus();
            });
        },
        doneEditMode() {
            this.rowInEditMode.description = this.editinigDescription;
            if (this.rowInEditMode.isNew) {
                delete this.rowInEditMode.isNew;
            }
            this.rowInEditMode = null;
            this.emitUpdate();
            this.restoreTabIndex();
            this.announce("saved description for entry");
        },
        cancelEditMode() {
            if (this.rowInEditMode.isNew) {
                this.deleteTodo(this.rowInEditMode);
            }
            this.rowInEditMode = null;
            this.restoreTabIndex();
            this.announce("canceled your input");
        },
        addRow() {
            const newTodo = {
                id: this.nextId++,
                description: "",
                done: false,
                isNew: true,
            };
            this.todos.push(newTodo);
            this.putRowInEditMode(newTodo);
            this.announce("Added new entry. Type in the description.");
        },
        deleteTodo(index, todo) {
            this.todos.splice(this.todos.indexOf(todo), 1);
            this.emitUpdate();
            const nextIndex = index === this.todos.length ? index - 1 : index;
            if (nextIndex >= 0) {
                this.$nextTick(() => this.$refs["row-start"][nextIndex].focus());
            }
            this.announce(
                `deleted entry at position ${index + 1}, you are now on the next entry`
            );
        },
        moveUp(index, todo) {
            if (index <= 0 || index >= this.todos.length) {
                return;
            }
            this.todos.splice(index - 1, 2, this.todos[index], this.todos[index - 1]);
            this.emitUpdate();
            this.$nextTick(() => {
                if (index <= 1) {
                    this.$refs["button-down-" + todo.id][0].focus();
                } else {
                    this.$refs["button-up-" + todo.id][0].focus();
                }
            });
            this.announce(
                `moved entry up from position ${index + 1} to ${index}` +
                (index <= 1 ? "reached top, you are now on the move down button" : "")
            );
        },
        moveDown(index, todo) {
            if (index < 0 || index + 1 >= this.todos.length) {
                return;
            }
            this.todos.splice(index, 2, this.todos[index + 1], this.todos[index]);
            this.emitUpdate();
            this.$nextTick(() => {
                if (index + 2 >= this.todos.length) {
                    this.$refs["button-up-" + todo.id][0].focus();
                } else {
                    this.$refs["button-down-" + todo.id][0].focus();
                }
            });
            this.announce(
                `moved entry down from position ${index + 1} to ${index + 2}` +
                (index + 2 >= this.todos.length
                    ? "reached bottom, you are now on the move up button"
                    : "")
            );
        },
        emitUpdate() {
            this.$emit("update", this.todos);
        },
        toggleFilter(value) {
            if (this.setFilter === value) {
                this.setFilter = "none";
            } else {
                this.setFilter = value;
            }
        },
        checkFilterOn(todo) {
            if (this.setFilter === "none") {
                return true;
            }
            if (this.setFilter === "finished" && todo.done) {
                return true;
            }
            if (this.setFilter === "unfinished" && !todo.done) {
                return true;
            }
            return false;
        },
        saveTabIndex() {
            this.lastFocusedElement = document.activeElement;
        },
        restoreTabIndex() {
            this.lastFocusedElement.focus();
        },

        announce(message) {
            if (this.announcementDebounce !== null) {
                clearTimeout(this.announcementDebounce);
            }
            this.announcementDebounce = setTimeout(() => {
                this.announcementMessage = message;
            }, 300);
        },
    },
};
</script>

<style scoped>
@import '../assets/button.css';
</style>
