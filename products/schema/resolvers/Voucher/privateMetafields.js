module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let keys = args.keys;
        let privateMetadata = parent.privateMetadata;
        if (!privateMetadata) return resolve(privateMetadata);
        if (!keys) return resolve(privateMetadata);

        let metadataItems = {};

        for (let key of keys) {
            for (let data of privateMetadata) {
                if (data.key == key) {
                    metadataItems[data.key] = data.value;
                }
            }
        }

        resolve(metadataItems);
    });
}