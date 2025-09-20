<template>
	<view class="wrapper">
		<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0">
			<view class="popupWrapper">
				<view :style="{ color: 'red', fontSize: '20px', fontWeight: 'bold', marginLeft: '40px' }">是否删除当前订单?
				</view>
				<view class="bottomBtn">
					<up-button type="error" @click="() => closeOrOpenPopup('close')">取消</up-button>
					<view :style="{ width: '40px' }"></view>
					<up-button type="primary" ref="sureBtn" @click="handleSure">确定</up-button>
				</view>
			</view>
		</uni-popup>
		<up-picker :show="show" :columns="columns" ref="uPickerRef" @change="changeHandler" @confirm="handlerConfirm"
			@cancel="show = false"></up-picker>
		<up-button @click="show = true">打开</up-button>

		<view class="billContent" :style="{ height }">
			<view class="billCard" @click="isShowTotalDatail = !isShowTotalDatail">
				<view :style="{ fontSize: '18px' }">
					<view>
						当月总金额 :
						<text :style="{ color: 'red' }">{{ ` ${curMountTotalPrice} 元` }}</text>
						<!-- <view>
							当天总金额 :
							<text :style="{ color: 'red', fontWeight: 'bold' }">{{
								`   ${curMountTotalPrice} 元`
							}}</text>
						</view> -->
					</view>
				</view>
				<view v-if="isShowTotalDatail">
					<view class="goodsList">{{ `商品列表 : ` }}</view>
					<up-table fontSize="17px">
						<up-tr>
							<up-th width="8%"></up-th>
							<up-th width="38%">名称</up-th>
							<!-- <up-th>价格</up-th> -->
							<up-th>数量</up-th>
						</up-tr>
						<up-tr v-for="(goods, i) in statisticsGoodsNumList">
							<up-td width="10%">{{ i + 1 }}</up-td>
							<up-td width="40%">{{ goods.name }}</up-td>
							<!-- <up-td>{{ `${goods.price} 元 ` }}</up-td> -->
							<up-td>{{ goods?.num || 1 }}</up-td>
							<!-- <up-td>{{ `${goods.originalPrice} 元 ` }}</up-td> -->
						</up-tr>
					</up-table>
				</view>
			</view>
			<view v-for="item in curMountData" class="billCard">
				<up-button v-if="mainState.isAdmin" shape="circle" text="删除" plain
					@click="() => handleDeteleDate(item)"></up-button>
				<view class="createTime">{{ `创建时间 : ${item.createTime}` }}</view>
				<view>{{ `订单类型 : ${item?.isInnerOrder ? '内部订单' : '外部订单'}` }}</view>
				<view>
					<view class="goodsList">{{ `商品列表 : ` }}</view>
					<up-table fontSize="17px">
						<up-tr>
							<up-th width="8%"></up-th>
							<up-th width="38%">名称</up-th>
							<up-th>价格</up-th>
							<up-th v-if="mainState.isAdmin">原价</up-th>
							<up-th>数量</up-th>
						</up-tr>
						<up-tr v-for="(goods, i) in item.goodsList">
							<up-td width="10%">{{ i + 1 }}</up-td>
							<up-td width="40%">{{ goods.name }}</up-td>
							<up-td>{{ `${goods.price} 元 ` }}</up-td>
							<up-td v-if="mainState.isAdmin">{{ `${goods.originalPrice} 元 ` }}</up-td>
							<up-td>{{ goods?.num || 1 }}</up-td>
						</up-tr>
					</up-table>
				</view>
				<view class="total">{{ `总金额 : ${item.totalPrice} 元` }}</view>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.wrapper {
	.popupWrapper {
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		width: 300px;
		height: 200px;
		background: white;
		padding: 60px 10px 20px 10px;
		box-sizing: border-box;
		border-radius: 10px;

		.bottomBtn {
			display: flex;
			justify-content: space-evenly;
		}
	}

	.billContent {
		width: 100%;
		overflow-y: scroll;

		.billCard {
			// min-height: 200px;
			border-radius: 10px;
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
}
</style>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useApplicationStore } from "@stores";
import { getCurMountTotalPrice, getStatisticsGoodsNumList, getFormatBillList } from "@utils";
import { onLoad } from "@dcloudio/uni-app";
import { winHW } from '@utils/system.ts';

const billList = ref([]) as any;
const columns = ref([]) as any;
const show = ref(false);
const uPickerRef = ref(null) as any;
const curMountData = ref([]) as any;
const curMountTotalPrice = ref(0);
const statisticsGoodsNumList = ref([]) as any;
const isShowTotalDatail = ref(false);
const height = ref('') as any;
const popup = ref(null) as any;
const sureBtn = ref(null) as any;

const { getBillList, deleteBillData, mainState } = useApplicationStore();

let handleSure = () => {
	// deleteBillData(value.id);
}


const closeOrOpenPopup = async (tyep: any = 'open', cb?: any) => {
	switch (tyep) {
		case "open":
			popup.value.open('center');
			handleSure = cb;
			break;
		case "close":
			popup.value.close();
			break;
		default: popup.value.open('center');
			break;
	}







}
const handleDeteleDate = (value: any) => {
	closeOrOpenPopup("open", async () => {
		await deleteBillData(value.id);
		closeOrOpenPopup("close")
		uni.showToast({
			icon: 'success',
			title: '删除成功',
			duration: 1000
		});
	});
}




const changeHandler = (e: any) => {
	const { columnIndex, value, values, index } = e;

	const columnData = Object.keys(billList.value[value[0]]);

	if (columnIndex === 0) {
		uPickerRef.value.setColumnValues(1, columnData);
	}
};

const handlerConfirm = (e: any) => {
	const { value } = e;
	const formatData = getFormatBillList(billList.value);
	const data = formatData.getBillDataList(value, billList.value).billList;
	console.log(data);

	curMountData.value = data;
	curMountTotalPrice.value = getCurMountTotalPrice(data);
	statisticsGoodsNumList.value = getStatisticsGoodsNumList(data);
	show.value = false;
};


// const initBillList = (data: any) => {
// 	const formatData = getFormatBillList(data);
// 	curMountData.value = formatData.getBillDataList().billList;;
// 	curMountTotalPrice.value = getCurMountTotalPrice(data);
// 	statisticsGoodsNumList.value = getStatisticsGoodsNumList(data);
// 	return { columns: formatData.columns, metaData: formatData.metaData }
// }

onLoad(() => {
	(async () => {
		height.value = `${winHW().height - 160}px`;
		console.log(height.value);

		const formatData = getFormatBillList((await getBillList() || []));
		columns.value = formatData?.columns;
		const data = formatData.getBillDataList().billList;
		statisticsGoodsNumList.value = getStatisticsGoodsNumList(data);

		curMountData.value = data;

		billList.value = formatData.metaData;
		curMountTotalPrice.value = getCurMountTotalPrice(data);
	})();
});
</script>
