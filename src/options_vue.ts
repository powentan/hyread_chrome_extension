import { createApp } from "vue";
import Options from "./options/options.vue";
import ElementPlus from "element-plus";
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(Options);
// register all vue icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(ElementPlus);
app.mount('#app');