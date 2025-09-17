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
		// 过滤掉内部订单金额
		if (item.isInnerOrder) {
			return total;
		} else {
			return total + item.totalPrice;
		}
	}, 0);
};

/** 统计当月所有商品数量 */
export const getStatisticsGoodsNumList = (data: any[]) => {
	let goodsList: any[] = [];
	for (let i = 0; i < data.length; i++) {
		const arr: any[] = JSON.parse(JSON.stringify(data))[i].goodsList;
		for (let j = 0; j < arr.length; j++) {
			const goods = arr[j];
			const targetIndex = goodsList.findIndex((curGoods) => {
				return curGoods.name === goods.name;
			});

			if (targetIndex !== -1) {
				goodsList[targetIndex].num += goods?.num || 1;
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
				const totalPrice = getCurMountTotalPrice(mountList[key]);
				calendarData.push({ date, info: `${totalPrice}元` });
			}
		}

		return { billList: allData, calendarData };
	};

	return { columns, metaData: data, getBillDataList };
};

/** 复制文本 */
export const copyJsonToClipboard = (json: any) => {
	uni.setClipboardData({
		data: JSON.stringify(json, null, 2),
		success: function () {
			console.log("success");
		},
	});
};

export const isHttpStart = (url: string) => {
	return /^(http|https)?:\/\//i.test(url);
};

export const getUrlParams = (url: string) => {
	const reg = /(\w+)=([^&]+)/g;
	const params: any = {};
	let match;

	while ((match = reg.exec(url)) !== null) {
		params[match[1]] = match[2];
	}

	return params;
};
