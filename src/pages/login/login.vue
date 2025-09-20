<template>
	<view class="loginWrapper">
		<view class="login">
			<view class="logo">秒接单收银系统</view>
			<up-form :model="state.form" :rules="state.rules" ref="uFormRef">
				<up-form-item label="账号:" prop="accountNumber">
					<up-input v-model="state.form.accountNumber" placeholder="请输入账号" clearable />
				</up-form-item>
				<up-form-item label="密码:" prop="password">
					<up-input type="password" v-model="state.form.password" placeholder="请输入密码" clearable
						passwordVisibilityToggle />
				</up-form-item>
			</up-form>
			<up-button @click="submit" type="primary">登陆</up-button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, reactive } from 'vue';
import { useApplicationStore } from '@stores';
import { getCurrentInstanceParams } from '@utils';
import { onLoad } from '@dcloudio/uni-app';

const localforage = getCurrentInstanceParams('localforage');

const { userInfoList, isLoginHandle } = useApplicationStore();
const uFormRef = ref(null) as any;

const state = reactive({
	form: {
		accountNumber: null,
		password: null
	},
	rules: {
		accountNumber: [
			{
				required: true,
				message: '请输入账号',
				trigger: ['blur', 'change']
			}
		],
		password: [
			{
				required: true,
				message: '请输入密码',
				trigger: ['blur', 'change']
			}
		]
	}
});

const submit = async () => {
	const valiRes = await uFormRef.value.validate();
	if (!valiRes) {
		return;
	}

	const { accountNumber, password } = state.form;
	console.log(userInfoList);
	const target = JSON.parse(JSON.stringify(userInfoList)).find((item: any) => {
		return item.accountNumber === accountNumber;
	});

	if (target) {
		if (String(target.password) === String(password)) {
			await localforage.setItem('userInfo', {
				...target,
				time: '2025年09月18日 03:00:10'
				// time: moment().format("YYYY年MM月DD日 HH:mm:ss"),
			});
			uni.switchTab({
				url: `../home/home`
			});
			isLoginHandle();
		} else {
			uni.showToast({
				icon: 'error',
				title: '密码错误！',
				duration: 1000
			});
		}
	} else {
		uni.showToast({
			icon: 'error',
			title: '账号不存在！',
			duration: 1000
		});
	}
};
</script>

<style lang="scss" scoped>
.loginWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;

	.login {
		width: 100%;
		margin: 0 50px;

		.logo {
			font-weight: bold;
			font-size: 25px;
			text-align: center;
			margin-bottom: 50px;
		}
	}
}
</style>
