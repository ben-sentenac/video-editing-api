const utils = {};

utils.ALLOWED_MIME_TYPES = {
    //'video/quicktime':'mov',
    'video/mp4':'mp4',
    'video/webm':'webm',
    'video/x-ms-wmv':'wmv',
     'video/x-flv':'flv',
     'video/mpeg':'mpg',
     'video/x-msvideo':'avi',
     'video/x-ms-asf':'asf',
     'image/jpeg':'jpeg',
    'image/png': 'png',
     'image/svg':'svg',
    'audio/mpeg': 'mp3',
    'audio/x-wav':'wav',
     'audio/x-wav':'wave',
     'audio/x-flac':'flac',
    'audio/x-ms-wma':'wma' ,
     'audio/x-aiff':'aiff',
     'audio/x-aiff':'aif',
     'audio/x-aiff':'aifc',
};


function checkMimeTypes(mimeToCheck) {
    return utils.ALLOWED_MIME_TYPES.hasOwnProperty(mimeToCheck);
}

utils.checkMimeTypes = checkMimeTypes;

export default utils;