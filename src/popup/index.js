/*global chrome*/
import { youdao, baidu, google } from "translation.js";
import _ from "lodash";
const background = chrome.extension.getBackgroundPage();

export async function translation(params, callback) {
	const result = await background.translationHandle(params); // 访问bg的函数
	var views = chrome.extension.getViews({ type: "popup" });
	if (views.length > 0) {
		console.log("translation", result);
		callback && callback(result.result[0]);
	}
}

export function selectedElement() {
	console.log("selectedElement", background.selector);
	return background.selector;
}

export function setStorage(lang, data) {
	chrome.storage.local.get({ [lang]: "" }, (items) => {
		const allData = items[lang];
		console.log("alldata", items[lang]);
		chrome.storage.local.set(
			{ "zh-CN": _.merge(allData, data) },
			function () {
				console.log("保存成功！");
				chrome.storage.local.get((items) => {
					console.log("setSroage", items);
				});
			}
		);
	});
}

export function getStorage(text, key, SuccessCallback, FailCallback) {
	google.detect(text).then((lang) => {
		console.log("lang", lang); // => 'en'
		chrome.storage.local.get({ [lang]: "" }, function (items) {
			if (!_.isEmpty(items) && !_.isEmpty(items[lang])) {
				SuccessCallback &&
					SuccessCallback(items[lang][key], "targetContent");
				// document.getElementById("targetContent").value = items[key];
			} else {
				FailCallback && FailCallback();
			}
		});
	});
}

export function exportFile(callback) {
	chrome.storage.local.get(callback);
}

export function clearStorage() {
	chrome.storage.local.clear();
}
