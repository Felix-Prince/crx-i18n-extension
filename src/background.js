var selector = null;
async function translationHandle(content, key) {
	const { youdao, baidu, google } = window.tjs;

	if (!content.text) return "";
	let fromLang = await google.detect(content.text);
	let toLang = content.to;

	// 如果没有设置目标语言，则自动检测
	if (!toLang) {
		toLang = fromLang === "zh-CN" ? "en" : "zh-CN";
	}
	// 如果源语言和目标语言都是 en 的时候，设置目标语言为中文，因为默认目标语言是 en，所以排除该情况
	if (fromLang === "en" && toLang === "en") {
		toLang = "zh-CN";
		content.to = toLang;
	}

	let yamlResult = await translationFromYaml(toLang, key);

	console.log("background", toLang);

	if (yamlResult) {
		return yamlResult;
	} else {
		const result = await google.translate({ ...content, from: fromLang });
		return result.result[0];
	}
}

function translationFromYaml(lang, key) {
	return new Promise((resolve) => {
		chrome.storage.local.get({ [lang]: "" }, function (items) {
			// 如果没有数据的时候也通过resolve 返回，不用 reject，
			resolve(items[lang][key] || "");
		});
	});
}

function setStorage(lang, data) {
	chrome.storage.local.get({ [lang]: "" }, (items) => {
		const allData = items[lang];
		console.log("alldata", items[lang]);
		chrome.storage.local.set(
			{ "zh-CN": { ...allData, ...data } },
			function () {
				console.log("保存成功！");
				chrome.storage.local.get((items) => {
					console.log("setSroage", items);
				});
			}
		);
	});
}

chrome.runtime.onConnect.addListener(function (port) {
	port.onMessage.addListener(async function (msg) {
		if (msg.cmd === "selection") {
			selector = msg.selection;
			console.log("selector", selector);
			const result = await translationHandle(
				{ text: selector.text },
				selector.dataKey
			);
			port.postMessage(result);
		} else if (msg.cmd === "saveEdit") {
			const { value, dataKey } = msg;
			setStorage("zh-CN", { [dataKey]: value });
		}
	});
});
