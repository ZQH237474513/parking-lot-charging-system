<template>
	<view class="wrapper">
		<up-picker
			:show="show"
			:columns="columns"
			ref="uPickerRef"
			@change="changeHandler"
			@confirm="handlerConfirm"
			@cancel="show = false"></up-picker>
		<up-button @click="show = true">打开</up-button>

		<view
			><view v-for="item in curMountData">{{ item.createTime }}</view></view
		>
	</view>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useApplicationStore } from "@stores";
import moment from "moment";

const billList = ref([]) as any;
const columns = ref([]) as any;
const show = ref(false);
const uPickerRef = ref(null) as any;
const curMountData = ref([]) as any;

const { getBillList } = useApplicationStore();

const changeHandler = (e: any) => {
	const { columnIndex, value, values, index } = e;

	const columnData = Object.keys(billList.value[value[0]]);

	if (columnIndex === 0) {
		uPickerRef.value.setColumnValues(1, columnData);
	}
};

const getBillDataList = (keys: any[], data: any) => {
	const mountList = data[keys[0]][keys[1]];
	const values = Object.values(JSON.parse(JSON.stringify(mountList)));
	const allData: any = [];
	for (const item of values) {
		allData.push(...(item as any));
	}
	return allData;
};

const handlerConfirm = (e: any) => {
	const { value } = e;

	curMountData.value = getBillDataList(value, billList.value);

	show.value = false;
};

onMounted(() => {
	(async () => {
		const data = await getBillList();
		const yearList = Object.keys(data).sort((a: any, b: any) => b - a);
		const mountList = Object.keys(data[yearList[0]]);
		columns.value = [yearList, mountList];
		const curMonth = moment().month() + 1;
		curMountData.value = getBillDataList([yearList[0], curMonth], data);
		billList.value = data;
	})();
});
</script>
