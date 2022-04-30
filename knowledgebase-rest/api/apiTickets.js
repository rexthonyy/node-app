const express = require("express");
const router = express.Router();
const pgQueries = require('../postgres/ticket-queries');

function returnResult(res, result){
    if(result.err){
        return res.json(result.err);
    }
    res.json(result.res);
}

router.get("/getTickets", (req, res) => {
    pgQueries.getTickets(res, returnResult);
});

router.post("/createTicket", (req, res) => {
    let values = getTicketData(req, res);

    pgQueries.createTicket(res, values, returnResult);
});

router.put("/updateTicket/:id", (req, res) => {
    let id = req.params.id;
    let values = [id, ...getTicketData(req, res)];

    pgQueries.updateTicket(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket updated" });
    });
});

function getTicketData(req, res){
    return [
        req.body.group_id ? req.body.group_id : -1,
        req.body.priority_id ? req.body.priority_id : -1,
        req.body.state_id ? req.body.state_id : -1,
        req.body.organization_id ? req.body.organization_id : -1,
        req.body.number ? req.body.number : -1,
        req.body.title ? req.body.title : "",
        req.body.owner_id ? req.body.owner_id : -1,
        req.body.customer_id ? req.body.customer_id : -1,
        req.body.note ? req.body.note : "",
        req.body.first_response_at ? req.body.first_response_at : new Date().toUTCString(),
        req.body.first_response_escalation_at ? req.body.first_response_escalation_at : new Date().toUTCString(),
        req.body.first_response_in_min ? req.body.first_response_in_min : -1,
        req.body.first_response_diff_in_min ? req.body.first_response_diff_in_min : -1,
        req.body.close_at ? req.body.close_at : new Date().toUTCString(),
        req.body.close_escalation_at ? req.body.close_escalation_at : new Date().toUTCString(),
        req.body.close_in_min ? req.body.close_in_min : -1,
        req.body.close_diff_in_min ? req.body.close_diff_in_min : -1,
        req.body.update_escalation_at ? req.body.update_escalation_at : new Date().toUTCString(),
        req.body.update_in_min ? req.body.update_in_min : -1,
        req.body.update_diff_in_min ? req.body.update_diff_in_min : -1,
        req.body.last_contact_at ? req.body.last_contact_at : new Date().toUTCString(),
        req.body.last_contact_agent_at ? req.body.last_contact_agent_at : new Date().toUTCString(),
        req.body.last_contact_customer_at ? req.body.last_contact_customer_at : new Date().toUTCString(),
        req.body.last_owner_update_at ? req.body.last_owner_update_at : new Date().toUTCString(),
        req.body.create_article_article_type_id ? req.body.create_article_article_type_id : -1,
        req.body.create_article_sender_id ? req.body.create_article_sender_id : -1,
        req.body.article_count ? req.body.article_count : -1,
        req.body.escalation_at ? req.body.escalation_at : new Date().toUTCString(),
        req.body.pending_time ? req.body.pending_time : new Date().toUTCString(),
        req.body.type ? req.body.type : "",
        req.body.time_unit ? req.body.time_unit : 3,
        req.body.preferences ? req.body.preferences : 3,
        req.body.updated_by_id ? req.body.updated_by_id : -1,
        req.body.created_by_id ? req.body.created_by_id : -1,
        req.body.created_at ? req.body.created_at : new Date().toUTCString(),
        req.body.updated_at ? req.body.updated_at : new Date().toUTCString(),
    ];
}

router.delete("/deleteTicket/:id", (req, res) => {
    let id = req.params.id;

    let values = [
        id
    ];

    pgQueries.deleteTicket(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket deleted successfully" });
    });
});



router.get("/getTicketTimeAccountings", (req, res) => {
    pgQueries.getTicketTimeAccountings(res, returnResult);
});

router.post("/createTicketTimeAccounting", (req, res) => {
    let values = [
        req.body.ticket_id ? req.body.ticket_id : -1,
        req.body.ticket_article_id ? req.body.ticket_article_id : -1,
        req.body.time_unit ? req.body.time_unit : 3,
        req.body.created_by_id ? req.body.created_by_id : -1,
        req.body.created_at ? req.body.created_at : new Date().toUTCString(),
        req.body.updated_at ? req.body.updated_at : new Date().toUTCString()
    ];

    pgQueries.createTicketTimeAccounting(res, values, returnResult);
});

router.put("/updateTicketTimeAccounting/:id", (req, res) => {
    let id = req.params.id;
    let values = [
        id,
        req.body.ticket_id ? req.body.ticket_id : -1,
        req.body.ticket_article_id ? req.body.ticket_article_id : -1,
        req.body.time_unit ? req.body.time_unit : 3,
        req.body.created_by_id ? req.body.created_by_id : -1,
        req.body.created_at ? req.body.created_at : new Date().toUTCString(),
        req.body.updated_at ? req.body.updated_at : new Date().toUTCString()
    ];

    pgQueries.updateTicketTimeAccounting(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket Time Accounting updated" });
    });
});

router.delete("/deleteTicketTimeAccounting/:id", (req, res) => {
    let id = req.params.id;

    let values = [
        id
    ];

    pgQueries.deleteTicketTimeAccounting(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket time accounting deleted successfully" });
    });
});



router.get("/getTicketStates", (req, res) => {
    pgQueries.getTicketStates(res, returnResult);
});

router.post("/createTicketState", (req, res) => {
    createTicketState(req, res, result => {
        if(result.err){
            return result.err;
        }
        res.json(result.res);
    });
});

function createTicketState(req, res, cb){
    let values = getTicketStateData(req, res);
    
    pgQueries.createTicketState(res, values, (res_, result) => {
        cb(result);
    });
}

