const { Pool, Client } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'accounting',
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

pool.query('SELECT NOW()', (err, res) => {
    if(err){
        console.log("accounting database initialization failed!!!");
    }else{
        console.log("accounting database initialized successfully!!!");
    }
});

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'accounting',
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});
client.connect();


const createGig = (values, response) => {
    client.query('INSERT INTO gigs (user_id, title, gig_status, category_id, subcategory_id, description, metadata) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 11
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createGigLocationTag = (values, response) => {
    client.query('INSERT INTO gig_location_tags (gig_id, gig_location_code) VALUES($1, $2) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 2
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createGigImage = (values, response) => {
    client.query('INSERT INTO gig_images (gig_id, image_url, order_in_sequence) VALUES($1, $2, $3) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 3
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createGigPackage = (values, response) => {
    client.query('INSERT INTO gig_packages (gig_id, package_type, name, description, delivery_time, metadata, price) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', values, (err, res) => {
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

const createGigRequirement = (values, response) => {
    client.query('INSERT INTO gig_requirements (gig_id, question, response_type, metadata, is_required, order_in_sequence) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 6
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createDelivery = (values, response) => {
    client.query('INSERT INTO delivery (order_id, gig_id, seller_id, buyer_id, message, metadata, delivery_status) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 22
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteAllGigImages = (values, response) => {
    client.query('DELETE FROM gig_images WHERE gig_id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 20
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateGig = (values, response) => {
    client.query('UPDATE gigs SET title=$2, category_id=$3, subcategory_id=$4, description=$5, metadata=$6, updated_at=$7 WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 22
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateGigPackage = (values, response) => {
    client.query('UPDATE gig_packages SET name=$3, description=$4, delivery_time=$5, metadata=$6, price=$7 WHERE id=$1 AND gig_id=$2', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 202
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const updateGigRequirement = (values, response) => {
    client.query('UPDATE gig_requirements SET question=$3, response_type=$4, metadata=$5, is_required=$6, order_in_sequence=$7 WHERE id=$1 AND gig_id=$2', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 19
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteGig = (values, response) => {
    client.query('DELETE FROM gigs WHERE id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 43
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteAllGigPackages = (values, response) => {
    client.query('DELETE FROM gig_packages WHERE gig_id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 43
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteAllGigLocationTags = (values, response) => {
    client.query('DELETE FROM gig_location_tags WHERE gig_id=$1', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 413
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const deleteAllGigRequirements = (values, response) => {
    client.query('DELETE FROM gig_requirements WHERE gig_id=$1', values, (err, res) => {
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


const createProposal = (values, response) => {
    client.query('INSERT INTO proposals (gig_id, seller_id, buyer_id, description, proposal_status, delivery_time, metadata, price) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 51
            });
        } else {
            response({
                err: null,
                res: res.rows[0]
            });
        }
    });
};

const createOrder = (values, response) => {
    client.query('INSERT INTO orders (gig_id, seller_id, buyer_id, order_status, delivery_time, metadata, price) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 52
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
    createGig,
    createGigLocationTag,
    createGigImage,
    createGigPackage,
    createGigRequirement,
    createDelivery,

    updateGig,
    deleteAllGigImages,
    updateGigPackage,
    updateGigRequirement,
    deleteGig,
    deleteAllGigPackages,
    deleteAllGigLocationTags,
    deleteAllGigRequirements,

    createProposal,
    createOrder
}