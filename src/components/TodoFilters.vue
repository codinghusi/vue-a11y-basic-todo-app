<template>
    <div class="flex flex-row justify-end gap-4 justify-items-center content-center">
        <label for="filters" class="py-2 cursor-pointer">Filters:</label>
        <select :value="hidden" class="btn" id="filters" @change="$emit('update', $event.target.value)">
            <option value="none">No filter</option>
            <option value="finished" aria-label="show only finished todos">Finished</option>
            <option value="unfinished" aria-label="show only unfinished todos">Unfinished</option>
        </select>
    </div>
</template>

<script>
export default {
    props: {
        hidden: {
            type: String,
            required: true,
        }
    },
    model: {
        prop: 'hidden',
        event: 'update'
    }
}
</script>

<style scoped>
@import '../assets/button.css';
</style>