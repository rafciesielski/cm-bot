var user = 'Huber';
var pass = 'consol';

var auth = 'Basic ' + new Buffer(user + ':' + pass).toString('base64');

var authorizationHeader = 'Authorization: ' + auth

var Curl = require('node-libcurl').Curl,
    querystring = require('querystring');
    cmUriBase = 'https://ryjqyhxpyj.localtunnel.me';

module.exports = {
    createTicket: function (ticket, callback) {

        var curl = new Curl(),
            url = `${cmUriBase}/restapi/tickets`,
            data = {
                'subject': ticket.subject,
                'queue': ticket.queue,
                'helpdesk_standard.priority': ticket.priority,                
                'country': ticket.country,
                'comment': ticket.comment,
                'customer': '497'
            };

        data = querystring.stringify(data);

        curl.setOpt(Curl.option.URL, url);
        curl.setOpt(Curl.option.POSTFIELDS, data);
        curl.setOpt(Curl.option.HTTPHEADER, [authorizationHeader, 'Accept: application/json']);
        curl.setOpt(Curl.option.VERBOSE, false);

        curl.perform();

        curl.on('end', function (statusCode, body, headers) {
            //var restUri = JSON.parse(body).uri    
            //console.log(`restUri: ${restUri}`)    
            //var idx = restUri.lastIndexOf('/');
            //var id = restUri.substring(idx + 1);
            var id = 100848;
            callback(`${cmUriBase}/cm-client/ticket/ticket_name/${id}`);
            this.close();
        });

        //curl.on('error', curl.close.bind(curl));

        //err, errCode
        curl.on('error', function (err, errCode) {
            console.log(`err: ${err}`)
            console.log(`errCode: ${errCode}`)
        });
    }
}

