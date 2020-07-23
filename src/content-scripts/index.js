document.addEventListener("mouseup", function (e) {
    const selectot = window.getSelection()
	if (selectot.toString()) {
		console.log("widnow",selectot.focusNode.parentNode.tagName)
		chrome.runtime.sendMessage({
			selection: {
				text: selectot.toString(),
                tagName: selectot.focusNode.parentNode.tagName,
                dataKey:selectot.focusNode.parentNode.getAttribute('data-key')
			},
		});
	}
});