router.put("/updateTicketState/:id", (req, res) => {
    updateTicketState(req, res, result => {
        if(result.err){
            return result.err;
        }

        res.json({ status: "success", message: "Ticket State updated" });
    });
});

function updateTicketState(req, res, cb){
    let id = req.params.id;
    let values = [id, ...getTicketStateData(req, res)];
    
    pgQueries.updateTicketState(values, result => {
        cb(result);
    });
}

router.delete("/deleteTicketState/:id", (req, res) => {
    let id = req.params.id;

    let values = [
        id
    ];

    pgQueries.deleteTicketState(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket state deleted successfully" });
    });
});

function getTicketStateData(req, res){
    return [
        req.body.state_type_id ? req.body.state_type_id : -1,
        req.body.name ? req.body.name : "",
        req.body.next_state_id ? req.body.next_state_id : 1,
        req.body.ignore_escalation ? req.body.ignore_escalation : false,
        req.body.default_create ? req.body.default_create : true,
        req.body.default_follow_up ? req.body.default_follow_up : true,
        req.body.note ? req.body.note : "",
        req.body.active ? req.body.active : true,
        req.body.updated_by_id ? req.body.updated_by_id : -1,
        req.body.created_by_id ? req.body.created_by_id : -1,
        req.body.created_at ? req.body.created_at : new Date().toUTCString(),
        req.body.updated_at ? req.body.updated_at : new Date().toUTCString()
    ];
}


router.get("/getTicketStateTypes", (req, res) => {
    pgQueries.getTicketStateTypes(res, returnResult);
});

router.post("/createTicketStateType", (req, res) => {
    let values = getTicketStateTypeData(req, res);

    pgQueries.createTicketStateType(res, values, returnResult);
});

router.put("/updateTicketStateType/:id", (req, res) => {
    let id = req.params.id;
    let values = [id, ...getTicketStateTypeData(req, res)];
   
    pgQueries.updateTicketStateType(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket State type updated" });
    });
});

router.delete("/deleteTicketStateType/:id", (req, res) => {
    let id = req.params.id;

    let values = [
        id
    ];

    pgQueries.deleteTicketStateType(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket state type deleted successfully" });
    });
});

function getTicketStateTypeData(req, res){
    return [
        req.body.name ? req.body.name : "",
        req.body.note ? req.body.note : "",
        req.body.updated_by_id ? req.body.updated_by_id : -1,
        req.body.created_by_id ? req.body.created_by_id : -1,
        req.body.created_at ? req.body.created_at : new Date().toUTCString(),
        req.body.updated_at ? req.body.updated_at : new Date().toUTCString()
    ];
}

router.get("/getTicketPriorities", (req, res) => {
    pgQueries.getTicketPriorities(res, returnResult);
});

router.post("/createTicketPriorities", (req, res) => {
    createTicketPriority(req, res, result => {
        if(result.err){
            return result.err;
        }
        res.json(result.res);
    });
});

function createTicketPriority(req, res, cb){
    let values = getTicketPriorityData(req, res);

    pgQueries.createTicketPriorities(res, values, (res_, result) => {
        cb(result);
    });
}

router.put("/updateTicketPriorities/:id", (req, res) => {
    updateTicketPriority(req, res, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket Priority updated" });
    });
});

function updateTicketPriority(req, res, cb){
    let id = req.params.id;
    let values = [id, ...getTicketPriorityData(req, res)];
    
    pgQueries.updateTicketPriorities(values, result => {
        cb(result);
    });
}

router.delete("/deleteTicketPriorities/:id", (req, res) => {
    let id = req.params.id;

    let values = [
        id
    ];

    pgQueries.deleteTicketPriorities(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket priority deleted successfully" });
    });
});

function getTicketPriorityData(req, res){
    return  [
        req.body.name ? req.body.name : "",
        req.body.default_create ? req.body.default_create : true,
        req.body.ui_icon ? req.body.ui_icon : "",
        req.body.ui_color ? req.body.ui_color : "",
        req.body.note ? req.body.note : "",
        req.body.active ? req.body.active : true,
        req.body.updated_by_id ? req.body.updated_by_id : -1,
        req.body.created_by_id ? req.body.created_by_id : -1,
        req.body.created_at ? req.body.created_at : new Date().toUTCString(),
        req.body.updated_at ? req.body.updated_at : new Date().toUTCString()
    ];
}

router.get("/getTicketFlags", (req, res) => {
    pgQueries.getTicketFlags(res, returnResult);
});

router.post("/createTicketFlag", (req, res) => {
    let values = [
        req.body.ticket_id ? req.body.ticket_id : -1,
        req.body.key ? req.body.key : "",
        req.body.value ? req.body.value : "",
        req.body.created_by_id ? req.body.created_by_id : -1,
        req.body.created_at ? req.body.created_at : new Date().toUTCString(),
        req.body.updated_at ? req.body.updated_at : new Date().toUTCString()
    ];

    pgQueries.createTicketFlag(res, values, returnResult);
});

router.put("/updateTicketFlag/:id", (req, res) => {
    let id = req.params.id;
    let values = [
        id,
        req.body.ticket_id ? req.body.ticket_id : -1,
        req.body.key ? req.body.key : "",
        req.body.value ? req.body.value : "",
        req.body.created_by_id ? req.body.created_by_id : -1,
        req.body.created_at ? req.body.created_at : new Date().toUTCString(),
        req.body.updated_at ? req.body.updated_at : new Date().toUTCString()
    ];

    pgQueries.updateTicketFlag(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket flag updated" });
    });
});

