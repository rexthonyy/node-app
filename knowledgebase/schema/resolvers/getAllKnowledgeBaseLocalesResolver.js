const pgQueries = require('../../postgres/kb-queries');

const getData = () => {
    return new Promise((resolve, reject) => {
        pgQueries.listLocales(result => {
            if(result.err){
                result.err.errorIndex = 8;
                return reject(result.err);
            }
            
            let locales = result.res;

            let to_return = [];

            locales.forEach(locale => {
                if(locale.active){
                    to_return.push({
                        id: locale.id,
                        locale: locale.locale,
                        name: locale.name
                    });
                }
            });

            resolve(to_return);
        });
    });
}

module.exports = async () => {
    return getData();
}