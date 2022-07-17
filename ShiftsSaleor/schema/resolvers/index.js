const path = require('path');
const fs = require('fs');

module.exports = {
    Query: {
        hello: () => "Hello World!"
    },
    Mutation: {
        singleUpload: async(parent, { file }) => {
            console.log(file);
            const { createReadStream, filename, mimetype, encoding } = await file;

            const stream = createReadStream();
            const pathname = path.join(__dirname, `../../public/images/${filename}`);
            console.log(stream);
            await stream.pipe(fs.createWriteStream(pathname));

            return {
                url: `http://localhost:4000/images/${filename}`
            };
        },
    }
};