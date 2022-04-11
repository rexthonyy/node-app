const pgQueries = require('../../postgres/kb-queries');
const recordHistory = require('../resolverUtils/recordHistoryResolver');
const getLanguageTitleFromLocaleId = require('../resolverUtils/getLanguageTitleFromLocaleId');
const consts = require('../../consts');
const fs = require('fs');

const getData = async ({image}) => {
    const { filename, mimetype, createReadStream } = await image;
    const stream = createReadStream();
    const uploadDir = `${__dirname}/../../public/${filename}`;
    return new Promise((resolve, reject) => {
        stream
        .on('error', error => {
            if(stream.truncated){
                fs.unlinkSync(uploadDir);
                reject(error);
            }
        })
        .pipe(fs.createWriteStream(uploadDir))
        .on('error', error => reject(error))
        .on('finish', () => resolve(true))
    });
}

module.exports = async (parents, args) => {
    let result = await getData(args)
    return result;
}