// This is a content script that has access to the DOM.

// Are images enabled or disabled?
// We have to ask the more priviledged background page

chrome.runtime.sendMessage
(	{ url: window.location.href }
,	function(response)
	{

		if (response.img_on)
		{
			return;
		}
		
		// a helper for showing clickable placeholders for background images,
		// so the context menu can be used
		if (response.showbg)
		{
			makeClickableBackgroundImages();
		}

		switchImagesOff();
	}
);

function makeClickableBackgroundImages()
{
	var allelements = document.getElementsByTagName('*');
	for (i = 0; i < allelements.length; i++) 
	{
		var elem = allelements[i];
		var prop = window.getComputedStyle(elem, null).getPropertyValue("background-image");
		if (prop!='none')
		{
			// TODO: fix this
			// remove url("
			prop = prop.substring(5,prop.length);
			// remove ")
			prop = prop.substring(0,prop.length-2);
			// alert (prop+ " is number " + numbernewelement);
			var im = document.createElement("img");
			// clickable but not the right position (at bottom)
			document.body.appendChild(im);
			/*
			// Next lines don't work. Not clickable but the right position.
			allelements[i].appendChild(im);
			allelements[i].insertBefore(im,allelements[i].childNodes[0]);
			im.style.offsetLeft = "inherit";
			im.style.offsetTop = "inherit";
			im.style.position = "absolute";
			im.style.zIndex = 100;
			*/
			im.alt = "[III]";
			im.src = prop;
		}

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

