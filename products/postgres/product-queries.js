const { Pool, Client } = require('pg');
const { db } = require('../libs/consts');

const pool = new Pool({
    user: process.env.POSTGRES_PRODUCTS_USER,
    host: process.env.POSTGRES_PRODUCTS_HOST,
    database: process.env.POSTGRES_PRODUCTS_DB,
    password: process.env.POSTGRES_PRODUCTS_PASSWORD,
    port: process.env.POSTGRES_PRODUCTS_PORT
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log(`${process.env.POSTGRES_PRODUCTS_DB} database initialization failed!!!`);
    } else {
        console.log(`${process.env.POSTGRES_PRODUCTS_DB} database initialized successfully!!!`);
    }
});

const client = new Client({
    user: process.env.POSTGRES_PRODUCTS_USER,
    host: process.env.POSTGRES_PRODUCTS_HOST,
    database: process.env.POSTGRES_PRODUCTS_DB,
    password: process.env.POSTGRES_PRODUCTS_PASSWORD,
    port: process.env.POSTGRES_PRODUCTS_PORT
});
client.connect();

const get = (table, columns, values, whereClause, response) => {
    pool.query(`SELECT ${columns} from ${table} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getProduct = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.product_product} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getProductType = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.product_producttype} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAttribute = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.attribute_attribute} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAttributeProduct = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.attribute_attributeproduct} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAttributeValue = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.attribute_attributevalue} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getCategory = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.product_category} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getCategoryTranslation = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.product_categorytranslation} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getShiftGroupById = (values, response) => {
    pool.query(`SELECT * from ${db.shift_groups} WHERE id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getShiftGroupsByChannelId = (values, response) => {
    pool.query(`SELECT * from ${db.shift_groups} WHERE channel_id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getShiftGroupMemberByUserId = (values, response) => {
    pool.query(`SELECT * from ${db.shift_group_members} WHERE user_id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getShiftGroupMembersByChannelId = (values, response) => {
    pool.query(`SELECT * from ${db.shift_group_members} WHERE channel_id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getShiftGroupMembersByChannelIdAndShiftGroupId = (values, response) => {
    pool.query(`SELECT * from ${db.shift_group_members} WHERE channel_id=$1 AND shift_group_id=$2`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAssignedShiftsByChannelIdShiftGroupIdAndUserId = (values, response) => {
    pool.query(`SELECT * from ${db.assigned_shifts} WHERE channel_id=$1 AND shift_group_id=$2 AND user_id=$3`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getOpenShifts = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.open_shifts} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAssignedShifts = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.assigned_shifts} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAssignedShiftActivities = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.assigned_shift_activities} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getOpenShiftActivities = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.open_shift_activities} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getUserTimeOffs = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.user_time_offs} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getRequests = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.requests} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getRequestTimeOff = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.request_time_off} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getRequestOffer = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.request_offer} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getDayNotes = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.day_notes} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getRequestSwap = (values, whereClause, response) => {
    pool.query(`SELECT * from ${db.request_swap} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const getAllSettings = (response) => {
    pool.query(`SELECT * from ${db.settings}`, (err, res) => {
        if (err) {
            response({
                err: err,
                res: null,
                code: 201
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};


const createProduct = (values, response) => {
    client.query(`INSERT INTO ${db.product_product} (name, description, updated_at, product_type_id, category_id, seo_description, seo_title, charge_taxes, weight, metadata, private_metadata, slug, default_variant_id, description_plaintext, rating, search_document) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createProductType = (values, response) => {
    client.query(`INSERT INTO ${db.product_producttype} (name, has_variant, is_shipping_required, weight, is_digital, metadata, private_metadata, slug, kind) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAttributeProduct = (values, response) => {
    client.query(`INSERT INTO ${db.attribute_attributeproduct} (attribute_id, product_type_id, sort_order) VALUES($1, $2, $3) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAssignedProductAttribute = (values, response) => {
    client.query(`INSERT INTO ${db.attribute_assignedproductattribute} (product_type_id, assignment_id) VALUES($1, $2) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAssignedProductAttributeValue = (values, response) => {
    client.query(`INSERT INTO ${db.attribute_assignedproductattributevalue} (sort_order, assignment_id, value_id) VALUES($1, $2, $3) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAttributeVariant = (values, response) => {
    client.query(`INSERT INTO ${db.attribute_attributevariant} (attribute_id, product_type_id, sort_order, variant_selection) VALUES($1, $2, $3, $4) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createAssignedShiftActivity = (values, response) => {
    client.query(`INSERT INTO ${db.assigned_shift_activities} (channel_id, shift_group_id, assigned_shift_id, user_id, name, code, color, start_time, end_time, is_paid) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createOpenShift = (values, response) => {
    client.query(`INSERT INTO ${db.open_shifts} (channel_id, shift_group_id, label, color, note, slots, is_open, start_time, end_time, is24hours, unpaid_break_time) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createOpenShiftActivity = (values, response) => {
    client.query(`INSERT INTO ${db.open_shift_activities} (channel_id, shift_group_id, open_shift_id, name, code, color, start_time, end_time, is_paid) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createUserTimeOff = (values, response) => {
    client.query(`INSERT INTO ${db.user_time_offs} (channel_id, shift_group_id, user_id, label, color, note, start_time, end_time, is24hours) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createDayNote = (values, response) => {
    client.query(`INSERT INTO ${db.day_notes} (channel_id, note, date) VALUES($1, $2, $3) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createRequest = (values, response) => {
    client.query(`INSERT INTO ${db.requests} (channel_id, user_id, receipient_id, type) VALUES($1, $2, $3, $4) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createRequestTimeOff = (values, response) => {
    client.query(`INSERT INTO ${db.request_time_off} (channel_id, request_id, user_id, is_all_day, start_time, end_time, reason, request_note, status, response_note, response_by_user_id, response_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createRequestSwap = (values, response) => {
    client.query(`INSERT INTO ${db.request_swap} (channel_id, request_id, user_id, assigned_user_shift_id, assigned_user_shift_id_to_swap, request_note, status, response_note, response_by_user_id, response_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const createRequestOffer = (values, response) => {
    client.query(`INSERT INTO ${db.request_offer} (channel_id, request_id, user_id, assigned_user_shift_id, offered_to_user_id, request_note, status, response_note, response_by_user_id, response_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                code: 218
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateShiftGroupById = (values, whereClause, response) => {
    client.query(`UPDATE ${db.shift_groups} SET ${whereClause} WHERE id=$1 RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateShiftGroupMembersByChannelIdShiftGroupIdAndUserId = (values, whereClause, response) => {
    client.query(`UPDATE ${db.shift_group_members} SET ${whereClause} WHERE channel_id=$1 AND shift_group_id=$2 AND user_id=$3 RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateAssignedShift = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.assigned_shifts} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateOpenShift = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.open_shifts} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateTimeOff = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.user_time_offs} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateDayNote = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.day_notes} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateRequestSwap = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.request_swap} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateRequestOffer = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.request_offer} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const updateSetting = (values, set, whereClause, response) => {
    client.query(`UPDATE ${db.settings} SET ${set} WHERE ${whereClause} RETURNING *`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 229
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAssignedShiftActivitiesByShiftGroupId = (values, response) => {
    client.query(`DELETE FROM ${db.assigned_shift_activities} WHERE shift_group_id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAssignedShiftActivitiesByChannelIdShiftGroupIdAndUserId = (values, response) => {
    client.query(`DELETE FROM ${db.assigned_shift_activities} WHERE channel_id=$1 AND shift_group_id=$2 AND user_id=$3`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteOpenShiftActivitiesByShiftGroupId = (values, response) => {
    client.query(`DELETE FROM ${db.open_shift_activities} WHERE shift_group_id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteUserTimeOffs = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.user_time_offs} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteUserTimeOffsByShiftGroupId = (values, response) => {
    client.query(`DELETE FROM ${db.user_time_offs} WHERE shift_group_id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteUserTimeOffsByChannelIdShiftGroupIdAndUserId = (values, response) => {
    client.query(`DELETE FROM ${db.user_time_offs} WHERE channel_id=$1 AND shift_group_id=$2 AND user_id=$3`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAssignedShiftsByShiftGroupId = (values, response) => {
    client.query(`DELETE FROM ${db.assigned_shifts} WHERE shift_group_id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAssignedShiftsByChannelIdShiftGroupIdAndUserId = (values, response) => {
    client.query(`DELETE FROM ${db.assigned_shifts} WHERE channel_id=$1 AND shift_group_id=$2 AND user_id=$3`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteOpenShiftsByShiftGroupId = (values, response) => {
    client.query(`DELETE FROM ${db.open_shifts} WHERE shift_group_id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteShiftGroupMembersByShiftGroupId = (values, response) => {
    client.query(`DELETE FROM ${db.shift_group_members} WHERE shift_group_id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteShiftGroupMembersByChannelIdShiftGroupIdAndUserId = (values, response) => {
    client.query(`DELETE FROM ${db.shift_group_members} WHERE channel_id=$1 AND shift_group_id=$2 AND user_id=$3`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteShiftGroupById = (values, response) => {
    client.query(`DELETE FROM ${db.shift_groups} WHERE id=$1`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAssignedShiftActivities = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.assigned_shift_activities} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteOpenShiftActivities = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.open_shift_activities} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteAssignedShift = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.assigned_shifts} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

const deleteOpenShift = (values, whereClause, response) => {
    client.query(`DELETE FROM ${db.open_shifts} WHERE ${whereClause}`, values, (err, res) => {
        if (err) {
            response({
                err: err.stack,
                res: null,
                test: 8
            });
        } else {
            response({
                err: null,
                res: res.rows
            });
        }
    });
};

module.exports = {
    get,
    getProduct,
    getProductType,
    getAttribute,
    getAttributeProduct,
    getAttributeValue,
    getCategory,
    getCategoryTranslation,
    getShiftGroupById,
    getShiftGroupsByChannelId,
    getShiftGroupMemberByUserId,
    getShiftGroupMembersByChannelId,
    getShiftGroupMembersByChannelIdAndShiftGroupId,
    getAssignedShiftsByChannelIdShiftGroupIdAndUserId,
    getOpenShifts,
    getAssignedShifts,
    getAssignedShiftActivities,
    getOpenShiftActivities,
    getUserTimeOffs,
    getRequests,
    getRequestTimeOff,
    getRequestSwap,
    getRequestOffer,
    getDayNotes,
    getAllSettings,

    createProduct,
    createProductType,
    createAssignedProductAttribute,
    createAttributeProduct,
    createAssignedProductAttributeValue,
    createAttributeVariant,

    updateShiftGroupById,
    updateShiftGroupMembersByChannelIdShiftGroupIdAndUserId,
    updateAssignedShift,
    updateOpenShift,
    updateTimeOff,
    updateDayNote,
    updateRequestSwap,
    updateRequestOffer,
    updateSetting,

    deleteAssignedShiftActivitiesByShiftGroupId,
    deleteAssignedShiftActivitiesByChannelIdShiftGroupIdAndUserId,
    deleteOpenShiftActivitiesByShiftGroupId,
    deleteUserTimeOffsByShiftGroupId,
    deleteUserTimeOffsByChannelIdShiftGroupIdAndUserId,
    deleteAssignedShiftsByShiftGroupId,
    deleteAssignedShiftsByChannelIdShiftGroupIdAndUserId,
    deleteOpenShiftsByShiftGroupId,
    deleteShiftGroupMembersByShiftGroupId,
    deleteShiftGroupMembersByChannelIdShiftGroupIdAndUserId,
    deleteShiftGroupById,
    deleteAssignedShiftActivities,
    deleteAssignedShift,
    deleteOpenShiftActivities,
    deleteOpenShift,
    deleteUserTimeOffs,
}