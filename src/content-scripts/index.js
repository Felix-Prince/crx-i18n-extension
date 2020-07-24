var objImg = new Image();
objImg.src = "logo192.png";
objImg.style.display = "none";
objImg.style.position = "absolute";
objImg.style.width = "16px";
objImg.style.height = "16px";
objImg.style.cursor = "pointer";
document.body.appendChild(objImg);

function createPanel() {
	let container = document.createElement("div");
	let template = `
		<div class="Translation_tlContainer__2Jt2_">
			<div class="Translation_tlHeader__29IRr">
				<h2>翻译</h2>
				<button type="button" class="ant-btn">
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
		left = ev.clientX,
		top = ev.clientY;

	const selectot = window.getSelection();
	setTimeout(function () {
		if (selectot.toString().length > 0) {
			objImg.style.display = "block";
			objImg.style.left = left + "px";
			objImg.style.top = top + "px";
		}
	}, 200);

	if (selectot.toString()) {
		// chrome.runtime.sendMessage(
		// 	{
		// 		cmd: "selection",
		// 		selection: {
		// 			text: selectot.toString(),
		// 			tagName: selectot.focusNode.parentNode.tagName,
		// 			dataKey: selectot.focusNode.parentNode.getAttribute(
		// 				"data-key"
		// 			),
		// 		},
		// 	},
		// 	() => {
		// 		document
		// 			.getElementById("crx_extension_container")
		// 			.classList.remove("crx_extension_hide");

		// 		document.getElementById("targetContent").innerText =
		// 			result.result[0];
		// 	}
		// );

		var port = chrome.runtime.connect();
		port.postMessage({
			cmd: "selection",
			selection: {
				text: selectot.toString(),
				tagName: selectot.focusNode.parentNode.tagName,
				dataKey: selectot.focusNode.parentNode.getAttribute("data-key"),
			},
		});

		port.onMessage.addListener(function (msg) {
			document.getElementById("targetContent").innerText = msg;
		});
	}
});

objImg.addEventListener("click", function (e) {
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
		objImg.style.display = "none";
		document
			.getElementById("crx_extension_container")
			.classList.add("crx_extension_hide");
	}
});
