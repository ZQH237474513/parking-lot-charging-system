<template>
	<view class="wrapper">
		<!-- <view class="swiper">
			<up-swiper :list="list1" indicator indicatorMode="dot" circular height="200"
				@monthSwitch="handler"></up-swiper>
		</view> -->
		<view>
			<!-- 插入模式 -->
			<uni-calendar class="uni-calendar--hook" :selected="calendarData" @monthSwitch="handlerMonthSwitch" />
		</view>
		<up-cell-group>
			<up-cell icon="reload" title="更新数据" @click="handlerUpdaGoods"></up-cell>
			<up-cell icon="integral-fill" title="导出数据" @click="exportData"></up-cell>
			<up-cell v-if="mainState?.isLogin" title="注销" @click="logoutHandle"></up-cell>
		</up-cell-group>
	</view>
</template>

<style scoped lang="scss">
.wrapper {

	// margin-top: 20px;
	// .swiper {
	// 	width: 100%;
	// 	height: 200px;
	// }
}
</style>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useApplicationStore } from "@stores";
import moment from "moment";
import { onLoad } from "@dcloudio/uni-app";
import { getFormatBillList, getCurrentInstanceParams, copyJsonToClipboard } from "@utils";

const { getBillList, initGoodList, initUserInfo, mainState, isLoginHandle } = useApplicationStore();
const billList = ref([]);
const calendarData = ref([]);
const localforage = getCurrentInstanceParams("localforage");


const list1 = reactive(
	new Array(7).fill("").map((item, i) => {
		return `https://gitee.com/zqhweb/localstorage/raw/master/publice/images/${i + 1}.jpg`;
	})
);

const handlerUpdaGoods = () => {
	initGoodList(true)
	initUserInfo(true)
	setTimeout(() => {
		uni.showToast({
			title: '更新完成',
			duration: 2000
		});
	}, 0.5e3);
}

const handlerMonthSwitch = (v) => {
	const formatData = getFormatBillList(billList.value);
	const data = formatData.getBillDataList([v.year, v.month]);
	calendarData.value = data.calendarData;


}
/** 注销 */

const logoutHandle = async () => {
	await localforage.removeItem('userInfo');
	uni.navigateTo({
		url: `../login/login`
	});
}

const exportData = async () => {
	try {
		const data = await localforage.getItem('billList');
		copyJsonToClipboard(data)
		const link = document.createElement('a');
		const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
		link.href = window.URL.createObjectURL(blob);
		link.setAttribute('download', '账单列表');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.URL.revokeObjectURL(blob);
	} finally {
		setTimeout(() => {
			uni.showToast({
				title: '下载完成',
				duration: 2000
			});
		}, 0.5e3);
	}

}
onLoad(() => {
	(async () => {
		const formatData = getFormatBillList(await getBillList());
		billList.value = formatData.metaData;
		const data = formatData.getBillDataList();
		calendarData.value = data.calendarData;
	})()

})

</script>
