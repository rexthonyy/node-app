function formatMetadata(metadata) {
    let data = [];
    for (const [key, value] of Object.entries(metadata)) {
        data.push({
            key,
            value
        });
    }
    return data;
}

module.exports = {
    formatMetadata
}