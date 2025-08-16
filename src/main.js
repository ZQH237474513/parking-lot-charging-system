import { createSSRApp } from "vue";
import uviewPlus from "uview-plus";
import App from "./App.vue";
import localforage from "./stores/localforage";
import { createPinia } from "pinia";

const pinia = createPinia();

export function createApp() {
	const app = createSSRApp(App);
	app.use(uviewPlus);
	app.use(pinia);
	app.use(localforage);
	return {
		app,
	};
}
