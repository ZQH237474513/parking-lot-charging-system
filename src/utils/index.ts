import { getCurrentInstance } from "vue";

/**
 * 获取vue实例上的自定义参数
 */
export const getCurrentInstanceParams = (name: string) => {
	const allParams = getCurrentInstance()?.appContext?.config?.globalProperties as any;
	return allParams[`$${name}`];
};