router.delete("/deleteTicketFlag/:id", (req, res) => {
    let id = req.params.id;

    let values = [
        id
    ];

    pgQueries.deleteTicketFlag(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket flag deleted successfully" });
    });
});



router.get("/getTicketCounters", (req, res) => {
    pgQueries.getTicketCounters(res, returnResult);
});

router.post("/createTicketCounter", (req, res) => {
    let values = [
        req.body.content ? req.body.content : "",
        req.body.generator ? req.body.generator : ""
    ];

    pgQueries.createTicketCounter(res, values, returnResult);
});

router.put("/updateTicketCounter/:id", (req, res) => {
    let id = req.params.id;
    let values = [
        id,
        req.body.content ? req.body.content : "",
        req.body.generator ? req.body.generator : ""
    ];

    pgQueries.updateTicketCounter(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket counter updated" });
    });
});

router.delete("/deleteTicketCounter/:id", (req, res) => {
    let id = req.params.id;

    let values = [
        id
    ];

    pgQueries.deleteTicketCounter(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket counter deleted successfully" });
    });
});



router.get("/getTicketArticles", (req, res) => {
    pgQueries.getTicketArticles(res, returnResult);
});

router.post("/createTicketArticle", (req, res) => {
    let values = getTicketArticleData(req, res);

    pgQueries.createTicketArticle(res, values, returnResult);
});

router.put("/updateTicketArticle/:id", (req, res) => {
    let id = req.params.id;
    let values = [id, ...getTicketArticleData(req, res)];

    pgQueries.updateTicketArticle(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket article updated" });
    });
});

router.delete("/deleteTicketArticle/:id", (req, res) => {
    let id = req.params.id;

    let values = [
        id
    ];

    pgQueries.deleteTicketArticle(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket article deleted successfully" });
    });
});

function getTicketArticleData(req, res){
    return [
        req.body.ticket_id ? req.body.ticket_id : -1,
        req.body.type_id ? req.body.type_id : -1,
        req.body.sender_id ? req.body.sender_id : -1,
        req.body.from_ ? req.body.from_ : "",
        req.body.to_ ? req.body.to_ : "",
        req.body.cc ? req.body.cc : "",
        req.body.subject ? req.body.subject : "",
        req.body.reply_to ? req.body.reply_to : "",
        req.body.message_id ? req.body.message_id : "",
        req.body.message_id_md5 ? req.body.message_id_md5 : "",
        req.body.in_reply_to ? req.body.in_reply_to : "",
        req.body.content_type ? req.body.content_type : "text/html",
        req.body.references_ ? req.body.references_ : "",
        req.body.body ? req.body.body : "",
        req.body.internal ? req.body.internal : false,
        req.body.preferences ? req.body.preferences : "",
        req.body.updated_by_id ? req.body.updated_by_id : -1,
        req.body.created_by_id ? req.body.created_by_id : -1,
        req.body.origin_by_id ? req.body.origin_by_id : -1,
        req.body.created_at ? req.body.created_at : new Date().toUTCString(),
        req.body.updated_at ? req.body.updated_at : new Date().toUTCString()
    ];
}

router.get("/getTicketArticleTypes", (req, res) => {
    pgQueries.getTicketArticleTypes(res, returnResult);
});

router.post("/createTicketArticleType", (req, res) => {
    let values = [
        req.body.name ? req.body.name : "",
        req.body.note ? req.body.note : "",
        req.body.communication ? req.body.communication : true,
        req.body.active ? req.body.active : true,
        req.body.updated_by_id ? req.body.updated_by_id : -1,
        req.body.created_by_id ? req.body.created_by_id : -1,
        req.body.created_at ? req.body.created_at : new Date().toUTCString(),
        req.body.updated_at ? req.body.updated_at : new Date().toUTCString()
    ];

    pgQueries.createTicketArticleType(res, values, returnResult);
});

router.put("/updateTicketArticleType/:id", (req, res) => {
    let id = req.params.id;
    let values = [
        id,
        req.body.name ? req.body.name : "",
        req.body.note ? req.body.note : "",
        req.body.communication ? req.body.communication : true,
        req.body.active ? req.body.active : true,
        req.body.updated_by_id ? req.body.updated_by_id : -1,
        req.body.created_by_id ? req.body.created_by_id : -1,
        req.body.created_at ? req.body.created_at : new Date().toUTCString(),
        req.body.updated_at ? req.body.updated_at : new Date().toUTCString()
    ];

    pgQueries.updateTicketArticleType(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket article type updated" });
    });
});

router.delete("/deleteTicketArticleType/:id", (req, res) => {
    let id = req.params.id;

    let values = [
        id
    ];

    pgQueries.deleteTicketArticleType(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket article type deleted successfully" });
    });
});



router.get("/getTicketArticleSenders", (req, res) => {
    pgQueries.getTicketArticleSenders(res, returnResult);
});

router.post("/createTicketArticleSender", (req, res) => {
    let values = getTicketArticleSenderData(req, res);

    pgQueries.createTicketArticleSender(res, values, returnResult);
});

router.put("/updateTicketArticleSender/:id", (req, res) => {
    let id = req.params.id;
    let values = [id, ...getTicketArticleSenderData(req, res)];

    pgQueries.updateTicketArticleSender(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket article sender updated" });
    });
});

router.delete("/deleteTicketArticleSender/:id", (req, res) => {
    let id = req.params.id;

    let values = [
        id
    ];

    pgQueries.deleteTicketArticleSender(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket article sender deleted successfully" });
    });
});

