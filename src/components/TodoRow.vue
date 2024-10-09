<script setup>
import IconUp from './icons/IconUp.vue'
</script>

<template>
    <li class="row-container" :class="{done: todo.done}">
        <span class="description">
            {{ todo.description }}
        </span>
        
        <button class="pointer rotate-90"> < </button>
        <button class="pointer rotate-90"> > </button>
        <input type="checkbox" v-model="todo.done"/>
    </li>
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
</style>