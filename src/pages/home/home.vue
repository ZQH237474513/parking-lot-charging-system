<template>
	<view class="content">
		<view class="item">
			<up-button
				type="primary"
				shape="circle"
				text="外部车辆维修账单"
				plain
				@click="addExternalBill"></up-button>
			<up-button
				shape="circle"
				text="内部车辆维修账单"
				plain
				@click="addInteriorBill"></up-button>
		</view>
	</view>
</template>

<style scoped lang="scss">
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin: 0 50px;
	height: 88vh;

	.item {
		width: 100%;
		height: 130px;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
	}
}
</style>

<script setup>
import { useApplicationStore } from "@stores";

const applicationStore = useApplicationStore();

const addExternalBill = () => {
	uni.navigateTo({
		url: "../goodsList/goodsList?type=add",
	});
};
const addInteriorBill = () => {};
</script>
