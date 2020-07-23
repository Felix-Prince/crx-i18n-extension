/*global chrome*/
const background = chrome.extension.getBackgroundPage();

export function translation(params, callback) {
	background.translationHandle(params, callback); // 访问bg的函数
}

export function selectedElement() {
	return background.selector;
}

export function setStorage(data) {
	chrome.storage.local.set(data, function () {
		console.log("保存成功！");
		chrome.storage.local.get(items => {
			console.log("items",items)
		});
	});
}

export function getStorage(key, SuccessCallback, FailCallback) {
	chrome.storage.local.get({ [key]: "" }, function (items) {
		console.log("items", items);
		if (items[key]) {
			SuccessCallback && SuccessCallback(items[key], "targetContent");
			// document.getElementById("targetContent").value = items[key];
		} else {
			FailCallback && FailCallback();
		}
	});
}

export function exportFile(callback) {
	chrome.storage.local.get(callback);
}
