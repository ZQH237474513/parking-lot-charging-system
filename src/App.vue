<template></template>
<script setup>
import { onMounted, onUpdated } from "vue";
import { useApplicationStore } from "@stores";
import { onLaunch, onShow } from '@dcloudio/uni-app';
import moment from 'moment';

const { initGoodList, initUserInfo, isLoginHandle } = useApplicationStore();

const checkLogin = async () => {

	const userInfo = await isLoginHandle();
	if (userInfo) {
		const { time } = userInfo;
		const beforTiem = moment(time, 'YYYY年MM月DD日 HH:mm:ss');
		const nowTiem = moment();
		const diffInDays = nowTiem.diff(beforTiem, 'day');

		if (diffInDays < 7) {
			uni.switchTab({
				url: `./pages/home/home`
			});
		} else {
			await localforage.removeItem('userInfo');
			uni.showToast({
				icon: 'error',
				title: '验证信息过期,请重新登陆!',
				duration: 1000
			});
			uni.navigateTo({
				url: `./pages/login/login`
			});
		}
	} else {
		uni.navigateTo({
			url: `./pages/login/login`
		});
	}
}

onMounted(() => {
	initGoodList();
	initUserInfo();
});

onShow(() => {
	checkLogin()
})
onLaunch(() => {
	checkLogin()
})

</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-plus/index.scss";
</style>
