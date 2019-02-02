


function showOptions(result)
{
	document.getElementById('showBg').checked = result.showBg;
}

function onDocLoaded()
{
	chrome.storage.local.get({'showBg':false},showOptions);
	document.getElementById('showBg')
		.addEventListener('click',onSomethingChanged);
}

function onSomethingChanged()
{
	var newOpt = {};
	newOpt.showBg = document.getElementById('showBg').checked;
	chrome.storage.local.set(newOpt, function() {});
}

document.addEventListener('DOMContentLoaded', onDocLoaded);

