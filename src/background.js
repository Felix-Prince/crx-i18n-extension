var selector = null;
async function translationHandle(content) {
	const { youdao, baidu, google } = window.tjs;
	
	const result = await google.translate(content);

	return result;
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
			const result = await translationHandle(selector.text);
			port.postMessage(result.result[0]);
		}
	});
});
