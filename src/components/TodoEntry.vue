<template>
    <div class="row-container" :class="{ done: todo.done }">

        <ScreenReaderOnly>
            ({{ todo.done ? "finished" : "unfinished" }}) todo
        </ScreenReaderOnly>

        <input
            type="checkbox"
            :checked="todo.done"
            class="cursor-pointer"
            @change="$emit('updateDoneState', $event.target.value)"
            ref="row-start"
            :aria-label="todo.done ? 'mark todo as unfinished' : 'mark todo as finished'">

            <!-- emitUpdate(); announce(`marked todo as ${todo.done ? 'finished' : 'unfinished'}`) -->


        <span v-if="!editMode" class="description">
            {{ todo.description }}
        </span>

        <input
            v-else
            type="text"
            class="border rounded px-2 description-editable"
            v-model="stagedDescription"
            @keypress.enter="doneEditingDescription"
            @keydown.esc="cancelEditingDescription" 
            :aria-label="'description of todo ' + position + ' press enter to confirm, escape to cancel'" />

        <button
            v-if="!editMode"
            class="cursor-pointer"
            @click="startEditingDescription"
            aria-label="edit the description of todo">
            <v-icon icon="edit" />
        </button>

        <template v-else>
            <button
                class="cursor-pointer"
                @click="cancelEditingDescription"
                aria-label="cancel and restore previous description">
                <v-icon icon="undo" />
            </button>
            <button
                class="cursor-pointer"
                @click="doneEditingDescription"
                aria-label="confirm your input">
                <v-icon icon="save" />
            </button>
        </template>

        <button
            class="cursor-pointer" :class="{ invisible: isFirst }"
            @click="$emit('moveUp')"
            :ref="`button-up-${todo.id}`" aria-label="move entry one up">
            <v-icon icon="angle-up" />
        </button>

        <button
            class="cursor-pointer" :class="{ invisible: isLast }"
            @click="$emit('moveDown')"
            aria-label="move entry one down"
            :ref="`button-up-${todo.id}`">
            <v-icon icon="angle-down" />
        </button>

        <button
            class="cursor-pointer"
            @click="$emit('deleteEntry')"
            aria-label="remove entry">
            <v-icon icon="trash-alt" />
        </button>
    </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ScreenReaderOnly from './ScreenReaderOnly.vue';
</script>

<script>
export default {
    props: {
        todo: {
            type: Object,
            required: true,
        },
        isFirst: {
            type: Boolean,
            required: true,
        },
        isLast: {
            type: Boolean,
            required: true,
        },
        position: {
            type: Number,
            required: true,
        }
    },
    emits: ['moveUp', 'moveDown', 'updateDescription', 'updateDoneState', 'deleteEntry', 'enteringEditMode'],
    data() {
        return {
            editMode: false,
            stagedDescription: ''
        }
    },
    methods: {
        startEditingDescription() {
            this.stagedDescription = this.todo.description
            this.editMode = true
        },
        doneEditingDescription() {
            this.$emit('updateDescription', this.stagedDescription)
            this.stagedDescription = ''
            this.editMode = false
        },
        cancelEditingDescription() {
            this.stagedDescription = ''
            this.editMode = false
        }
    },
    components: {
        'v-icon': FontAwesomeIcon
    },
}
</script>

<style scoped>
.row-container {
    @apply flex flex-row gap-3;
    @apply flex flex-row gap-3 p-4 border rounded ;
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
</style>