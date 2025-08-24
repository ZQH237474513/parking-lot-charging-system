import request from "./request";

const { VITE_BASIC_API, DEV } = import.meta.env as any;

export const getGoodsList = () => {
	let url = `${VITE_BASIC_API}/zqhweb/localstorage/raw/master/publice/parking-lot-charging-system/json/data.json`;
	// #ifdef APP
	url = `/zqhweb/localstorage/raw/master/publice/parking-lot-charging-system/json/data.json`;
	// #endif
	return request({
		url,
	});
};
