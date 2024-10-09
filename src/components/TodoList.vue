<template>
    <ul class="w-full flex flex-col gap-2">
        <li class="row-container" :class="{done: todo.done}" v-for="todo in todos" :todo="todo" :key="todo.id">
            <input type="checkbox" v-model="todo.done"/>

            <span class="description" v-if="!isRowInEditMode(todo)">
                {{ todo.description }}
            </span>

            <input
                type="text"
                class="border rounded px-2 description-editable"
                v-model="editinigDescription" 
                ref="editableDescription"
                @keydown.enter="doneEditMode()"
                v-else />
            
            <button class="pointer" v-if="!isRowInEditMode(todo)" @click="putRowInEditMode(todo)"> edit </button>
            <template v-else>
                <button class="pointer" @click="doneEditMode()"> done </button>
                <button class="pointer" @click="cancelEditMode()"> cancel </button>
            </template>
            <button class="pointer rotate-90"> {{ '<' }} </button>
            <button class="pointer rotate-90"> {{ '>' }} </button>
        </li>
    </ul>
</template>

<script>
    export default {
        props: {
            todos: {
                required: true,
                type: Array
            }
        },
        methods: {
            handleUpdate() {
                console.log('todo')
            },
            isRowInEditMode(todo) {
                return this.rowInEditMode?.id === todo.id
            },
            putRowInEditMode(todo) {
                this.rowInEditMode = todo
                this.editinigDescription = todo.description
                Promise.resolve().then(() => this.$refs.editableDescription[0].focus())
            },
            doneEditMode() {
                this.rowInEditMode.description = this.editinigDescription
                this.rowInEditMode = null
            },
            cancelEditMode() {
                this.rowInEditMode = null
            }
        },
        data() {
            return {
                rowInEditMode: null,
                editinigDescription: ''
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