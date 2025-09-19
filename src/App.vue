<template></template>
<script setup>
import { onMounted, onUpdated } from "vue";
import { useApplicationStore } from "@stores";

const { initGoodList, initUserInfo } = useApplicationStore();
onMounted(() => {
	initGoodList();
	initUserInfo();
});

</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-plus/index.scss";
</style>
