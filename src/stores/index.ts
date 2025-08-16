import { ref } from "vue";
import { defineStore } from "pinia";
import { getGoodsList } from "@apis";
import { getCurrentInstanceParams } from "@utils";

export const useApplicationStore = defineStore("application", () => {
	const goodsList = ref([]) as any;

	const localforage = getCurrentInstanceParams("localforage");

	const initGoodList = async () => {
		const dbGoodsList = await localforage.getItem("goodsList");
		if (dbGoodsList) {
			goodsList.value = dbGoodsList;
		} else {
			try {
				const data = await getGoodsList();
				goodsList.value = data;
				await localforage.setItem("goodsList", data);
			} catch (error) {}
		}
	};
	return { initGoodList, goodsList };
});
