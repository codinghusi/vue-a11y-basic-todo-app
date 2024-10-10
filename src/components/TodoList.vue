<script setup>
import TodoFilters from './TodoFilters.vue';
</script>

<template>
    <div class="flex flex-col gap-3">
        <span aria-live="polite" class="sr-only">{{ announcementMessage }}</span>
        <TodoFilters v-model="setFilter" v-if="filters" />

        <!-- Todo List -->
        <ul class="w-full flex flex-col gap-2" :aria-label="`${setFilter === 'none'
                ? 'all'
                : setFilter === 'finished'
                    ? 'finished'
                    : 'unfinished'
            } todos`">
            <li class="row-container" :class="{ done: todo.done }" v-for="(todo, index) in filteredTodos" :todo="todo"
                :key="todo.id">
                <span class="sr-only">
                    ({{ todo.done ? "finished" : "unfinished" }}) todo
                </span>

                <input type="checkbox" v-model="todo.done" class="cursor-pointer"
                    @change="() => { emitUpdate(); announce(`marked todo as ${todo.done ? 'finished' : 'unfinished'}`) }"
                    ref="row-start" :aria-label="todo.done ? 'mark todo as unfinished' : 'mark todo as finished'
                        " />

                <span class="description" v-if="!isRowInEditMode(todo)">
                    {{ todo.description }}
                </span>

                <input type="text" class="border rounded px-2 description-editable" v-model="editinigDescription"
                    ref="editableDescription" @keypress.enter="doneEditMode()" @keydown.esc="cancelEditMode()" v-else
                    :aria-label="'description of todo ' +
                        index +
                        ' press enter to confirm, escape to cancel'
                        " />

                <button class="cursor-pointer" v-if="!isRowInEditMode(todo)" @click="putRowInEditMode(todo)"
                    aria-label="edit the description of todo">
                    <v-icon icon="edit" />
                </button>
                <template v-else>
                    <button class="cursor-pointer" @click="cancelEditMode()"
                        aria-label="cancel and restore previous description">
                        <v-icon icon="undo" />
                    </button>
                    <button class="cursor-pointer" @click="doneEditMode()" aria-label="confirm your input">
                        <v-icon icon="save" />
                    </button>
                </template>

                <button class="cursor-pointer" :class="{ invisible: index === 0 }" @click="moveUp(index, todo)"
                    :ref="'button-up-' + todo.id" aria-label="move entry one up">
                    <v-icon icon="angle-up" />
                </button>

                <button class="cursor-pointer" :class="{ invisible: index === todos.length - 1 }"
                    aria-label="move entry one down" @click="moveDown(index, todo)" :ref="'button-down-' + todo.id">
                    <v-icon icon="angle-down" />
                </button>

                <button class="cursor-pointer" @click="deleteTodo(index, todo)" aria-label="remove entry">
                    <v-icon icon="trash-alt" />
                </button>
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
.row-container {
    @apply flex flex-row gap-3;
    @apply p-4 border rounded;
}

.description {
    @apply flex-1;
}

.done>.description {
    @apply line-through;
}

.description-editable {
    @apply flex-1;
}

.filter-button {
    @apply border rounded bg-gray-100 px-2;
}

.filter-button.active {
    @apply bg-blue-600 text-white;
}

.sr-only {
    /* https://webaim.org/techniques/css/invisiblecontent/ */
    position: absolute;
    left: -10000px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
}

.btn {
    @apply border rounded p-2 cursor-pointer box-border;
}

.btn-primary {
    /* @apply bg-indigo-200 text-black */
}

.btn:hover, btn:focus {
    @apply border-2 border-black
}
</style>
