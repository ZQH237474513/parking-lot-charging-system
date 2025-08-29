import { getCurrentInstance } from "vue";

/**
 * 获取vue实例上的自定义参数
 */
export const getCurrentInstanceParams = (name: string) => {
	const allParams = getCurrentInstance()?.appContext?.config?.globalProperties as any;
	return allParams[`$${name}`];
};

/** 获取当月总金额 */
export const getCurMountTotalPrice = (data: any[]) => {
	return data.reduce((total: number, item: any) => {
		return total + item.totalPrice;
	}, 0);
};

/** 统计当月所有商品数量 */
export const getStatisticsGoodsNumList = (data: any[]) => {
	const goodsList: any[] = [];
	for (let i = 0; i < data.length; i++) {
		const arr: any[] = data[i].goodsList;
		for (let j = 0; j < arr.length; j++) {
			const goods = arr[j];
			const targetIndex = goodsList.findIndex((curGoods) => {
				return curGoods.name === goods.name;
			});

			if (targetIndex !== -1) {
				goodsList[targetIndex].num = (goodsList[targetIndex]?.num || 1) + (goods?.num || 1);
			} else {
				goodsList.push(goods);
			}
		}
	}

	return goodsList;
};
