function translationHandle(content) {
	const { youdao, baidu, google } = window.tjs;
	google.translate(content).then((result) => {
		var views = chrome.extension.getViews({ type: "popup" });
		if (views.length > 0) {
			views[0].document.getElementById("targetContent").innerText =
				result.result[0];
		}
	});
}

function test(params) {
	console.log("+++", params);
}
