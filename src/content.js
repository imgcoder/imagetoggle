// This is a content script that has access to the DOM.

var debugLog = false;
var showBg = false;
var hadResponse = false;
var isDocLoaded = false;

document.addEventListener('DOMContentLoaded', onDocLoaded);

// Are images enabled or disabled?
// We have to ask the more priviledged background page

chrome.runtime.sendMessage
(	{ url: window.location.href 
	, act: 'initUrl'
	}
,	function(response)
	{

		// imgOn is not the main setting
		// but if images are on for the current page
		
		if (response.imgOn)
		{
			return;
		}
		
		debugLog = response.debugLog;
		showBg = response.showBg;

		switchImagesOff();
		
		hadResponse = true;
		checkBothReady();

	}
);

function checkBothReady()
{
	if (isDocLoaded && hadResponse)
	{
		// a helper for showing clickable placeholders for background images,
		// so the context menu can be used
		if (showBg)
		{
			makeClickableBackgroundImages();
		}
	}
}

function onDocLoaded()
{
	isDocLoaded = true;
	checkBothReady();
}

function makeClickableBackgroundImages()
{
	var insertList = [];
	// verbose 
	lg('makeClickableBackgroundImages');
	var allelements = document.getElementsByTagName('*');
	for (i = 0; i < allelements.length; i++) 
	{
		var elem = allelements[i];
		// give up if ...
		if (elem.tagName=='HTML') continue;
		if (elem.tagName=='BODY') continue;
		// get background image if any
		var compStyle = window.getComputedStyle(elem, null);
		var compBgImg = compStyle.getPropertyValue("background-image");
		if (compBgImg!='none')
		{
			lg("found " + elem.tagName + " with bg " + compBgImg);

			if (compBgImg.slice(0,5) != 'url("') continue;
			if (compBgImg.slice(-2) != '")') continue;
			var imSrc = compBgImg.slice(5,-2);
			lg('new src = ' + imSrc);
			
			var im = document.createElement("img");
			
			im.style.position = compStyle.getPropertyValue('position');
			im.style.left = compStyle.getPropertyValue('left');
			im.style.top = compStyle.getPropertyValue('top');

			im.alt = "[BG]";
			im.src = imSrc;
			// mark with special attribute
			// so we can find (and delete) it later
			im.setAttribute('xpurpose','BgImageToggle');
			
			var toInsert = {};
			toInsert.elem = elem;
			toInsert.im = im;
			insertList.push(toInsert);
		}
	}
	
	for (ix in insertList)
	{
		var toInsert = insertList[ix];
		if (toInsert.elem.parentNode==null) continue;
		lg( 'insert , parent is a ' + toInsert.elem.parentNode.tagName);
		// elem is the node with background image
		// im is the image placeholder
		// we insert im after elem
		toInsert.elem.parentNode.insertBefore(toInsert.im,toInsert.elem.nextSibling);
	}
}

// apply extra CSS rules to really switch off images
function switchImagesOff()
{
	var txtStyle = ""
	+ "body audio  { display: none !important; }"
	+ "body video  { display: none !important; }"
	+ "body canvas { display: none !important; }"
	+ "body applet { display: none !important; }"
	+ "body embed  { display: none !important; }"
	+ "body object { display: none !important; }"
	;

	var objStyle = document.createElement('style');
	objStyle.appendChild(document.createTextNode(txtStyle));
	document.documentElement.insertBefore(objStyle,document.documentElement.firstChild);

}

function lg(t)
{
	if (debugLog)
	{
		chrome.runtime.sendMessage
		(	{ msg: t
			, act: 'lg'
			}
		);
	}
}

