import { ref } from "vue";
import { defineStore } from "pinia";
import { getGoodsList } from "@apis";
import { getCurrentInstanceParams } from "@utils";

export const useApplicationStore = defineStore("application", () => {
	const goodsList = ref([]) as any;

	const localforage = getCurrentInstanceParams("localforage");

	const initGoodList = async () => {
		const dbGoodsList = await localforage.getItem("goodsList");
		if (dbGoodsList && dbGoodsList?.length) {
			goodsList.value = dbGoodsList;
		} else {
			try {
				const data = await getGoodsList();
				goodsList.value = data;
				await localforage.setItem("goodsList", data);
			} catch (error) {}
		}
	};

	const saveBill = async (data: any) => {
		let dbGoodsList = await localforage.getItem("billList");
		if (!dbGoodsList) {
			dbGoodsList = [data];
		} else if (Array.isArray(dbGoodsList)) {
			const isRepeat = dbGoodsList.some((item: any) => {
				return item.id === data.id;
			});

			if (isRepeat) {
				return "repeat";
			}
			dbGoodsList.push(data);
		}

		await localforage.setItem("billList", dbGoodsList);
		return "success";
	};
	return { initGoodList, goodsList, saveBill };
});
