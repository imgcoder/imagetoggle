
// This JS is executed when the user chooses
// to show a particular image.
// This JS is inserted by the background page.
// The variable imageSrcUrl is also set by the background page
// to the url of the clicked image that should be shown.

function normalImages()
{
	// finds all images with img tag
	var images = document.getElementsByTagName("img");
	for (i = 0; i < images.length; i++) {
		var img = images[i];
		// if source is source of clicked image
		if (img.src == imageSrcUrl){ 
			// act as if you change src to trigger a view
			img.src = imageSrcUrl;
		}
	}
}

// Note: For inline images this is not implemented

// show all background images having the same url as the clicked image.
function backgroundImages(){
	// URL of the clicked image
	var url = "url(\"" + imageSrcUrl + "\")";
	// loop through all elements
	var allelements = document.getElementsByTagName('*');
	for (i = 0; i < allelements.length; i++) {
		var elem = allelements[i];
		var prop = window.getComputedStyle(elem, null).getPropertyValue("background-image");
		// if this has the particular background image
		if (prop==url){
			// perform a change to trigger reload
			elem.style.backgroundImage = "";
			elem.style.backgroundImage = prop;
		}
	}
}

function deletePlaceholders(imageSrcUrl)
{
	var images = document.getElementsByTagName("img");
	var toRemove = [];
	for (i = 0; i < images.length; i++) {
		var img = images[i];
		if (img.getAttribute('xpurpose')=='BgImageToggle')
		{
			if (img.getAttribute('src')==imageSrcUrl)
			{
				toRemove.push(img);
			}
		}
	}
	for (ix in toRemove)
	{
		var node = toRemove[ix];
		if (node.parentNode)
		{
			node.parentNode.removeChild( node );
		}
	}
}

// perform it
deletePlaceholders(imageSrcUrl);
normalImages();
backgroundImages();

