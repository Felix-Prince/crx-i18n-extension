var selector = null;
async function translationHandle(content, key) {
	const { youdao, baidu, google } = window.tjs;

	const lang = await google.detect(content);

	let yamlResult = await translationFromYaml(lang, key);

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
			if (items[lang][key]) {
				resolve(items[lang][key]);
			}
		});
	});
}

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
// 	if (request.cmd === "selection") {
// 		selector = request.selection;
// 		console.log("selector", selector);
// 		translationHandle(selector.text, (result) => {
// 			sendResponse({ translateValue: result });
// 		});
// 	}
// });

chrome.runtime.onConnect.addListener(function (port) {
	port.onMessage.addListener(async function (msg) {
		if (msg.cmd === "selection") {
			selector = msg.selection;
			const result = await translationHandle(
				selector.text,
				selector.dataKey
			);
			port.postMessage(result);
		}
	});
});
