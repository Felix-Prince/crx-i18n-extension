var selector = null;
async function translationHandle(content, key) {
	const { youdao, baidu, google } = window.tjs;

	if (!content.text) return "";
	let fromLang = await google.detect(content.text);
	let toLang = content.to;

	// 如果没有设置目标语言，则自动检测
	// if (!toLang) {
	// 	toLang = fromLang === "zh-CN" ? "en" : "zh-CN";
	// }
	// // 如果源语言和目标语言都是 en 的时候，设置目标语言为中文，因为默认目标语言是 en，所以排除该情况
	// if (fromLang === "en" && toLang === "en") {
	// 	toLang = "zh-CN";
	// 	content.to = toLang;
	// }

	let yamlResult = await translationFromYaml(toLang, key);

	console.log("background", toLang, yamlResult);

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
			console.log("bgItem", items);
			// 如果没有数据的时候也通过resolve 返回，不用 reject，
			const temp = items[lang];
			for (const k in temp) {
				if (temp[k].hasOwnProperty(key)) {
					resolve({ filename: k, value: temp[k][key] });
				}
			}
			resolve("");
		});
	});
}

function setStorage(lang, filename, data) {
	chrome.storage.local.get({ [lang]: "" }, (items) => {
		const allData = items[lang];
		console.log("alldata", items[lang]);
		chrome.storage.local.set(
			{
				[lang]: {
					[filename]: { ...allData[filename], ...data },
					fileList: allData["fileList"],
				},
			},
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
				{ text: selector.text, to: "en" },
				selector.dataKey
			);
			port.postMessage(result);
		} else if (msg.cmd === "saveEdit") {
			const { value, dataKey, filename } = msg;
			// 界面上小弹框默认只是 en
			setStorage("en", filename, { [dataKey]: value });
			port.postMessage("词条修改成功！")
		}
	});
});
