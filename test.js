var cmservice = require('./cmservice.js')

var ticket = {}
ticket.subject = 'test123'
ticket.queue = 'HelpDesk_1st_Level'
ticket.priority = 'low'
ticket.country = 'germany'
ticket.comment = 'tra la la ...'

cmservice.createTicketMock(ticket, function(uri) {
    console.log(uri);
});