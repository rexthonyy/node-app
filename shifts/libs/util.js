function isEmailValid(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

function getRandom(min, max) {
    return myMap(Math.random(), 0, 1, min, max);
}

function myMap(val, minF, maxF, minT, maxT) {
    return minT + (((val - minF) / (maxF - minF)) * (maxT - minT));
}

function sortByPosition(a, b) {
    return a.position - b.position;
}

function sortByStartTime(a, b) {
    let dateA = new Date(a);
    let dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate())
        ].join('-') +
        ' ' + [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds())
        ].join(':')
    );
}

function getDayFromDate(date) {
    return new Date(
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate())
        ].join('-')
    );
}

function diffHours(date1, date2) {
    let diff = (date1.getTime() - date2.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(Math.round(diff));
}


function paginate(page, limit, values) {
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const result = {};
    result.totalPages = Math.ceil(values.length / limit);
    if (endIndex < values.length) {
        result.next = {
            page: page + 1,
            limit: limit
        };
    }
    if (startIndex > 0) {
        result.previous = {
            page: page - 1,
            limit: limit
        }
    }

    result.results = values.slice(startIndex, endIndex);
    return result;
}
module.exports = {
    isEmailValid,
    getRandom,
    sortByPosition,
    sortByStartTime,
    formatDate,
    diffHours,
    getDayFromDate,
    paginate
}