const path = require('path');
const fs = require('fs');
const { finished } = require('stream/promises');
const { GraphQLUpload } = require('graphql-upload');

module.exports = {
    Upload: GraphQLUpload,
    Query: {
        hello: () => "Hello World!"
    },
    Mutation: {
        singleUpload: async(parent, { file }) => {
            console.log(file);
            const { createReadStream, filename, mimetype, encoding } = await file;

            const stream = createReadStream();
            const pathname = path.join(__dirname, `../../public/images/${filename}`);
            let out = fs.createWriteStream(pathname);
            await stream.pipe(out);
            await finished(out);

            return {
                url: `http://localhost:4000/images/${filename}`
            };
        },
    }
};