module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let keys = args.keys;
        let metadata = parent.metadata;
        if (!metadata) return resolve(metadata);
        if (!keys) return resolve(metadata);

        let metadataItems = {};

        for (let key of keys) {
            for (let data of metadata) {
                if (data.key == key) {
                    metadataItems[data.key] = data.value;
                }
            }
        }

        resolve(metadataItems);
    });
}