module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let key = args.key;
        let privateMetadata = parent.privateMetadata;
        if (!privateMetadata) return resolve(null);
        let value = null;
        for (let data of privateMetadata) {
            if (data.key == key) {
                value = data.value;
            }
        }
        resolve(value);
    });
}