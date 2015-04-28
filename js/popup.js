document.addEventListener('DOMContentLoaded', function() {
    bindDomListeners();
    requestImagesFromSelectedTab();
    console.log(Config());  
});

function bindDomListeners() {
    $('.js-resize-select').on('change', handleResizeSelectChanged);
}

/*
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    var srcUrl = info.srcUrl;
    downloadImage(srcUrl);
});
*/

function handleResizeSelectChanged(selectChangeEvent) {
    var bounds = $('.js-resize-select').val();

    if(bounds === 'original') {
        $('.js-found-image-wrapper, .js-found-image').each(function(index, el) {
            $(el).removeAttr('style');
        });
    } else {
        $('.js-found-image-wrapper').each(function(index, wrapperEl) {
            $(wrapperEl).height(parseInt(bounds) + 100);
            resizeImage($(wrapperEl).find('.js-found-image'), bounds);
        });
    }
}

function requestImagesFromSelectedTab() {
    console.log('requesting images');

    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, 'getAllImagesOnPage', function(response) {
            displayImages(response);
        });
    });
}

function displayImages(images) {
    var imagesUl = $('.js-found-images');
    var imageListElement;
    _.each(images, function(image) {
        imageListElement = buildImageListElement(image.srcUrl, image.altText);
        imagesUl.append(imageListElement);
    });

    $('.js-get-button').on('click', handleGetImageButtonClicked);
}

function buildImageListElement(srcUrl, altText) {
    var imageListElement;
    var divElement = $('<div class="found-image-wrapper js-found-image-wrapper">' + altText + '</div>');
    var imgElement = $('<img class="found-image js-found-image"></img>')
        .attr('src', srcUrl)
        .attr('alt', altText);
    var dropdownsElement = $(getDropDownsDivHtml());
    var buttonElement = $('<button class="js-get-button found-image-button">Gimme!</button>');  

    divElement.append(imgElement);
    divElement.append(dropdownsElement);
    imageListElement = divElement.append(buttonElement);
    
    return imageListElement;    
}

function handleGetImageButtonClicked(buttonClickEvent) {
    var $imageElement = $(buttonClickEvent.currentTarget).prev().prev();
    var srcUrl = $imageElement.attr('src');
    var filename = _.last(srcUrl.split('/'));
    var $dropdownDiv = $imageElement.next();
    var client = $dropdownDiv.find('.js-client-select').val();
    var room = $dropdownDiv.find('.js-room-select').val();
    var type = $dropdownDiv.find('.js-type-select').val();
    var pathAndFilename = 'gimmage/' + client + '/' + room + '/' + type + '/' + filename;

    downloadImage(srcUrl, pathAndFilename);
}

function downloadImage(srcUrl, pathAndFilename) {
    chrome.downloads.download({url: srcUrl, filename: pathAndFilename}, function(downloadId) {
        console.log('downloadId ', downloadId);
    });
} 

function resizeImage(img, bounds) {
    var $img = $(img);
    var oHeight = $img.height();
    var oWidth = $img.width();
    var newHeight;
    var newWidth;
    var taller = oHeight > oWidth;
    var wider = !taller;    

    newHeight = taller ? bounds : oHeight * (bounds/oWidth);
    newWidth = wider ? bounds : oWidth * (bounds/oHeight);

    $img.height(newHeight).width(newWidth); 
}

function getDropDownsDivHtml() {
    var clientSelect = ''+
    'Client <select class="js-client-select">' +
        '<option value="Bob">Bob</option><option value="Bill">Bill</option><option value="Ted">Ted</option>' +
    '</select>';

    var roomSelect = ''+
    'Room <select class="js-room-select">' +
        '<option value="Bedroom">Bedroom</option><option value="Bathroom">Bathroom</option><option value="Beyondroom">Beyondroom</option>' +
    '</select>';

    var typeSelect = ''+
    'Type <select class="js-type-select">' +
        '<option value="Fixture">Fixture</option><option value="Furniture">Furniture</option><option value="Flooring">Flooring</option>' +
    '</select>';

    return '<div class="dropdowns-wrapper">' + clientSelect + roomSelect + typeSelect + '</div';
}