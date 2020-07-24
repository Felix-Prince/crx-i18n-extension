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
