import request from "./request";

const { VITE_BASIC_API } = import.meta.env;

export const getGoodsList = () => {
	return request({
		url: `${VITE_BASIC_API}/zqhweb/localstorage/raw/master/publice/parking-lot-charging-system/json/data.json`,
	});
};
