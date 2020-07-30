/*global chrome*/
export function Json2Array(object) {
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

export function Array2Json(array) {
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

export function checkStorage(callback) {
	chrome.storage.local.get(callback);
}

export function clearStorage() {
	chrome.storage.local.clear();
}