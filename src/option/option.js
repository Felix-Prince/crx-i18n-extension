/*global chrome*/
import { Json2Array, Array2Json } from "../utils";
const background = chrome.extension.getBackgroundPage();

console.log("background", background);

export function getStorage(key, callback) {
	chrome.storage.local.get({ [key]: "" }, function (items) {
		const temp = items[key];
		console.log("items", temp);
		const res = {};
		for (const k in temp) {
			if (k === "fileList") {
				res[k] = temp[k];
			} else {
				res[k] = Json2Array(temp[k]);
			}
		}
		console.log("result", res);
		callback && callback(res);
	});
}

export function setStorage(key, data, type = "edit") {
	console.log("setStorage", data);
	let newData = {};

	if (type === "import") {
		newData = data;
	} else {
		for (const k in data) {
			if (k === "fileList") {
				newData[k] = data[k];
			} else {
				newData[k] = Array2Json(data[k]);
			}
		}
	}

	console.log("array", newData);
	chrome.storage.local.set({ [key]: newData }, function () {
		console.log("保存成功！");
		chrome.storage.local.get((items) => {
			console.log("setSroage", items);
		});
	});
}

function save_options(e) {
	chrome.storage.sync.set(
		{
			dataKey: document.getElementById("setKey").value,
		},
		function () {
			// 更新状态，告诉用户选项已保存。
			var status = document.getElementById("status");
			status.textContent = "选项已保存。";
			setTimeout(function () {
				status.textContent = "";
			}, 750);
		}
	);
}

// 从保存在 chrome.storage 中的首选项恢复选择框和复选框状态。
function restore_options() {
	chrome.storage.sync.get({ dataKey: "data-key" }, function (items) {
		document.getElementById("setKey").value = items.dataKey;
	});
}

// document.getElementById("saveOption").addEventListener("click", save_options);

// document.addEventListener("DOMContentLoaded", restore_options);

export function exportFile(lang, filename, callback) {
	chrome.storage.local.get({ [lang]: "" }, (items) => {
		callback && callback(items[lang][filename]);
	});
}
