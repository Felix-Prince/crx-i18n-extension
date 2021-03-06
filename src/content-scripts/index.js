var objIcon = document.createElement("span");
objIcon.innerText = "译";
objIcon.style.display = "none";
objIcon.style.position = "absolute";
objIcon.classList.add("crx-extension-icon")
document.body.appendChild(objIcon);

// var selector = null;
var isShowBox = false;

function createPanel() {
	let container = document.createElement("div");
	let template = `
		<div class="Translation_tlContainer__2Jt2_" id="Translation_tlContainer__2Jt2_">
			<div class="Translation_tlHeader__29IRr">
				<h2>翻译</h2>
				<button type="button" class="ant-btn" id="btnSaveEdit">
					<i aria-label="icon: save" class="anticon anticon-save">
						<svg
							viewBox="64 64 896 896"
							focusable="false"
							class=""
							data-icon="save"
							width="1em"
							height="1em"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								d="M893.3 293.3L730.7 130.7c-7.5-7.5-16.7-13-26.7-16V112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V338.5c0-17-6.7-33.2-18.7-45.2zM384 184h256v104H384V184zm456 656H184V184h136v136c0 17.7 14.3 32 32 32h320c17.7 0 32-14.3 32-32V205.8l136 136V840zM512 442c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144-64.5-144-144-144zm0 224c-44.2 0-80-35.8-80-80s35.8-80 80-80 80 35.8 80 80-35.8 80-80 80z"
							></path>
						</svg>
					</i>
					<span>保存</span>
				</button>
			</div>
			<div class="Translation_tlBody__1SOcI">
				<div>
					<textarea rows="4" id="targetContent" class="ant-input"></textarea>
				</div>
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
			const tlBox = document.getElementById("Translation_tlContainer__2Jt2_")
			tlBox.style.left = left + "px";
			tlBox.style.top = top + "px";
		}
	}, 200);

	if (selector.toString().trim()) {
		chrome.storage.sync.get({ dataKey: "data-key" }, function (items) {
			const dataKey = selector.focusNode.parentNode.getAttribute(
				items.dataKey || "data-key"
			);

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
				document.getElementById("targetContent").innerText = msg;
			});
		});
	}
});

objIcon.addEventListener("click", function (e) {
	e.stopPropagation()
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
	chrome.storage.sync.get({ dataKey: "data-key" }, function (items) {
		const dataKey = selector.focusNode.parentNode.getAttribute(
			items.dataKey || "data-key"
		);
		var port = chrome.runtime.connect();
		port.postMessage({
			cmd: "saveEdit",
			value: document.getElementById("targetContent").value,
			dataKey,
		});
	});
});
