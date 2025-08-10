<template>
  <view>
    <view class="search"><up-search focus @search="clickSearch" @clear="handleClear" @change="handleChange"
        :show-action="false" placeholder="搜索商品"></up-search>
    </view>
    <scroll-view scroll-y scroll-top>
      <view class="goodsList">

        <view v-for="(item, i) in targetList" class="goodsItem">
          <up-image :show-loading="true" :src="item.imgPath" width="100%" radius="10px" height="150px"
            lazyLoad></up-image>

          <view class="priceName">
            <text class="name">{{ item.name }}</text>
            <text class="price">{{ `价格: ${item.price} 元` }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getGoodsList } from '../../api/index';

const goodsList = ref([]) as any;
const targetList = ref([]) as any;

onMounted(() => {
  (async () => {
    const goodsListRes = await getGoodsList();
    if (goodsListRes) {
      goodsList.value = goodsListRes;
      targetList.value = goodsListRes;
    }
  })()

})

const initData = () => {
  targetList.value = goodsList.value;
}

const clickSearch = (value: string) => {
  targetList.value = goodsList.value.filter((item: any) => {
    return String(item.name).indexOf(value) !== -1
  });


}

const handleChange = (value: string) => {
  if (!value) {
    initData()
  }
}

const handleClear = () => {
  initData()
}


</script>

<style lang="scss" scoped>
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



}
</style>