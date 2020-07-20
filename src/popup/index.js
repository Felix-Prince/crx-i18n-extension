/*global chrome*/
export function translation(params) {
	var bg = chrome.extension.getBackgroundPage();
	bg.translationHandle(params); // 访问bg的函数
}

