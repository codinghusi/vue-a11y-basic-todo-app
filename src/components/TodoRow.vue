<template>
    <li>{{ todo.description }} - done: {{ todo.done }}</li>
</template>

<script>
    export default {
        props: {
            todo: {
                type: Object,
                required: true
            }
        }
    }
</script>