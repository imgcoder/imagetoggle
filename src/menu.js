
window.addEventListener("DOMContentLoaded"
, function()
{
	chrome.storage.local.get(['main'],function(items){
		var setting = items.main;
		toSelect = "sNeutral";
		if (setting=="allow") toSelect = "sOn";
		if (setting=="block") toSelect = "sOff";
		document.getElementById(toSelect).innerHTML = "&#10004;";
	});
	document.getElementById("imagesOn").addEventListener
		(	"click"
		,	function()
			{
				switchOn();
				window.close();
			}
		);
	document.getElementById("imagesOff").addEventListener
		(	"click"
		,	function()
			{
				switchOff();
				window.close();
			}
		);
	document.getElementById("imagesNeutral").addEventListener
		(	"click"
		,	function()
			{
				switchNeutral();
				window.close();
			}
		);
});

// code similar to background.js

function changeMainSetting(newSetting)
{
	// lg("change main setting to " + newSetting );
	chrome.storage.local.set({'main': newSetting}, function() {});
}

function switchOn()
{
	changeMainSetting('allow');
}

function switchOff()
{
	changeMainSetting('block');
}

function switchNeutral()
{
	changeMainSetting('neutral');
}
