<template>
    <ul class="w-full flex flex-col gap-2">
        <TodoRow v-for="todo in todos" :todo="todo" :key="todo.id" @change="handleUpdate" />
    </ul>
</template>

<script>
    import TodoRow from './TodoRow.vue'
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
            }
        },
        components: {
            TodoRow
        }
    }
</script>