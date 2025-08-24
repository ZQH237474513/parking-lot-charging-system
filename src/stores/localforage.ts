import localforage from "localforage";

const db = function (app: any) {
	let localStorage = {} as any;
	localforage.config({
		driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE], // 指定使用的存储引擎，例如 localStorage
		name: "parking-lot-charging-system", // 存储数据库的名称
		version: 1.0, // 数据库版本号
		storeName: "keyvaluepairs", // 存储对象的仓库名称
	});

	localStorage.getItem = (key: string) => {
		return JSON.parse(uni.getStorageSync(key) || "null");
	};
	localStorage.setItem = (key: string, data: any) => {
		uni.setStorageSync(key, JSON.stringify(data));
	};

	// #ifdef H5
	localStorage = localforage;
	// #endif

	app.config.globalProperties.$localforage = localStorage;
};

export default db;