function getTicketArticleSenderData(req, res){
    return [
        req.body.name ? req.body.name : "",
        req.body.note ? req.body.note : "",
        req.body.updated_by_id ? req.body.updated_by_id : 1,
        req.body.created_by_id ? req.body.created_by_id : 1,
        req.body.created_at ? req.body.created_at : new Date().toUTCString(),
        req.body.updated_at ? req.body.updated_at : new Date().toUTCString()
    ];
}


router.get("/getTicketArticleFlags", (req, res) => {
    pgQueries.getTicketArticleFlags(res, returnResult);
});

router.post("/createTicketArticleFlags", (req, res) => {
    let values = [
        req.body.ticket_article_id ? req.body.ticket_article_id : -1,
        req.body.key ? req.body.key : "",
        req.body.value ? req.body.value : -1,
        req.body.created_by_id ? req.body.created_by_id : -1,
        req.body.created_at ? req.body.created_at : new Date().toUTCString(),
        req.body.updated_at ? req.body.updated_at : new Date().toUTCString()
    ];

    pgQueries.createTicketArticleFlags(res, values, returnResult);
});

router.put("/updateTicketArticleFlag/:id", (req, res) => {
    let id = req.params.id;
    let values = [
        id,
        req.body.ticket_article_id ? req.body.ticket_article_id : -1,
        req.body.key ? req.body.key : "",
        req.body.value ? req.body.value : -1,
        req.body.created_by_id ? req.body.created_by_id : -1,
        req.body.created_at ? req.body.created_at : new Date().toUTCString(),
        req.body.updated_at ? req.body.updated_at : new Date().toUTCString()
    ];

    pgQueries.updateTicketArticleFlag(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket article flag updated" });
    });
});

router.delete("/deleteTicketArticleFlag/:id", (req, res) => {
    let id = req.params.id;

    let values = [
        id
    ];

    pgQueries.deleteTicketArticleFlag(values, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json({ status: "success", message: "Ticket article flag deleted successfully" });
    });
});








// Zammad ticket endpoints

router.get("/api/v1/tickets", (req, res) => {
    pgQueries.getTickets(res, returnResult);
});


router.get("/api/v1/tickets/:ticket_id", (req, res) => {
    let ticket_id = req.params.ticket_id;

    pgQueries.getTicketById(ticket_id, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json(result.res[0]);
    });
});


router.post("/api/v1/tickets", (req, res) => {
    // create the ticket
    createTicket(req, res, result => {
        if(result.err){
            return res.json(result.err);
        }

        let ticket = result.res;
        req.body.ticket_id = ticket.id;

        createArticle(req, res, result2 => {
            if(result2.err){
                return res.json(result2.err);
            }

            let article = result2.res;

            ticket.article_ids = [article.id];

            res.json(ticket);
        });
    });
});

function createTicket(req, res, cb){
    let values = getTicketData(req, res);

    pgQueries.createTicket(res, values, (res_, result) => {
        cb(result);
    });
}

function createArticle(req, res, cb){
    let article = req.body.article;
    let values = [
        req.body.ticket_id ? req.body.ticket_id : -1,
        req.body.type_id ? req.body.type_id : 1,
        req.body.sender_id ? req.body.sender_id : -1,
        req.body.from_ ? req.body.from_ : "",
        req.body.to_ ? req.body.to_ : "",
        req.body.cc ? req.body.cc : "",
        article.subject,
        req.body.reply_to ? req.body.reply_to : "",
        req.body.message_id ? req.body.message_id : "",
        req.body.message_id_md5 ? req.body.message_id_md5 : "",
        req.body.in_reply_to ? req.body.in_reply_to : "",
        req.body.content_type ? req.body.content_type : "",
        req.body.references_ ? req.body.references_ : "",
        article.body,
        article.internal,
        req.body.preferences ? req.body.preferences : "",
        req.body.updated_by_id ? req.body.updated_by_id : -1,
        req.body.created_by_id ? req.body.created_by_id : -1,
        req.body.origin_by_id ? req.body.origin_by_id : -1,
        req.body.created_at ? req.body.created_at : new Date().toUTCString(),
        req.body.updated_at ? req.body.updated_at : new Date().toUTCString()
    ];

    pgQueries.createTicketArticle(res, values, (res_, result) => {
        cb(result);
    });
}


router.put("/api/v1/tickets/:ticket_id", (req, res) => {
    updateTicket(req, res, result => {
        if(result.err){
            return res.json(result.err);
        }

        updateTicketArticle(req, res, result2 => {
            if(result2.err){
                return res.json(result2.err);
            }

            let ticket_id = req.params.ticket_id;

            pgQueries.getTicketById(ticket_id, result3 => {
                if(result3.err){
                    return res.json(result3.err);
                }

                res.json(result3.res[0]);
            });
        });
    });
});

function updateTicket(req, res, cb){
    let values = [req.params.ticket_id, ...getTicketData(req, res)];

    pgQueries.updateTicket(values, result => {
        cb(result);
    });
}

function updateTicketArticle(req, res, cb){
    let ticket_id = req.params.ticket_id;

    pgQueries.deleteTicketArticleByTicketId([ticket_id], result => {
        if(result.err){
            return result.err;
        }

        let article = req.body.article;
        let values = [
            ticket_id,
            req.body.type_id ? req.body.type_id : -1,
            req.body.sender_id ? req.body.sender_id : -1,
            req.body.from_ ? req.body.from_ : "",
            req.body.to_ ? req.body.to_ : "",
            req.body.cc ? req.body.cc : "",
            article.subject,
            req.body.reply_to ? req.body.reply_to : "",
            req.body.message_id ? req.body.message_id : "",
            req.body.message_id_md5 ? req.body.message_id_md5 : "",
            req.body.in_reply_to ? req.body.in_reply_to : "",
            req.body.content_type ? req.body.content_type : "",
            req.body.references_ ? req.body.references_ : "",
            article.body,
            article.internal,
            req.body.preferences ? req.body.preferences : "",
            req.body.updated_by_id ? req.body.updated_by_id : -1,
            req.body.created_by_id ? req.body.created_by_id : -1,
            req.body.origin_by_id ? req.body.origin_by_id : -1,
            req.body.created_at ? req.body.created_at : new Date().toUTCString(),
            req.body.updated_at ? req.body.updated_at : new Date().toUTCString()
        ];

        pgQueries.createTicketArticle(res, values, (res_, result) => {
            cb(result);
        });
    });
}


