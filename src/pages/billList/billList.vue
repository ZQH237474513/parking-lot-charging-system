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

		<view>
			<view
				v-for="item in curMountData"
				class="billCard">
				<view class="createTime">{{ `创建时间 : ${item.createTime}` }}</view>
				<view>
					<view class="goodsList">{{ `商品列表 : ` }}</view>
					<up-table fontSize="17px">
						<up-tr>
							<up-th width="8%"></up-th>
							<up-th width="38%">名称</up-th>
							<up-th>价格</up-th>
							<!-- <up-th>成本价</up-th> -->
						</up-tr>
						<up-tr v-for="(goods, i) in item.goodsList">
							<up-td width="10%">{{ i + 1 }}</up-td>
							<up-td width="40%">{{ goods.name }}</up-td>
							<up-td>{{ `${goods.price} 元 ` }}</up-td>
							<!-- <up-td>{{ `${goods.originalPrice} 元 ` }}</up-td> -->
						</up-tr>
					</up-table>
				</view>
				<view class="total">{{ `总价 : ${item.totalPrice} 元` }}</view>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.wrapper {
	.billCard {
		// min-height: 200px;
		border-radius: 3%;
		margin: 20px 10px;
		padding: 10px 10px;
		box-shadow: 1px 2px 4px 0px #808080;
		box-sizing: border-box;
		font-weight: bold;
		font-size: 16px;
		.createTime {
			margin: 10px 0;
		}
		.total {
			margin: 10px 0;
			color: red;
			font-size: 20px;
		}
		.goodsList {
			margin: 10px 0;
		}
	}
}
</style>

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
