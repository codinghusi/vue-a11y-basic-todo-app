<template>
    <div class="flex flex-col gap-3">
        <div v-if="filters" class="flex flex-row justify-end gap-4">
            <span> Filter: </span>
            <button class="filter-button" :class="{ active: setFilter === 'finished' }" @click="toggleFilter('finished')">finished</button>
            <button class="filter-button" :class="{ active: setFilter === 'unfinished' }" @click="toggleFilter('unfinished')">unfinished</button>
        </div>

        <ul class="w-full flex flex-col gap-2">
            <li class="row-container" :class="{done: todo.done}" v-for="(todo, index) in todos" :todo="todo" :key="todo.id" v-if="checkFilterOn(todo)">
                <input type="checkbox" v-model="todo.done" class="cursor-pointer" @change="emitUpdate"/>

                <span class="description" v-if="!isRowInEditMode(todo)" @dblclick="putRowInEditMode(todo)">
                    {{ todo.description }}
                </span>

                <input
                    type="text"
                    class="border rounded px-2 description-editable"
                    v-model="editinigDescription" 
                    ref="editableDescription"
                    @keydown.enter="doneEditMode()"
                    v-else />
                
                <button class="cursor-pointer" v-if="!isRowInEditMode(todo)" @click="putRowInEditMode(todo)"> edit </button>
                <template v-else>
                    <button class="cursor-pointer" @click="doneEditMode()"> save </button>
                    <button class="cursor-pointer" @click="cancelEditMode()"> cancel </button>
                </template>

                <button
                    class="cursor-pointer rotate-90"
                    :class="{invisible: index === 0}"
                    @click="moveUp(index)"> 
                    {{ '<' }}
                </button>
                <button
                    class="cursor-pointer rotate-90"
                    :class="{invisible: index === todos.length - 1}"
                    @click="moveDown(index)">
                    {{ '>' }}
                </button>
                <button class="cursor-pointer" @click="deleteTodo(todo)"> x </button>
            </li>
        </ul>

        <div class="flex justify-end" v-if="controls">
            <button class="border rounded p-2 cursor-pointer" @click="addRow">
                add
            </button>
        </div>

    </div>
</template>

<script>
    export default {
        props: {
            todos: {
                required: true,
                type: Array
            },
            controls: {
                type: Boolean
            },
            filters: {
                type: Boolean
            }
        },
        data() {
            return {
                rowInEditMode: null,
                editinigDescription: '',
                nextId: Math.max(...this.todos.map(todo => todo.id)) + 1,
                setFilter: 'none'
            }
        },
        methods: {
            isRowInEditMode(todo) {
                return this.rowInEditMode?.id === todo.id
            },
            putRowInEditMode(todo) {
                this.rowInEditMode = todo
                this.editinigDescription = todo.description
                Promise.resolve().then(() => this.$refs.editableDescription?.[0]?.focus())
            },
            doneEditMode() {
                this.rowInEditMode.description = this.editinigDescription
                if (this.rowInEditMode.isNew) {
                    delete this.rowInEditMode.isNew
                }
                this.rowInEditMode = null
                this.emitUpdate()
            },
            cancelEditMode() {
                if (this.rowInEditMode.isNew) {
                    this.deleteTodo(this.rowInEditMode)
                }
                this.rowInEditMode = null
            },
            addRow() {
                const newTodo = { id: this.nextId++, description: '', done: false, isNew: true }
                this.todos.push(newTodo)
                this.putRowInEditMode(newTodo)
            },
            deleteTodo(todo) {
                this.todos.splice(this.todos.indexOf(todo), 1)
                this.emitUpdate()
            },
            moveUp(index) {
                if (index <= 0 || index >= this.todos.length) {
                    return
                }
                this.todos.splice(index - 1, 2, this.todos[index], this.todos[index - 1])
                this.emitUpdate()
            },
            moveDown(index) {
                this.moveUp(index + 1)
            },
            emitUpdate() {
                this.$emit('update', this.todos)
            },
            toggleFilter(value) {
                if (this.setFilter === value) {
                    this.setFilter = 'none'
                } else {
                    this.setFilter = value
                }
            },
            checkFilterOn(todo) {
                if (this.setFilter === 'none') {
                    return true
                }
                if (this.setFilter === 'finished' && todo.done) {
                    return true
                }
                if (this.setFilter === 'unfinished' && !todo.done) {
                    return true
                }
                return false
            }
        }
    }
</script>

<style scoped>
.row-container {
    @apply flex flex-row gap-3;
    @apply p-4 border rounded
}

.description {
    @apply flex-1
}

.done > .description {
    @apply line-through
}

.description-editable {
    @apply flex-1
}


.filter-button {
    @apply border rounded bg-gray-100 px-2
}

.filter-button.active {
    @apply bg-blue-600 text-white
}
</style>