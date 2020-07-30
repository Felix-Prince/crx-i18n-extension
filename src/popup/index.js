/*global chrome*/
import { youdao, baidu, google } from "translation.js";
import _ from "lodash";
const background = chrome.extension.getBackgroundPage();

export async function translation(content, key, callback) {
	const result = await background.translationHandle(content, key); // 访问bg的函数
	console.log("popup", result);
	var views = chrome.extension.getViews({ type: "popup" });
	if (views.length > 0) {
		callback && callback(result);
	}
}

export function selectedElement() {
	console.log("selectedElement", background.selector);
	return background.selector;
}

export function setStorage(lang, filename, data) {
	background.setStorage(lang, filename, data);
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