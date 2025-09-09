<template>
	<view class="content">

		<view class="item">
			<up-button type="primary" shape="circle" text="外部车辆维修账单" plain @click="addExternalBill"></up-button>
			<up-button shape="circle" text="内部车辆维修账单" plain @click="addInteriorBill"></up-button>

		</view>

		<image :src="img" mode="scaleToFill" />
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
import { ref } from 'vue';
import { useApplicationStore } from '@stores';
import { createWorker } from 'tesseract.js';
const img = ref('');

const applicationStore = useApplicationStore();

const addExternalBill = () => {
	uni.navigateTo({
		url: '../goodsList/goodsList?type=add'
	});
};

function extractNumbers(str) {
	return str
		.split('')
		.filter((item) => {
			return !isNaN(Number.parseInt(item, 10)) && item !== '';
		})
		.join('');
}
const addInteriorBill = () => {
	// console.log(createWorker);

	uni.chooseImage({
		count: 1, //默认9
		sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
		// sourceType: ['album'], //从相册选择
		success: async (res) => {
			img.value = res.tempFilePaths[0];
			console.log(res.tempFilePaths[0]);
			console.log("===>");

			const worker = await createWorker(['eng', 'chi_sim'], 1, {
				corePath: '../../../node_modules/tesseract.js-core',
				workerPath: "../../../node_modules/tesseract.js/dist/worker.min.js",
				logger: function (m) { console.log(m); }
			});

			const result = await worker.recognize('../../static/image/ocr.png'); // 进行文字识别
			console.log(result.data);

			img.value = (result.data.text.match(/\d{12,}/g) || [])[0];

			worker.terminate(); // 终止 worker，释放资源
		}
	});
};
</script>
