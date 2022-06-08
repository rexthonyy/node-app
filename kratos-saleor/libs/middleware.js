module.exports = async(resolve, root, args, context, info) => {
    console.log(`1. logInput: ${JSON.stringify(args)}`);
    const result = await resolve(root, args, context, info);
    console.log(`5. logInput`);
    return;
};