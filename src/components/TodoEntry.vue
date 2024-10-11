<template>
  <div class="row-container" :class="{ done: todo.done }">
    <ScreenReaderOnly>
      ({{ todo.done ? "finished" : "unfinished" }}) todo
    </ScreenReaderOnly>

    <ScreenReaderAnnouncer ref="announcer" />

    <input type="checkbox" :checked="todo.done" class="cursor-pointer" @change="e => {
        $emit('updateDoneState', e.target.checked);
        announce(`marked todo as ${todo.done ? 'finished' : 'unfinished'}`);
      }
      " ref="finish-checkbox" :aria-label="todo.done ? 'mark todo as unfinished' : 'mark todo as finished'
        " />

    <span v-if="!editMode" class="description">
      {{ todo.description }}
    </span>

    <input v-else type="text" class="border rounded px-2 description-editable" ref="editable-description"
      v-model="stagedDescription" @keypress.enter="doneEditingDescription" @keydown.esc="cancelEditingDescription"
      :aria-label="'description of todo ' +
        position +
        ' press enter to confirm, escape to cancel'
        " />

    <button v-if="!editMode" class="cursor-pointer" ref="edit-button" @click="startEditingDescription"
      aria-label="edit the description of todo">
      <v-icon icon="edit" />
    </button>

    <template v-else>
      <button class="cursor-pointer" ref="cancel-button" @click="cancelEditingDescription"
        aria-label="cancel and restore previous description">
        <v-icon icon="undo" />
      </button>
      <button class="cursor-pointer" ref="save-button" @click="doneEditingDescription" aria-label="confirm your input">
        <v-icon icon="save" />
      </button>
    </template>

    <button class="cursor-pointer" ref="delete-button" @click="$emit('deleteEntry')" aria-label="remove entry">
      <v-icon icon="trash-alt" />
    </button>

    <div class="flex flex-col gap-0">
      <button class="cursor-pointer" :class="{ invisible: isFirst }" ref="up-button" @click="$emit('moveUp')"
        aria-label="move entry one up">
        <v-icon icon="angle-up" />
      </button>

      <button class="cursor-pointer" :class="{ invisible: isLast }" ref="down-button" @click="$emit('moveDown')"
        aria-label="move entry one down">
        <v-icon icon="angle-down" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ScreenReaderOnly from "./ScreenReaderOnly.vue";
import restoreLastFocusMixin from "./restoreLastFocusMixin";
import ScreenReaderAnnouncer from "./ScreenReaderAnnouncer.vue";
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
    },
  },
  emits: [
    "moveUp",
    "moveDown",
    "updateDescription",
    "updateDoneState",
    "deleteEntry",
    "enteringEditMode",
  ],
  data() {
    return {
      editMode: false,
      stagedDescription: "",
    };
  },
  created() {
    if (this.todo.isNew) {
      this.startEditingDescription();
    }
  },
  mixins: [restoreLastFocusMixin],

  methods: {
    startEditingDescription() {
      this.stagedDescription = this.todo.description;
      this.editMode = true;
      this.saveFocusedElement();
      this.$nextTick(() => this.focusElement("editable-description"));
    },

    doneEditingDescription() {
      this.$emit("updateDescription", this.stagedDescription);
      this.stagedDescription = "";
      this.editMode = false;
      if (this.todo.isNew !== undefined) {
        delete this.todo.isNew;
      }
      this.restoreLastFocusedElement();
      this.announce("saved description for entry");
    },

    cancelEditingDescription() {
      this.stagedDescription = "";
      this.editMode = false;
      if (this.todo.isNew !== undefined) {
        this.$emit("deleteEntry");
      }
      this.restoreLastFocusedElement();
      this.announce("canceled your input");
    },

    focusElement(which) {
      if (
        ![
          "finish-checkbox",
          "editable-description",
          "edit-button",
          "cancel-button",
          "save-button",
          "up-button",
          "down-button",
          "delete-button",
        ].includes(which)
      ) {
        throw `invalid argument in focusElement: ${which}`;
      }
      if (this.$refs[which]) {
        this.$refs[which].focus();
      } else {
        this.$nextTick(() => {
          if (!this.$refs[which]) {
            console.log(this.$refs);
            throw `element ${which} is not available to focus`;
          }
          this.$refs[which].focus();
        });
      }
    },
    announce(message) {
      this.$refs.announcer.announce(message);
    },
  },

  components: {
    "v-icon": FontAwesomeIcon,
  },
};
</script>

<style scoped>
.row-container {
  @apply flex flex-row gap-5 p-4 border rounded items-center;
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
