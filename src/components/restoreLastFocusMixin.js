export default {
  data() {
    return {
      lastFocusedElement: null,
    };
  },
  methods: {
    saveFocusedElement() {
      this.lastFocusedElement = document.activeElement;
    },
    restoreLastFocusedElement() {
      this.lastFocusedElement?.focus();
    },
  },
};
