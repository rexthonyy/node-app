module.exports = async(parent, args, context) => {
    return new Promise(async(resolve, reject) => {
        let key = args.key;
        let metadata = parent.metadata;
        if (!metadata) return resolve(null);
        let value = null;
        for (let data of metadata) {
            if (data.key == key) {
                value = data.value;
            }
        }
        resolve(value);
    });
}