var request = require("request")

//var cmUriBase = 'http://localhost:8888'
var cmUriBase = 'http://9e187f49.ngrok.io'
var app = 'slack'
var webhookHeaders = {  
    "SECRET_TOKEN": "12345678",
}

module.exports = {
    createTicket: function (ticket, callback) {
        var options = {
            uri: `${cmUriBase}/intg/${app}/service`,
            method: 'POST',
            headers: webhookHeaders,
            json: JSON.stringify(ticket)
          }
        request(options, function reqCallback(error, response, body) {
            if (!error && response.statusCode == 200) {  
                console.log(body);              
                callback(`${cmUriBase}/cm-client/ticket/ticket_id/${body.ticketId}`);
            } else {
                console.log(error);
            }
        });
    }
}

