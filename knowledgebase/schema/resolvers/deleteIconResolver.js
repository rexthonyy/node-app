const s3Handler = require('../../libs/s3Handler');

const getData = ({filename}) => {
    return new Promise((resolve, reject) => {
        s3Handler.s3.deleteObject({ Bucket: process.env.WASABI_BUCKET_NAME, Key: filename }, (err, data) => {
            if(err){
                console.error(err);
                return reject(err);
            }
            resolve({
                status: "success",
                message: "Deleted successfully"
            });
        });
    });
}

module.exports = async (parents, args) => {
    return getData(args);
}