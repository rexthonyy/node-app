const { Pool, Client } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'maps',
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

pool.query('SELECT NOW()', (err, res) => {
    if(err){
        console.log("Maps database initialization failed!!!");
    }else{
        console.log("Maps database initialized successfully!!!");
    }
});

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'maps',
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});
client.connect();

const getServiceBoundaryRegions = (res_, response) => {
    pool.query("SELECT * from service_boundary_regions", (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null
            });
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createServiceBoundaryRegion = (res_, data, response) => {
    const values = [data.name, data.code];
    client.query('INSERT INTO service_boundary_regions (name, code) VALUES($1, $2) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateServiceBoundaryRegion = (data, response) => {
    const values = [data.id, data.name, data.code];
    client.query('UPDATE service_boundary_regions SET name=$2, code=$3 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteServiceBoundaryRegion = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM service_boundary_regions WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 1
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};


const getServiceBoundarySubRegions = (res_, response) => {
    pool.query("SELECT * from service_boundary_subregions", (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null,
                test: 2
            });
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createServiceBoundarySubRegion = (res_, data, response) => {
    const values = [data.region_id, data.name, data.image_url, data.code];
    client.query('INSERT INTO service_boundary_subregions (region_id, name, image_url, code) VALUES($1, $2, $3, $4) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null,
                test: 3
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateServiceBoundarySubRegion = (data, response) => {
    const values = [data.id, data.region_id, data.name, data.image_url, data.code];
    client.query('UPDATE service_boundary_subregions SET region_id=$2, name=$3, image_url=$4, code=$5 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 4
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteServiceBoundarySubRegion = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM service_boundary_subregions WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 5
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};



const getServiceBoundarySubRegionCodes = (res_, response) => {
    pool.query("SELECT * from service_boundary_subregion_codes", (err, res) => {
        if(err){
            response(res_, {
                err: err,
                res: null,
                test: 6
            });
        }else{
            response(res_, {
                err: null,
                res: res.rows
            });
        }
    });
};

const createServiceBoundarySubRegionCode = (res_, data, response) => {
    const values = [data.region_id, data.subregion_id, data.code];
    client.query('INSERT INTO service_boundary_subregion_codes (region_id, subregion_id, code) VALUES($1, $2, $3) RETURNING *', values, (err, res) => {
        if (err) {
            response(res_, {
                err: err.stack,
                res: null,
                test: 6
            });
        } else {
            response(res_, {
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateServiceBoundarySubRegionCode = (data, response) => {
    const values = [data.id, data.region_id, data.subregion_id, data.code];
    client.query('UPDATE service_boundary_subregion_codes SET region_id=$2, subregion_id=$3, code=$4 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 7
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteServiceBoundarySubRegionCode = (data, response) => {
    const values = [data.id];
    client.query('DELETE FROM service_boundary_subregion_codes WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

module.exports = {
    getServiceBoundaryRegions,
    createServiceBoundaryRegion,
    updateServiceBoundaryRegion,
    deleteServiceBoundaryRegion,

    getServiceBoundarySubRegions,
    createServiceBoundarySubRegion,
    updateServiceBoundarySubRegion,
    deleteServiceBoundarySubRegion,

    getServiceBoundarySubRegionCodes,
    createServiceBoundarySubRegionCode,
    updateServiceBoundarySubRegionCode,
    deleteServiceBoundarySubRegionCode
}