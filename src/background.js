
var defaultSettings =
	// the main switch, can be: allow, block, neutral
	{ "main" : "neutral"
	// option "Show image" for background images
	, "showBg" : false
	// log to the console (of the background page)
	, "debugLog" : false
	};
var settings = defaultSettings;

// for debugging without setting
// this line: chrome.storage.local.remove('main');

// get current setting, and apply it
chrome.storage.local.get(settings,function(result){
	settings = result;
	lg("Initial settings loaded:");
	for (key in settings)
	{
		lg(key + " = " + settings[key] );
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
		// verbose lg('Request act = ' + request.act);
		if (request.act=='lg')
		{
			lg(request.msg);
		}
		if (request.act=='initUrl')
		{
			chrome.contentSettings.images.get
			(	{ primaryUrl: sender.tab.url }
			,	function(details)
				{
					var isItOn = false;
					if (details.setting=="allow") isItOn = true;
					lg("images for " + sender.tab.url + ": " +  isItOn);
					sendResponse(
						{ imgOn: isItOn
						, showBg : settings.showBg
						, debugLog : settings.debugLog
						}
					);
				}
			);
		}
		return true;
	}
);

// detect if settings are changed
// this happens when user selects in menu
chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes)
	{
		if (typeof(changes[key].newValue)=='undefined')
		{
			settings[key] = defaultSettings[key];
		} else
		{
			settings[key] = changes[key].newValue;
			lg("Setting " + key + " changed to " + changes[key].newValue);
		}
	}
	applyMainSetting();
});

// Images on and Image off by a shortcut.
chrome.commands.onCommand.addListener(function(command) {
	lg('Command:' + command);
	if (settings.main=="allow" || settings.main=="neutral"){
		switchOff();
	} else
	if (settings.main=="block"){
		switchOn();
	}
});

// Respond to click to show a single image
chrome.contextMenus.onClicked.addListener(
	function(info, tab) {
		
		var imageSrcUrl = info.srcUrl;
		var tabUrl = tab.url;
		lg("Show image " + imageSrcUrl + " on " + tabUrl);

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
			// add a little delay (in ms)
			// because sometimes needed to load image
			setTimeout(applyMainSetting,1000);
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
	lg("Apply " + settings.main );
	var ct = chrome.contentSettings.images;
	ct.clear({});
	if (settings.main!='block'
	&& settings.main!='allow')
	{
		return;
	}
	ct.set(
		{	primaryPattern : 'http://*/*'
		,	setting : settings.main
		} );
	ct.set(
		{	primaryPattern : 'https://*/*'
		,	setting : settings.main
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
	if (settings.debugLog)
	{
		console.log(t);
	}
}

