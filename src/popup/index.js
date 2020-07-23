/*global chrome*/
/*global saveAs*/
const background = chrome.extension.getBackgroundPage();

export function translation(params) {
	background.translationHandle(params); // 访问bg的函数
}

export function selectedElement() {
	return background.selector;
}

export function setStorage(data) {
	chrome.storage.local.set(data, function () {
		console.log("保存成功！");
	});
}

export function getStorage(key, callback) {
	chrome.storage.local.get({ [key]: "" }, function (items) {
		console.log("items",items)
		if (items[key]) {
			document.getElementById("targetContent").innerText = items[key];
		} else {
			callback && callback();
		}
	});
}

export function exportFile(callback) {
	chrome.storage.local.get(callback);
}
