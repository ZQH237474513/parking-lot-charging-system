<template>
	<view>
		<view class="search"
			><up-search
				@search="clickSearch"
				@clear="handleClear"
				@change="handleChange"
				:show-action="false"
				placeholder="搜索商品"></up-search>
		</view>
		<scroll-view
			scroll-y
			scroll-top>
			<view class="goodsList">
				<view
					@click="() => handleSelect(item)"
					v-for="(item, i) in targetList"
					:id="item.id"
					:class="selectedIds.includes(item.id) ? 'goodsItem active' : 'goodsItem'">
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
				<view class="fix"></view>
			</view>
		</scroll-view>

		<view
			v-if="isSelected"
			class="bottomSubmit">
			<up-button
				type="primary"
				shape="circle"
				text="提交"
				@click="handleSubmit"></up-button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useApplicationStore } from "@stores";

const { goodsList } = useApplicationStore();

const targetList = ref([]) as any;
const selectedIds = ref([]) as any; // 选中的ids
const isSelected = ref(false); // 是否可选中

targetList.value = goodsList;

onLoad((option: any) => {
	const { type = "view", id } = option;

	if (type !== "view") {
		isSelected.value = true;
	}
});

const initData = () => {
	targetList.value = goodsList;
};

const clickSearch = (value: string) => {
	targetList.value = goodsList.filter((item: any) => {
		return String(item.name).indexOf(value) !== -1;
	});
};

const handleChange = (value: string) => {
	if (!value) {
		initData();
	}
};

const handleClear = () => {
	initData();
};

const handleSelect = (val: any) => {
	if (!isSelected.value) {
		return;
	}
	const curIndex = selectedIds.value.findIndex((item: string) => {
		return item === val.id;
	});

	if (curIndex !== -1) {
		selectedIds.value.splice(curIndex, 1);
	} else {
		selectedIds.value.push(val.id);
	}
};

const handleSubmit = () => {
	if (!selectedIds.value.length) {
		return;
	}
	uni.navigateTo({
		url: `../billDetail/billDetail?ids=${selectedIds.value.join(",")}`,
	});
};
</script>

<style lang="scss" scoped>
::v-deep .uni-scroll-view-content {
	margin-bottom: 330px;
}

.search {
	position: static;
	top: 0;
	margin: 10px 10px;
}

.goodsList {
	height: 800px;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	grid-gap: 10px 20px;
	margin: 0 10px; // 左右间隙

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
	.fix {
		height: 300px;
	}
}

.bottomSubmit {
	width: 100%;
	height: 30px;
	background: transparent;
	position: fixed;
	bottom: 30px;
	padding: 0 80px;
	box-sizing: border-box;
}
</style>
