var request = require("request")

//var cmUriBase = 'http://localhost:8888'
var cmUriBase = 'http://d19906be.ngrok.io'
var app = 'slack'
var custHeaders = {  
    "SECRET_TOKEN": "12345678",
}

module.exports = {
    createTicket: function (ticket, callback) {
        var options = {
            uri: `${cmUriBase}/intg/${app}/service`,
            method: 'POST',
            headers: custHeaders,
            json: JSON.stringify(ticket)
          }
        request(options, function reqCallback(error, response, body) {
            if (!error && response.statusCode == 200) {  
                console.log(body);              
                callback(`${cmUriBase}/cm-client/ticket/ticket_name/${body.ticketId}`);
            } else {
                console.log(error);
            }
        });
    }
}

