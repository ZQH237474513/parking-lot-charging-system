<template></template>
<script setup>
import { onMounted } from 'vue';
import { useApplicationStore } from '@stores';

const { initGoodList } = useApplicationStore();
onMounted(() => {
    initGoodList();

})

</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-plus/index.scss";
</style>
