<template>
    <div class="sr-only" aria-live="polite">{{ announcement }}</div>
</template>

<script>
export default {
    props: {
        debounceTime: {
            type: Number,
            defaut: 300
        }
    },
    data() {
        return {
            announcement: '',
            debounceTimer: null
        }
    },
    methods: {
        announce(message) {
            if (this.debounceTimer !== null) {
                clearTimeout(this.debounceTimer);
            }
            this.debounceTimer = setTimeout(() => {
                this.announcementMessage = message;
            }, this.debounceTime);
        }
    }
}
</script>