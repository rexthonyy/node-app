module.exports = async(parent, args, context) => {
    console.log(context.msg);
    return new Promise((resolve, reject) => {
        resolve(null);
    });
}