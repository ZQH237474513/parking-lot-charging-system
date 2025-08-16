import localforage from "localforage";

const db = function (app: any) {
	localforage.config({
		driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE], // 指定使用的存储引擎，例如 localStorage
		name: "parking-lot-charging-system", // 存储数据库的名称
		version: 1.0, // 数据库版本号
		storeName: "keyvaluepairs", // 存储对象的仓库名称
	});

	app.config.globalProperties.$localforage = localforage;
};

export default db;
