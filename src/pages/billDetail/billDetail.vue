<template>
	<view class="wrapper">
		<up-toast ref="uToastRef"></up-toast>
		<scroll-view
			scroll-y
			scroll-top>
			<view class="goodsList">
				<view
					v-for="(item, i) in targetList"
					:id="item.id"
					class="goodsItem">
					<up-image
						:show-loading="true"
						:src="item.imgPath"
						width="100%"
						radius="10px"
						height="150px"
						lazyLoad></up-image>

					<view class="priceName">
						<text class="name">{{ item.name }}</text>
						<text class="price">{{ `价格: ${item.price} 元` }}</text>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="bottomBtn">
			<view class="totalPrice">{{ `总金额 : ${totalPrice} 元` }}</view>
			<view
				class="btn"
				@click="handleCreateBill"
				>结算</view
			>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useApplicationStore } from "@stores";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

const targetList = ref([]) as any;
const billId = ref(uuidv4()) as any;
const uToastRef = ref(null) as any;

const { goodsList, saveBill } = useApplicationStore();

const totalPrice = computed(() => {
	return targetList.value.reduce((total: number, item: any) => {
		return total + item.price;
	}, 0);
});

onLoad((option: any) => {
	const { ids } = option;
	if (ids) {
		targetList.value = goodsList.filter((item: any) => {
			return ids.includes(item.id);
		});
	}
});

const showToast = (title: string) => {
	uToastRef.value.show({
		type: "default",
		title: "提示",
		message: title,
	});
};

/** 生成账单 */
const handleCreateBill = async () => {
	const status = await saveBill({
		id: billId.value,
		createTime: dayjs().format("YYYY年MM月DD日 HH:mm:ss"),
		goodsList: JSON.parse(JSON.stringify(targetList.value)),
		totalPrice: totalPrice.value,
	});

	switch (status) {
		case "repate":
			showToast("当前数据已提交,请勿重复提交!");
			setTimeout(() => uni.switchTab({ url: "../home/home" }), 1e3);
			break;
		case "success":
			showToast("数据提交成功!");
			setTimeout(() => uni.switchTab({ url: "../home/home" }), 0.5e3);
			break;

		default:
			uni.switchTab({ url: "../home/home" });
			break;
	}
};
</script>

<style scoped lang="scss">
::v-deep .uni-scroll-view-content {
	margin-bottom: 100px;
}
.wrapper {
	.goodsList {
		height: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		grid-gap: 10px 20px;
		margin: 5px 10px; // 左右间隙

		.goodsItem {
			width: 100%;
			height: 100%;
			border-radius: 10px;
			box-shadow: 1px 1px 5px 0 #808080;
			max-height: 220px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.priceName {
				margin: 0 0 15px 0;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.name {
					margin-bottom: 5px;
				}

				.price {
					color: red;
				}
			}

			img {
				width: 100%;
				height: 150px;
				border-radius: 10px;
				margin-bottom: 10px;
			}
		}
		.active {
			border: 1px solid red;
		}
	}

	.bottomBtn {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 60px;
		background: #fff;
		// border: 1px solid;
		// border-radius: 5px;
		box-sizing: border-box;
		padding: 0 20px 0 40px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 2px 2px 20px 0px #808080;
		.totalPrice {
			min-width: 150px;
			height: 100%;
			line-height: 50px;
			color: red;
			font-weight: bold;
			font-size: 25px;
			margin: 10px 0 0 0;
		}
		.btn {
			background-color: orange;
			width: 100px;
			height: 40px;
			color: #fff;
			text-align: center;
			border-radius: 5%;
			line-height: 40px;
		}
	}
}
</style>
