<template>
  <view>
    <view class="search"><up-search :show-action="false" placeholder="日照香炉生紫烟"></up-search></view>
    <scroll-view scroll-y scroll-top>
      <view class="goodsList">

        <view v-for="(item, i) in goodsList" class="goodsItem">
          <img :src="item.imgPath" />
          <text class="name">{{ item.name }}</text>
          <text class="price">{{ `价格: ${item.price} 元` }}</text>

        </view>
      </view>
    </scroll-view>
  </view>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getGoodsList } from '../../api/index';

const goodsList = ref([]) as any


onMounted(() => {
  (async () => {
    const goodsListRes = await getGoodsList();
    if (goodsListRes) {
      goodsList.value = goodsListRes;
    }
  })()

})


</script>

<style lang="scss" scoped>
.search {
  position: static;
  top: 0;
  margin: 10px 10px;
}

.goodsList {
  height: 500px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 10px 20px;
  margin: 0 10px; // 左右间隙

  .goodsItem {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .name {
      align-items: center;
      margin-bottom: 5px;

    }

    .price {
      color: red;

    }

    img {
      width: 100%;
      height: 200px;
      border-radius: 10px;
      margin-bottom: 10px;
    }
  }



}
</style>