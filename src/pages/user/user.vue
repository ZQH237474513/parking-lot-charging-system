<template>
	<view class="wrapper">
		<view class="swiper">
			<up-swiper :list="list1" indicator indicatorMode="dot" circular height="200"></up-swiper>
		</view>
		<up-cell-group>
			<up-cell icon="reload" title="更新数据" @click="() => initGoodList(true)"></up-cell>
			<!-- <up-cell icon="integral-fill" title="会员等级" value="新版本"></up-cell> -->
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
import { reactive } from "vue";

import { useApplicationStore } from "@stores";

const list1 = reactive(
	new Array(7).fill("").map((item, i) => {
		return `https://gitee.com/zqhweb/localstorage/raw/master/publice/images/${i + 1}.jpg`;
	})
);

const { initGoodList } = useApplicationStore();
</script>
