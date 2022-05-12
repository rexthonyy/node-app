const S3 = require('aws-sdk/clients/s3');
const AWS = require('aws-sdk');
var multer = require('multer')
var multerS3 = require('multer-s3')

class s3Handler{
    constructor(){
        this.s3 = new S3({            
            endpoint: new AWS.Endpoint(process.env.WASABI_ENDPOINT),
            region: process.env.WASABI_REGION,
            accessKeyId: process.env.WASABI_ACCESS_KEY_ID,
            secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY
        });

        this.upload = multer({
            storage: multerS3({
                s3: this.s3,
                acl: process.env.WASABI_ACL,
                bucket: process.env.WASABI_BUCKET_NAME,
                key: function (req, file, cb) {
                    cb(null, file.originalname); //use Date.now() for unique file keys
                }
            })
        });
    }
}

module.exports = new s3Handler();