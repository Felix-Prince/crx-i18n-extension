var selector = null;
async function translationHandle(content, key) {
	const { youdao, baidu, google } = window.tjs;

	const lang = await google.detect(content);

	let yamlResult = await translationFromYaml(lang, key);

	console.log("background", yamlResult);

	if (yamlResult) {
		return yamlResult;
	} else {
		const result = await google.translate(content);
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
				selector.text,
				selector.dataKey
			);
			port.postMessage(result);
		} else if (msg.cmd === "saveEdit") {
			const { value, dataKey } = msg;
			setStorage("zh-CN", { [dataKey]: value });
		}
	});
});
