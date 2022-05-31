const pgQueries = require('../../postgres/ticket-queries');

module.exports = (ticket_id, title, group, state, priority, cb) => {
    pgQueries.getTicketById(ticket_id, result => {
        if(result.err || result.res.length == 0){
            return cb(result);
        }

        let tk = result.res[0];

        pgQueries.getTicketPriorityByName(priority, result => {
            if(result.err){
                return cb(result);
            }
    
            let priority_id = 2;
            if(result.res.length > 0){
                priority_id = result.res[0].id;
            }
    
            pgQueries.getTicketStateByName(state, result => {
                if(result.err){
                    return cb(result);
                }
        
                let state_id = 4;
                if(result.res.length > 0){
                    state_id = result.res[0].id;
                }
    
                let values = [
                    ticket_id,
                    tk.group_id,
                    priority_id,
                    state_id,
                    tk.organization_id,
                    tk.number,
                    title,
                    tk.owner_id,
                    tk.customer_id,
                    tk.note,
                    tk.first_response_at,
                    tk.first_response_escalation_at,
                    tk.first_response_in_min,
                    tk.first_response_diff_in_min,
                    tk.close_at,
                    tk.close_escalation_at,
                    tk.close_in_min,
                    tk.close_diff_in_min,
                    tk.update_escalation_at,
                    tk.update_in_min,
                    tk.update_diff_in_min,
                    tk.last_contact_at,
                    tk.last_contact_agent_at,
                    tk.last_contact_customer_at,
                    tk.last_owner_update_at,
                    tk.create_article_article_type_id,
                    tk.create_article_sender_id,
                    tk.article_count,
                    tk.escalation_at,
                    tk.pending_time,
                    tk.type,
                    tk.time_unit,
                    tk.preferences,
                    tk.updated_by_id,
                    tk.created_by_id,
                    tk.created_at,
                    new Date().toUTCString()
                ];
            
                pgQueries.updateTicket(values, result => {
                    cb(result);
                });
            });
        });
    });
};