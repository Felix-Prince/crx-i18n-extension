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

document.getElementById("saveOption").addEventListener("click", save_options);

document.addEventListener("DOMContentLoaded", restore_options);
