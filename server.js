'use strict'

const express = require('express')
const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')

// use `PORT` env var on Beep Boop - default to 3000 locally
var port = process.env.PORT || 3000

var slapp = Slapp({
    // Beep Boop sets the SLACK_VERIFY_TOKEN env var
    verify_token: process.env.SLACK_VERIFY_TOKEN,
    convo_store: ConvoStore(),
    context: Context()
})


var HELP_TEXT = `
Available commands:
\`newticket\` - creates new ticket. Use: /newticket {subject}.
`

//*********************************************
// Setup different handlers for messages
//*********************************************

// response to the user typing "help"
slapp.message('help', ['mention', 'direct_message'], (msg) => {
    msg.say(HELP_TEXT)
})

slapp.command('/newticket', (msg, subject) => {
    msg.say(`Subject: ${subject}`)
        .say(queue_options)
    //.say(priority_options)
    //.say(country_options)
    //.route('comment-route', {subject: subject})
})
    .route('comment-route', (msg, state) => {
        msg.say('Describe problem')
    })

var queue_options = {
    text: '',
    attachments: [
        {
            text: 'Select queue:',
            fallback: 'Select queue:',
            callback_id: 'queue_callback',
            actions: [
                { name: 'answer', text: 'HelpDesk 1st Level', type: 'button', value: 'HelpDesk_1st_Level' },
                { name: 'answer', text: 'HelpDesk 2nd Level', type: 'button', value: 'HelpDesk_2nd_Level' },
                { name: 'answer', text: 'Sales', type: 'button', value: 'Sales' }
            ]
        }]
}

slapp.action('queue_callback', 'answer', (msg, value) => {
    msg.respond(msg.body.response_url, `Queue: ${value}`)
        .say(priority_options)
})

var priority_options = {
    text: '',
    attachments: [
        {
            text: 'Select priority:',
            fallback: 'Select priority:',
            callback_id: 'priority_callback',
            actions: [
                { name: 'answer', text: 'Low', type: 'button', value: 'low' },
                { name: 'answer', text: 'Normal', type: 'button', value: 'normal' },
                { name: 'answer', text: 'High', type: 'button', value: 'high' }
            ]
        }]
}

slapp.action('priority_callback', 'answer', (msg, value) => {
    msg.respond(msg.body.response_url, `Priority: ${value}`)
})

var country_options = {
    text: '',
    attachments: [
        {
            text: 'Select country:',
            fallback: 'Select country:',
            callback_id: 'country_callback',
            actions: [
                { name: 'answer', text: 'Germany', type: 'button', value: 'germany' },
                { name: 'answer', text: 'France', type: 'button', value: 'france' },
                { name: 'answer', text: 'Poland', type: 'button', value: 'poland' }
            ]
        }]
}

slapp.action('country_callback', 'answer', (msg, value) => {
    msg.respond(msg.body.response_url, `Country: ${value}`)
})

// Catch-all for any other responses not handled above
slapp.message('.*', ['direct_mention', 'direct_message'], (msg) => {
    // respond only 40% of the time
    if (Math.random() < 0.4) {
        msg.say([':wave:', ':pray:', ':raised_hands:'])
    }
})

// attach Slapp to express server
var server = slapp.attachToExpress(express())

// start http server
server.listen(port, (err) => {
    if (err) {
        return console.error(err)
    }

    console.log(`Listening on port ${port}`)
})