router.delete("/api/v1/tickets/:ticket_id", (req, res) => {
    let ticket_id = req.params.ticket_id;

    pgQueries.deleteTicketArticleByTicketId([ticket_id], result => {
        if(result.err){
            return result.err;
        }

        pgQueries.deleteTicket([ticket_id], result2 => {
            if(result2.err){
                return result2.err;
            }

            res.json({});
        });
    });
});




// list articles by tickets
router.get("/api/v1/ticket_articles/by_ticket/:ticket_id", (req, res) => {
    let ticket_id = req.params.ticket_id;

    pgQueries.getTicketArticlesByTicketId(ticket_id, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json(result.res);
    });
});


// List specific article
router.get("/api/v1/ticket_articles/:article_id", (req, res) => {
    let article_id = req.params.article_id;

    pgQueries.getTicketArticlesByArticleId(article_id, result => {
        if(result.err){
            return res.json(result.err);
        }
        res.json(result.res[0]);
    });
});


// Create a plain article
router.post("/api/v1/ticket_articles", (req, res) => {
    createTicketArticle(req, res, result => {
        if(result.err){
            return result.err;
        }

        res.json(result.res);
    });
});

function createTicketArticle(req, res, cb){
    let values = getTicketArticleData(req, res);

    pgQueries.createTicketArticle(res, values, (res_, result) => {
        cb(result);
    });
}


router.get("/api/v1/ticket_priorities", (req, res) => {
    pgQueries.getTicketPriorities(res, returnResult);
});

router.get("/api/v1/ticket_priorities/:id", (req, res) => {
    let id = req.params.id;
    pgQueries.getTicketPrioritiesById(id, result => {
        if(result.err){
            return result.err;
        }

        let priorities = result.res;

        if(priorities.length == 0) return res.status(400).json({ status: 400, message: "Not found" });

        res.json(priorities[0]);
    });
});

// Create a ticket priority
router.post("/api/v1/ticket_priorities", (req, res) => {
    createTicketPriority(req, res, result => {
        if(result.err){
            return result.err;
        }
        res.json(result.res);
    });
});

// Update a ticket priority
router.put("/api/v1/ticket_priorities/:id", (req, res) => {
    updateTicketPriority(req, res, result => {
        if(result.err){
            return res.json(result.err);
        }
        let id = req.params.id;
        pgQueries.getTicketPrioritiesById(id, result => {
            if(result.err){
                return result.err;
            }

            res.json(result.res[0]);
        });
    });
});

// delete a ticket priority
router.delete("/api/v1/ticket_priorities/:id", (req, res) => {
    let id = req.params.id;

    pgQueries.deleteTicketPriorities([id], result => {
        if(result.err){
            return result.err;
        }

        res.json({});
    });
});




// list all states
router.get("/api/v1/ticket_states", (req, res) => {
    pgQueries.getTicketStates(res, returnResult);
});

router.get("/api/v1/ticket_states/:id", (req, res) => {
    let id = req.params.id;
    pgQueries.getTicketStateById(id, result => {
        if(result.err){
            return result.err;
        }

        let states = result.res;

        if(states.length == 0) return res.status(400).json({ status: 400, message: "Not found" });

        res.json(states[0]);
    });
});

// Create a ticket state
router.post("/api/v1/ticket_states", (req, res) => {
    createTicketState(req, res, result => {
        if(result.err){
            return result.err;
        }
        res.json(result.res);
    });
});

// Update a ticket state
router.put("/api/v1/ticket_states/:id", (req, res) => {
    updateTicketState(req, res, result => {
        if(result.err){
            return res.json(result.err);
        }
        let id = req.params.id;
        pgQueries.getTicketStateById(id, result => {
            if(result.err){
                return result.err;
            }

            res.json(result.res[0]);
        });
    });
});

// Delete a ticket state
router.delete("/api/v1/ticket_states/:id", (req, res) => {
    let id = req.params.id;

    pgQueries.deleteTicketState([id], result => {
        if(result.err){
            return result.err;
        }

        res.json({});
    });
});




// list all mentions
router.get("/api/v1/mentions", (req, res) => {
    pgQueries.getMentions(result => {
        if(result.err){
            result.err.errorIndex = 32;
            return res.json(result.err);
        }

        res.json({mentions: result.res});
    });
});

router.post("/api/v1/mentions", (req, res) => {
    let values = [
        req.body.mentionable_type ? req.body.mentionable_type : "Ticket",
        req.body.mentionable_id ? req.body.mentionable_id : 1,
        req.body.user_id ? req.body.user_id : 1,
        req.body.updated_by_id ? req.body.updated_by_id : 1,
        req.body.created_by_id ? req.body.created_by_id : 1,
        new Date().toUTCString(),
        new Date().toUTCString()
    ];

    pgQueries.createMentions(res, values, returnResult);
});

