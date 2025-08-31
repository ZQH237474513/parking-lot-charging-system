import { getCurrentInstance } from "vue";
import moment from "moment";

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

/**
 * 格式化账单数据
 */

export const getFormatBillList = (data: any[]) => {
	const yearList: any = Object.keys(data).sort((a: any, b: any) => b - a);
	const mountList = Object.keys(data[yearList[0]]);
	const columns = [yearList, mountList];
	const curYear = moment().year();
	const curMonth = moment().month() + 1;

	const getBillDataList = ([yearNum, mountNum]: any[] = [curYear, curMonth]) => {
		const mountList = data[yearNum][mountNum];
		const values = Object.values(JSON.parse(JSON.stringify(mountList || {})));

		let allData: any = [];
		for (const item of values) {
			allData.push(...(item as any));
		}

		allData = allData.sort((a: any, b: any) => {
			return (
				moment(b.createTime, "YYYY年MM月DD日 HH:mm:ss").valueOf() -
				moment(a.createTime, "YYYY年MM月DD日 HH:mm:ss").valueOf()
			);
		});

		const calendarData: any[] = [];

		for (const key in mountList) {
			if (Object.prototype.hasOwnProperty.call(mountList, key)) {
				const date = `${yearNum}-${mountNum}-${key}`;
				const totalPrice = mountList[key].reduce((total: number, item: any) => {
					return total + item.totalPrice;
				}, 0);
				calendarData.push({ date, info: `${totalPrice}元` });
			}
		}

		return { billList: allData, calendarData };
	};

	return { columns, metaData: data, getBillDataList };
};
