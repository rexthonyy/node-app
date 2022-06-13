module.exports = async(parent, args, context) => {
    return new Promise((resolve, reject) => {
        console.log(args.file);
        resolve(null);
    });
}