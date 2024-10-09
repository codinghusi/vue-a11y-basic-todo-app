<template>
    <div>        
        <ul class="w-full flex flex-col gap-2">
            <li class="row-container" :class="{done: todo.done}" v-for="(todo, index) in todos" :todo="todo" :key="todo.id">
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
            <button class="border rounded p-2 mt-4 cursor-pointer" @click="addRow">
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
            }
        },
        data() {
            return {
                rowInEditMode: null,
                editinigDescription: '',
                nextId: Math.max(...this.todos.map(todo => todo.id)) + 1
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
</style>