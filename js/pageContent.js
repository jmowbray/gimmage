/**
*
* This is the script that executed on every single page while the extension is running.
*
*/
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if(request === 'getAllImagesOnPage') {
        sendResponse(getAllImagesOnPage());
    }
});

function getAllImagesOnPage() {
    var imageObjects = [];
    var $imgEl;
    var srcUrl;
    var altText;

    $('img').each(function(index, imageElement) { 
        $imgEl = $(imageElement);
        if($imgEl[0] && $imgEl[0].src) {
            srcUrl = $imgEl[0].src;
            altText = $imgEl.attr('alt') || '[no alt text found]';
            imageObjects.push({srcUrl: srcUrl, altText: altText});
        }

    });

    return imageObjects;
}