var selector = null;
function translationHandle(content, callback) {
	const { youdao, baidu, google } = window.tjs;
	google.translate(content).then((result) => {
		var views = chrome.extension.getViews({ type: "popup" });
		if (views.length > 0) {
			callback && callback(result.result[0], "targetContent");
			// views[0].document.getElementById("targetContent").value =
			// 	result.result[0];
		}
	});
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.cmd === "selection") {
		selector = request.selection;
		console.log("selector", selector);
	}
});
