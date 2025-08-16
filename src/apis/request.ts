const { VITE_BASIC_API, VITE_APP_URL } = import.meta.env;

interface request {
	url : string;
	method ?: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | undefined;
	data ?: any;
	header ?: Object;
}

let basicUrl = "";
const timeout = 5000;

const request = (config : request) => {
	config.url = `${basicUrl}${config.url}`;
	return new Promise((resolve) => {
		const { url, method = "GET", data, header } = config;
		const baiscUrl = `${VITE_APP_URL}${url}`;
		console.log(baiscUrl)
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
						return;
				}
			},
		});
	});
};

export default request;