/**
*This is the script that is always running in the background of the extension.
*
*/

/*
chrome.contextMenus.create({title: 'Gimme!', contexts: ["image"]});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    var srcUrl = info.srcUrl;
    downloadImage(srcUrl);
});

function downloadImage(srcUrl) {
    var filenameParts = srcUrl.split('/');
    var filename = 'gimmage/' + _.last(filenameParts);
    console.log('filename ', filename);

    chrome.downloads.download({url: srcUrl, filename: filename}, function(downloadId) {
        console.log('downloadId ', downloadId);
    });
}
*/