/*global chrome*/
const background = chrome.extension.getBackgroundPage();

console.log("background", background);

export function getStorage(key, callback) {
	chrome.storage.local.get({ [key]: "" }, function (items) {
		console.log("items", items);
		callback &&
			callback(key === "fileList" ? items[key] : Json2Array(items[key]));
	});
}

export function setStorage(key, data) {
	let newData = data;
	if (Array.isArray(data) && key !== "fileList") {
		console.log("array", Array2Json(data));
		newData = Array2Json(data);
	}
	chrome.storage.local.set({ [key]: newData }, function () {
		console.log("保存成功！");
		chrome.storage.local.get((items) => {
			console.log("setSroage", items);
		});
	});
}

function Json2Array(object) {
	let data = [];
	for (const key in object) {
		const obj = {};
		if (typeof object[key] === "string") {
			obj.key = key;
			obj.entry = object[key];
			data.push(obj);
		}
		if (typeof object[key] === "object") {
			obj.key = key;
			obj.children = Json2Array(object[key]);
			data.push(obj);
			// data = [...data, ...Json2Array(object[key], key)];
		}
	}
	return data;
}

function Array2Json(array) {
	const obj = {};
	array.forEach((item) => {
		if (item.children) {
			obj[item.key] = Array2Json(item.children);
		} else {
			obj[item.key] = item.entry;
		}
	});
	return obj;
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

export function exportFile(callback) {
	chrome.storage.local.get(callback);
}

export function clearStorage() {
	chrome.storage.local.clear();
}
