const SYSTEM_INFO = uni.getSystemInfoSync();

console.log(SYSTEM_INFO);

/** 手机状态栏高度 */
export const getSatusBarHeight: () => number = () => SYSTEM_INFO.statusBarHeight || 15;

/** 标题栏高度 */
export const getTitleBarHeight: () => number = () => {
	if (uni.getMenuButtonBoundingClientRect) {
		const { height = 0, top = 0 } = uni.getMenuButtonBoundingClientRect();
		return height + (top - getSatusBarHeight()) * 2;
	}

	return 40;
};

export const winHW = (): any => {
	return {
		height: SYSTEM_INFO.windowHeight,
		width: SYSTEM_INFO.windowWidth,
	};
};
