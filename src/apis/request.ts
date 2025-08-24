const { VITE_BASIC_API, VITE_APP_URL, DEV } = import.meta.env;

interface request {
	url: string;
	method?: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | undefined;
	data?: any;
	header?: Object;
}

let basicUrl = "";
const timeout = 5000;

const request = (config: request) => {
	config.url = `${basicUrl}${config.url}`;

	return new Promise((resolve) => {
		const { url, method = "GET", data, header } = config;
		let baiscUrl = `${VITE_APP_URL}${url}`;
		// #ifdef APP
		if (DEV) {
			baiscUrl = `https://gitee.com${url}`;
		}
		// #endif
		console.log(baiscUrl);
		uni.request({
			url: baiscUrl,
			method,
			data,
			timeout,
			header: {
				...header,
			},
			success: (res) => {
				switch (res.statusCode) {
					case 200:
						resolve(res.data);
						return;
					default:
						resolve([]);
						return;
				}
			},
		});
	});
};

export default request;
