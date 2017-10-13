var user = 'Huber';
var pass = 'consol';

var auth = 'Basic ' + new Buffer(user + ':' + pass).toString('base64');

var authorizationHeader = 'Authorization: ' + auth

var Curl = require('node-libcurl').Curl,
    querystring = require('querystring');

module.exports = {
    createTicket: function (callback) {

        var curl = new Curl(),
            url = 'https://jsuzubvilz.localtunnel.me/restapi/tickets',
            data = {
                'subject': 'test1',
                'queue': 'HelpDesk_1st_Level',
                'helpdesk_standard.priority': 'low',
                'comment': 'bla bla bla',
                'country': 'germany',
                'customer': '497'
            };

        data = querystring.stringify(data);

        curl.setOpt(Curl.option.URL, url);
        curl.setOpt(Curl.option.POSTFIELDS, data);
        curl.setOpt(Curl.option.HTTPHEADER, [authorizationHeader, 'Accept: application/json']);
        curl.setOpt(Curl.option.VERBOSE, false);

        console.log(querystring.stringify(data));

        curl.perform();

        curl.on('end', function (statusCode, body, headers) {

            var uri = JSON.parse(body).uri

            callback(uri);

            this.close();
        });

        curl.on('error', curl.close.bind(curl));
    }
}

