
// if enabled, will log to the console of the background page
var debugLog = false;

// mainSetting can be: allow, block, neutral
// by default (initial install), we take user settings
var mainSetting = "neutral";

// for debugging without setting
// this line: chrome.storage.local.remove('main');

// get current setting, and apply it
chrome.storage.local.get(['main'],function(result){
	// initially it will be undefined
	if (typeof(result.main)!='undefined'
	&& result.main!='')
	{
		mainSetting = result.main;
	}
	applyMainSetting();
});

createContextMenu();

// attach event listeners

// respond to questions from content.js
// there is currently only one question,
// and that is, if images are enabled
// (for a site)
chrome.runtime.onMessage.addListener
(	function(request, sender, sendResponse) 
	{
		// lg("message from " + sender.tab.url);
		chrome.contentSettings.images.get
		(	{ primaryUrl: sender.tab.url }
		,	function(details)
			{
				var isItOn = false;
				if (details.setting=="allow") isItOn = true;
				lg("images for " + sender.tab.url + ": " +  isItOn);
				sendResponse({img_on:isItOn});
			}
		);
		return true;
	}
);

// detect if settings are changed
// this happens when user selects in menu
chrome.storage.onChanged.addListener(function(changes, namespace) {
	lg("Setting changed to " + changes.main.newValue);
	mainSetting = changes.main.newValue;
	applyMainSetting();
});

// Images on and Image off by a shortcut.
chrome.commands.onCommand.addListener(function(command) {
	lg('Command:' + command);
	if (mainSetting=="allow" || mainSetting=="neutral"){
		switchOff();
	} else
	if (mainSetting=="block"){
		switchOn();
	}
});

// Respond to click to show a single image
chrome.contextMenus.onClicked.addListener(
	function(info, tab) {
		
		var imageSrcUrl = info.srcUrl;
		var tabUrl = tab.url;
		lg("Show an image on " + tabUrl);

		// it is the tab domain that counts,
		// not the image domain (for whatever reason)
		var matches = tabUrl.match(".*://.*?/");
		if (matches.length<1) return;
		var tabDomain = matches[0];
		
		lg("temp allow " + tabDomain);
		
		var mySettings = { primaryPattern: tabDomain + '*'
			, secondaryPattern: '<all_urls>'
			, setting: 'allow'};
		// temporarily allow the url that must provide the image.
		chrome.contentSettings.images.set(mySettings);

		// the variable imageSrcUrl will be used by editpage
		var set_imageSrcUrl = "var imageSrcUrl = \"" + imageSrcUrl + "\";";
		chrome.tabs.executeScript(null, {code: set_imageSrcUrl});
		chrome.tabs.executeScript(null, {file: "editpage.js"},function(){
			// This is executed whem editpage is finished.
			// Restore old settings
			applyMainSetting();
		});	

	}

)

// Other functions

function changeMainSetting(newSetting)
{
	lg("change main setting to " + newSetting );
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

function applyMainSetting()
{
	lg("Apply " + mainSetting );
	var ct = chrome.contentSettings.images;
	ct.clear({});
	if (mainSetting!='block'
	&& mainSetting!='allow')
	{
		return;
	}
	ct.set(
		{	primaryPattern : 'http://*/*'
		,	setting : mainSetting
		} );
	ct.set(
		{	primaryPattern : 'https://*/*'
		,	setting : mainSetting
		} );
}

// context menu item handling

function createContextMenu()
{
	chrome.contextMenus.removeAll();
	// always create entry
	// because if we need it depends on page URL
	// TODO: create a user setting for this
	chrome.contextMenus.create
	(
		{
			"title": "Show image",
			"id": "menuShowImage",
			"contexts": ["image"],
			"type": "normal"
		}
	);
}

// log to the console of the background page
function lg(t){
	if (debugLog)
	{
		console.log(t);
	}
}

