import { readdir } from 'node:fs';
import fs from 'node:fs/promises';
const utils = {};

utils.ALLOWED_MIME_TYPES = {
    'video/quicktime':'mov',
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
     'audio/x-flac':'flac',
    'audio/x-ms-wma':'wma' ,
     'audio/x-aiff':'aiff'
};

const mimeTypes = {
    'flv':'video/x-flv',
    'mp4':'video/mp4',
    'm3u8':'application/x-mpegURL',
    'ts':'video/MP2T',
    '3gp':'video/3gpp',
    'mov':'video/quicktime',
    'avi':'video/x-msvideo',
    'wmv':'video/x-ms-wmv',
    'mpeg':'video/mpeg'

};

function checkMimeTypes(mimeToCheck,allowedMimeType) {
    return allowedMimeType.hasOwnProperty(mimeToCheck);
}

function setMimeType  (ext) {
    return mimeTypes[ext] ? mimeTypes[ext] : undefined;
}

 async function fileExists (path) {
    return !!(await fs.stat(path).catch(e => false));
}

//APP stuff
async function deleteFolder(path) {
    try {
        await fs.rm(path, { recursive: true });
    } catch (err) {
        console.error(err);
        throw err;
    }

}

async function deleteFile(filePath) {
    try {
        await fs.unlink(filePath);
    } catch (err) {
        console.error(err);
        throw err;
    }
}


utils.checkMimeTypes = checkMimeTypes;
utils.setMimeType = setMimeType;
utils.fileExists = fileExists;
utils.deleteFile = deleteFile;
utils.deleteFolder = deleteFolder;

export default utils;