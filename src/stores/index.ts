import { ref } from "vue";
import { defineStore } from "pinia";
import { getGoodsList } from "@apis";
import { getCurrentInstanceParams } from "@utils";
import moment from "moment";

export const useApplicationStore = defineStore("application", () => {
	const goodsList = ref([]) as any;

	const localforage = getCurrentInstanceParams("localforage");

	const initGoodList = async (isUpdate = false) => {
		const dbGoodsList = await localforage.getItem("goodsList");
		if (dbGoodsList && dbGoodsList?.length && !isUpdate) {
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
			dbGoodsList = dbGoodsList.sort((a: any, b: any) => {
				return (
					moment(b.createTime, "YYYY年MM月DD日 HH:mm:ss").valueOf() -
					moment(a.createTime, "YYYY年MM月DD日 HH:mm:ss").valueOf()
				);
			});
		}

		await localforage.setItem("billList", dbGoodsList);
		return "success";
	};

	const getBillList = async () => {
		const billList: any = {};
		for (const item of await localforage.getItem("billList")) {
			const now = moment(item.createTime, "YYYY年MM月DD日 HH:mm:ss");
			const year = now.year();
			const month = now.month() + 1;
			const date = now.date();

			if (!billList[year]) {
				billList[year] = {};
			}

			if (!billList[year][month]) {
				billList[year][month] = {};
			}

			if (!billList[year][month][date]) {
				billList[year][month][date] = [item];
			} else {
				billList[year][month][date].push(item);
			}
		}

		return billList;
	};
	return { initGoodList, goodsList, saveBill, getBillList };
});
