


function showOptions(result)
{
	document.getElementById('showbg').checked = result.showbg;
}

function onDocLoaded()
{
	chrome.storage.local.get({'showbg':false},showOptions);
	document.getElementById('showbg')
		.addEventListener('click',onSomethingChanged);
}

function onSomethingChanged()
{
	var newOpt = {};
	newOpt.showbg = document.getElementById('showbg').checked;
	chrome.storage.local.set(newOpt, function() {});
}

document.addEventListener('DOMContentLoaded', onDocLoaded);

