# Image Toggle
Image Toggle is a browser extension to control the display of images. If images are switched off, other image elements, such as video, are switched off as well. Using a button on the toolbar, the user can switch between blocking and showing images, or reverting back to the user settings. A short-cut key (Ctrl+Shift+Space) also switches between block and loading of images. The web page needs to be reloaded manually for this to be applied. If images are blocked for the current page, a right-click context menu item is provided to show or load the particular image.

## Web browser status
The extension is available for Chome / Chromium, but it does not work in Firefox or Edge.

## Background images
By default, the right-click "Show image" option
is not available for background images,
but it can be enabled in the settings of Image Toggle.
If enabled, placeholder items are added to the web page
with \[BG\] as (alt) text.
After right-clicking on the placeholder item and choosing Show image,
it will attempt to load the background image.

## Loading the Image Toggle extension
- On the extensions page, enable Developer mode
- Click "Load unpacked"
- Select the "src" directory

## Technical implementation details
Currently the display and blocking of images is implemented by adding a custom content preference for images. This works for Chrome, but Firefox and Edge do not implement this part of the WebExtensions API. An alternative would be to block/allow web requests. The problem is that a XMLHttpRequest could be a video stream, or it could be web page action.

## How to enable logging
To view logging, inspect the background page view from the Extensions page.
To enable logging, execute the following code there:
```javascript
chrome.storage.local.set({'debugLog':true},function(){});
```