router.delete("/api/v1/mentions/:id", (req, res) => {
    let id = req.params.id;

    pgQueries.getMentionsById(id, result => {
        if(result.err){
            result.err.errorIndex = -1;
            return result.err;
        }

        let mentions = result.res;

        if(mentions.length == 0){
            res.status(404).json({ status: 404, message: "Not found" });
        }else{
            pgQueries.deleteMention([id], result1 => {
                if(result1.err){
                    result1.err.errorIndex = -1;
                    return result1.err;
                }

                res.json(mentions[0]);
            });
        }
    });
});




// list all tags
router.get("/api/v1/tags", (req, res) => {
    let object = req.query.object ? req.query.object : "";
    let o_id = req.query.o_id ? req.query.o_id : -1;

    let tags = [];

    pgQueries.getTagObjectsByName([object], result => {
        if(result.err){
            result.err.errorIndex = -3;
            return res.json(result.err);
        }

        let tagObjects = result.res;
        let numTagObjects = tagObjects.length;
        let count = -1;

        tagObjects.forEach(tagObject => {
            if(tagObject.o_id == o_id){
                let tag_item_id = tagObject.tag_item_id;
                pgQueries.getTagItemById([tag_item_id], result1 => {
                    if(result1.err){
                        result1.err.errorIndex = -4;
                        return res.json(result1.err);
                    }

                    let tag = result1.res[0].name_downcase;

                    tags.push(tag);

                    checkComplete();
                });
            }else{
                checkComplete();
            }
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(count == numTagObjects){
                res.json({ tags: tags });
            }
        }
    });
});

// search all tags
router.get("/api/v1/tag_search", (req, res) => {
    let term = req.query.term;

    let tags = [];

    pgQueries.searchTagItems(term, result => {
        if(result.err){
            result.err.errorIndex = 100;
            return res.json(result.err);
        }

        let found_tags = result.res;
        let numTags = found_tags.length;
        let count = -1;

        found_tags.forEach(tag => {
            tags.push({
                id: tag.id,
                value: tag.name_downcase
            });
            checkComplete();
        });

        checkComplete();

        function checkComplete(){
            count++;
            if(count == numTags){
                return res.json(tags);
            }
        }
    });
});

// add a tag
router.post("/api/v1/tags/add", (req, res) => {
    getOrCreateTagItemId(req, res, tag_item_id => {
        getOrCreateTagObjectId(req, res, tag_object_id => {
            let o_id = req.body.o_id;

            pgQueries.getTagsByO_id([
                tag_item_id,
                tag_object_id,
                o_id
            ], result => {
                if(result.err){
                    result.err.errorIndex = 12;
                    return res.json(result.err);
                }

                if(result.res.length == 0){
                    pgQueries.createTag([
                        tag_item_id,
                        tag_object_id,
                        o_id,
                        1,
                        new Date().toUTCString(),
                        new Date().toUTCString()
                    ], result1 => {
                        if(result1.err){
                            result1.err.errorIndex = 21;
                            return res.json(result1.err);
                        }

                        res.send(true);
                    });
                }else{
                    res.send(true);
                }
            });
        });
    });
});

function getOrCreateTagItemId(req, res, cb){
    let item = req.body.item;

    let item_lowercase = item.toLowercase().trim();

    pgQueries.getTagItemByName([item_lowercase], result => {
        if(result.err){
            result.err.errorIndex = 32;
            return res.json(result.err);
        }
        // if there are no items that match that tag
        if(result.res.length == 0){
            pgQueries.createTagItem([
                item,
                item_lowercase,
                new Date().toUTCString(),
                new Date().toUTCString()
            ], result1 => {
                if(result1.err){
                    result1.err.errorIndex = 33;
                    return res.json(result1.err);
                }

                let tag_item_id = result1.res.id;

                cb(tag_item_id);
            });
        }else{
            let tag_item_id = result.res[0].id;
            cb(tag_item_id);
        }
    });
}

function getOrCreateTagObjectId(req, res, cb){
    let object = req.body.object;

    pgQueries.getTagObjectsByName([object], result => {
        if(result.err){
            result.err.errorIndex = 38;
            return res.json(result.err);
        }

        if(result.res.length == 0){
            pgQueries.createTagObject([
                object,
                new Date().toUTCString(),
                new Date().toUTCString()
            ], result1 => {
                if(result1.err){
                    result1.err.errorIndex = 89;
                    return res.json(result1.err);
                }

                let tag_object_id = result1.res.id;
                cb(tag_object_id);
            });
        }else{
            let tag_object_id = result.res[0].id;
            cb(tag_object_id);
        }
    });
}


// remove a tag
router.delete("/api/v1/tags/remove", (req, res) => {
    getTagItemId(req, res, tag_item_id => {
        getTagObjectId(req, res, tag_object_id => {
            let o_id = req.body.o_id;
            if(tag_item_id == null || tag_object_id == null || o_id == null){
                return res.send(true);
            }

            pgQueries.deleteTagsByO_id([
                tag_item_id,
                tag_object_id,
                o_id
            ], result => {
                if(result.err){
                    result.err.errorIndex = 112;
                    return res.json(result.err);
                }

                return res.send(true);
            });
        });
    });
});


function getTagItemId(req, res, cb){
    let item = req.body.item;

    let item_lowercase = item.toLowercase().trim();

    pgQueries.getTagItemByName([item_lowercase], result => {
        if(result.err){
            result.err.errorIndex = 52;
            return res.json(result.err);
        }

        if(result.res.length == 0){
            cb(null);
        }else{
            let tag_item_id = result.res[0].id;
            cb(tag_item_id);
        }
    });
}

function getTagObjectId(req, res, cb){
    let object = req.body.object;

    pgQueries.getTagObjectsByName([object], result => {
        if(result.err){
            result.err.errorIndex = 48;
            return res.json(result.err);
        }

        if(result.res.length == 0){
            cb(null);
        }else{
            let tag_object_id = result.res[0].id;
            cb(tag_object_id);
        }
    });
}









// linking tickets
router.get("/api/v1/links", (req, res) => {
    let link_object = req.body.link_object ? req.body.link_object : "";
    let link_object_value = req.body.link_object_value ? req.body.link_object_value : "";

    res.json(
        {
            "links": [
               {
                  "link_type": "normal",
                  "link_object": "Ticket",
                  "link_object_value": 147470
               },
               {
                  "link_type": "normal",
                  "link_object": "Ticket",
                  "link_object_value": 147471
               }
            ],
            "assets": {
               "Ticket": {
                  "147470": {
                  "id": 147470,
                  "group_id": 1,
                  "priority_id": 2,
                  "state_id": 2,
                  "organization_id": null,
                  "number": "34147470",
                  "title": "Test Ticket #2",
                  "owner_id": 1,
                  "customer_id": 3,
                  "note": null,
                  "first_response_at": null,
                  "first_response_escalation_at": null,
                  "first_response_in_min": null,
                  "first_response_diff_in_min": null,
                  "close_at": null,
                  "close_escalation_at": null,
                  "close_in_min": null,
                  "close_diff_in_min": null,
                  "update_escalation_at": null,
                  "update_in_min": null,
                  "update_diff_in_min": null,
                  "last_contact_at": "2021-11-03T10:16:45.266Z",
                  "last_contact_agent_at": null,
                  "last_contact_customer_at": "2021-11-03T10:16:45.266Z",
                  "last_owner_update_at": null,
                  "create_article_type_id": 5,
                  "create_article_sender_id": 2,
                  "article_count": 1,
                  "escalation_at": null,
                  "pending_time": null,
                  "type": null,
                  "time_unit": null,
                  "preferences": {},
                  "updated_by_id": 3,
                  "created_by_id": 3,
                  "created_at": "2021-11-03T10:16:45.092Z",
                  "updated_at": "2021-11-03T10:17:01.428Z",
                  "remote_access_permission_by": null,
                  "remote_access": "",
                  "affected_area": "",
                  "service_number": "",
                  "article_ids": [
                     464964
                  ],
                  "ticket_time_accounting_ids": []
                  },
                  "147471": {
                  "id": 147471,
                  "group_id": 1,
                  "priority_id": 2,
                  "state_id": 2,
                  "organization_id": null,
                  "number": "34147471",
                  "title": "Test Ticket #3",
                  "owner_id": 1,
                  "customer_id": 3,
                  "note": null,
                  "first_response_at": null,
                  "first_response_escalation_at": null,
                  "first_response_in_min": null,
                  "first_response_diff_in_min": null,
                  "close_at": null,
                  "close_escalation_at": null,
                  "close_in_min": null,
                  "close_diff_in_min": null,
                  "update_escalation_at": null,
                  "update_in_min": null,
                  "update_diff_in_min": null,
                  "last_contact_at": "2021-11-03T10:16:51.995Z",
                  "last_contact_agent_at": null,
                  "last_contact_customer_at": "2021-11-03T10:16:51.995Z",
                  "last_owner_update_at": null,
                  "create_article_type_id": 5,
                  "create_article_sender_id": 2,
                  "article_count": 1,
                  "escalation_at": null,
                  "pending_time": null,
                  "type": null,
                  "time_unit": null,
                  "preferences": {},
                  "updated_by_id": 3,
                  "created_by_id": 3,
                  "created_at": "2021-11-03T10:16:51.824Z",
                  "updated_at": "2021-11-03T10:16:57.862Z",
                  "remote_access_permission_by": null,
                  "remote_access": "",
                  "affected_area": "",
                  "service_number": "",
                  "article_ids": [
                     464965
                  ],
                  "ticket_time_accounting_ids": []
                  }
               },
               "User": {
                  "3": {
                  "id": 3,
                  "organization_id": null,
                  "login": "test@test.de",
                  "firstname": "Max",
                  "lastname": "Mustermann",
                  "email": "test@test.de",
                  "image": null,
                  "image_source": null,
                  "web": "",
                  "phone": "",
                  "fax": "",
                  "mobile": "",
                  "department": null,
                  "street": "",
                  "zip": "",
                  "city": "",
                  "country": "",
                  "address": null,
                  "vip": false,
                  "verified": false,
                  "active": true,
                  "note": "",
                  "last_login": "2021-11-01T05:03:23.328Z",
                  "source": null,
                  "login_failed": 0,
                  "out_of_office": false,
                  "out_of_office_start_at": null,
                  "out_of_office_end_at": null,
                  "out_of_office_replacement_id": null,
                  "preferences": {
                     "notification_config": {
                        "matrix": {
                        "create": {
                           "criteria": {
                              "owned_by_me": true,
                              "owned_by_nobody": true,
                              "subscribed": true,
                              "no": false
                           },
                           "channel": {
                              "email": true,
                              "online": true
                           }
                        },
                        "update": {
                           "criteria": {
                              "owned_by_me": true,
                              "owned_by_nobody": true,
                              "subscribed": true,
                              "no": false
                           },
                           "channel": {
                              "email": true,
                              "online": true
                           }
                        },
                        "reminder_reached": {
                           "criteria": {
                              "owned_by_me": true,
                              "owned_by_nobody": false,
                              "subscribed": false,
                              "no": false
                           },
                           "channel": {
                              "email": true,
                              "online": true
                           }
                        },
                        "escalation": {
                           "criteria": {
                              "owned_by_me": true,
                              "owned_by_nobody": false,
                              "subscribed": false,
                              "no": false
                           },
                           "channel": {
                              "email": true,
                              "online": true
                           }
                        }
                        }
                     },
                     "locale": "de-de",
                     "intro": true
                  },
                  "updated_by_id": 1,
                  "created_by_id": 1,
                  "created_at": "2021-10-29T13:25:59.261Z",
                  "updated_at": "2021-11-01T05:03:23.334Z",
                  "salutation": null,
                  "wawi_number": 0,
                  "guid": null,
                  "notification_optin": false,
                  "zr_number": null,
                  "role_ids": [
                     1,
                     2
                  ],
                  "organization_ids": [],
                  "authorization_ids": [],
                  "karma_user_ids": [],
                  "group_ids": {
                     "1": [
                        "full"
                     ]
                  },
                  "accounts": {}
                  },
                  "1": {
                  "id": 1,
                  "organization_id": null,
                  "login": "-",
                  "firstname": "-",
                  "lastname": "",
                  "email": "",
                  "image": null,
                  "image_source": null,
                  "web": "",
                  "phone": "",
                  "fax": "",
                  "mobile": "",
                  "department": "",
                  "street": "",
                  "zip": "",
                  "city": "",
                  "country": "",
                  "address": "",
                  "vip": false,
                  "verified": false,
                  "active": false,
                  "note": "",
                  "last_login": null,
                  "source": null,
                  "login_failed": 0,
                  "out_of_office": false,
                  "out_of_office_start_at": null,
                  "out_of_office_end_at": null,
                  "out_of_office_replacement_id": null,
                  "preferences": {},
                  "updated_by_id": 1,
                  "created_by_id": 1,
                  "created_at": "2021-10-29T13:11:53.378Z",
                  "updated_at": "2021-10-29T13:11:53.378Z",
                  "salutation": null,
                  "wawi_number": 0,
                  "guid": null,
                  "notification_optin": false,
                  "zr_number": null,
                  "role_ids": [],
                  "organization_ids": [],
                  "authorization_ids": [],
                  "karma_user_ids": [],
                  "group_ids": {},
                  "accounts": {}
                  }
               },
               "Role": {
                  "1": {
                  "id": 1,
                  "name": "Admin",
                  "preferences": {},
                  "default_at_signup": false,
                  "active": true,
                  "note": "To configure your system.",
                  "updated_by_id": 3,
                  "created_by_id": 1,
                  "created_at": "2021-10-29T13:11:53.503Z",
                  "updated_at": "2021-10-30T21:44:00.923Z",
                  "permission_ids": [
                     1,
                     41,
                     51,
                     61
                  ],
                  "group_ids": {}
                  },
                  "2": {
                  "id": 2,
                  "name": "Agent",
                  "preferences": {},
                  "default_at_signup": false,
                  "active": true,
                  "note": "To work on Tickets.",
                  "updated_by_id": 3,
                  "created_by_id": 1,
                  "created_at": "2021-10-29T13:11:53.542Z",
                  "updated_at": "2021-10-30T18:26:29.027Z",
                  "permission_ids": [
                     41,
                     53,
                     56,
                     58,
                     62
                  ],
                  "group_ids": {}
                  }
               },
               "Group": {
                  "1": {
                  "id": 1,
                  "signature_id": 1,
                  "email_address_id": null,
                  "name": "Users",
                  "assignment_timeout": null,
                  "follow_up_possible": "yes",
                  "follow_up_assignment": true,
                  "active": true,
                  "note": "Standard Group/Pool for Tickets.",
                  "updated_by_id": 1,
                  "created_by_id": 1,
                  "created_at": "2021-10-29T13:11:54.863Z",
                  "updated_at": "2021-10-30T18:53:24.803Z",
                  "user_ids": [
                     3,
                     2,
                     5,
                     55,
                     65,
                     83,
                     90,
                     101,
                     105,
                     112,
                     118,
                     132,
                     153,
                     168,
                     203,
                     295,
                     493,
                     515,
                     528,
                     535,
                     565,
                     618,
                     730,
                     755,
                     839,
                     859,
                     912,
                     914,
                     983,
                     1106,
                     1138,
                     1229,
                     1287,
                     1405,
                     1410,
                     1482,
                     1486,
                     1490,
                     1543,
                     1573
                  ]
                  }
               }
            }
         }
    );
});

router.post("/api/v1/links/add", (req, res) => {
    let link_type = req.body.link_type ? req.body.link_type : "";
    let link_object_target = req.body.link_object_target ? req.body.link_object_target : "";
    let link_object_target_value = req.body.link_object_target_value ? req.body.link_object_target_value : "";
    let link_object_source = req.body.link_object_source ? req.body.link_object_source : "";
    let link_object_source_number = req.body.link_object_source_number ? req.body.link_object_source_number : "";
    
    res.json({
        id: 5,
        link_type_id: 1,
        link_object_source_id: 1,
        link_object_source_value: 147471,
        link_object_target_id: 1,
        link_object_target_value: 147469,
        created_at: "2021-11-03T10:40:14.528Z",
        updated_at: "2021-11-03T10:40:14.528Z"
     });
});

router.delete("/api/v1/links/remove", (req, res) => {
    let link_type = req.body.link_type ? req.body.link_type : "";
    let link_object_source = req.body.link_object_source ? req.body.link_object_source : "";
    let link_object_source_value = req.body.link_object_source_value ? req.body.link_object_source_value : "";
    let link_object_target = req.body.link_object_target ? req.body.link_object_target : "";
    let link_object_target_value = req.body.link_object_target_value ? req.body.link_object_target_value : "";
    
    res.json(
        { }
    );
});
module.exports = router;