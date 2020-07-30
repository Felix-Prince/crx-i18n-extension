var objIcon = document.createElement("span");
objIcon.innerText = "译";
objIcon.style.display = "none";
objIcon.style.position = "absolute";
objIcon.classList.add("crx-extension-icon");
document.body.appendChild(objIcon);

// var selector = null;
var isShowBox = false;
var filename = "";
var datakey = "";

function createPanel() {
	let container = document.createElement("div");
	let template = `
		<div class="Translation_tlContainer__2Jt2_" id="Translation_tlContainer__2Jt2_">
			<div class="Translation_tlHeader__29IRr">
				<h2>翻译</h2>
				<button type="button" class="ant-btn" id="btnSaveEdit">
					<span>保存</span>
				</button>
			</div>
			<div class="Translation_tlBody__1SOcI">
				<div>
					<textarea rows="4" id="targetContent" class="ant-input"></textarea>
				</div>
				<div id="state"></div>
			</div>
		</div>
	`;
	container.innerHTML = template;
	container.id = "crx_extension_container";

	container.classList.add("crx_extension_hide");

	document.body.appendChild(container);
}

createPanel();

document.addEventListener("mouseup", function (ev) {
	ev.stopPropagation();
	var ev = ev || window.event,
		left = ev.pageX,
		top = ev.pageY;

	// 如果有弹框后，在弹框中的选中会影响原先的 data-key ，所以这里在弹框中的选中不执行后续的处理
	if (isShowBox) return;
	const selector = window.getSelection();
	setTimeout(function () {
		if (selector.toString().length > 0) {
			objIcon.style.display = "block";
			objIcon.style.left = left + "px";
			objIcon.style.top = top + "px";
			const tlBox = document.getElementById(
				"Translation_tlContainer__2Jt2_"
			);
			tlBox.style.left = left + "px";
			tlBox.style.top = top + "px";
		}
	}, 200);

	if (selector.toString().trim()) {
		chrome.storage.sync.get({ dataKey: "data-key" }, function (items) {
			dataKey = selector.focusNode.parentNode.getAttribute(
				items.dataKey || "data-key"
			);

			console.log("select start");
			var port = chrome.runtime.connect();
			port.postMessage({
				cmd: "selection",
				selection: {
					text: selector.toString(),
					tagName: selector.focusNode.parentNode.tagName,
					dataKey,
				},
			});

			port.onMessage.addListener(function (msg) {
				console.log("select return", msg);
				document.getElementById("targetContent").value = msg.value
					? msg.value
					: msg;
				filename = msg.filename;
			});
		});
	}
});

objIcon.addEventListener("click", function (e) {
	e.stopPropagation();
	isShowBox = true;
	document
		.getElementById("crx_extension_container")
		.classList.remove("crx_extension_hide");
});

document
	.getElementById("crx_extension_container")
	.addEventListener("click", function (e) {
		e.stopPropagation();
	});

document.addEventListener("click", function (ev) {
	if (!window.getSelection().toString()) {
		objIcon.style.display = "none";
		isShowBox = false;
		document
			.getElementById("crx_extension_container")
			.classList.add("crx_extension_hide");
	}
});

document.getElementById("btnSaveEdit").addEventListener("click", function (e) {
	e.stopPropagation();
	if (!filename) {
		document.getElementById(
			"state"
		).innerText = `翻译来自 google ，请去选项配置页面为 ${dataKey} 增加相应词条！`;
		return;
	}
	var port = chrome.runtime.connect();
	port.postMessage({
		cmd: "saveEdit",
		value: document.getElementById("targetContent").value,
		filename,
		dataKey,
	});

	port.onMessage.addListener(function (msg) {
		document.getElementById("state").innerText = msg;
		setTimeout(function () {
			document.getElementById("state").innerText = "";
		}, 1000);
	});
});
