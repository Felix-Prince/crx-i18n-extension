document.addEventListener("mouseup", function (e) {
	const selectot = window.getSelection();
	if (selectot.toString()) {
		chrome.runtime.sendMessage({
			cmd: "selection",
			selection: {
				text: selectot.toString(),
				tagName: selectot.focusNode.parentNode.tagName,
				dataKey: selectot.focusNode.parentNode.getAttribute("data-key"),
			},
		});
	}
});
