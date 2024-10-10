import Vue from "vue";
import App from "./App.vue";

import "./assets/main.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleDown, faAngleUp, faEdit, faPlus, faSave, faTrashAlt, faUndo } from "@fortawesome/free-solid-svg-icons";

library.add(faAngleUp, faAngleDown, faUndo, faTrashAlt, faEdit, faSave, faPlus);

new Vue({
  render: (h) => h(App)
}).$mount("#app");
