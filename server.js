'use strict'

const express = require('express')
const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')

var port = process.env.PORT || 3000

var slapp = Slapp({
    verify_token: process.env.SLACK_VERIFY_TOKEN,
    convo_store: ConvoStore(),
    context: Context()
})

var HELP_TEXT = `
Available commands:
\`newticket\` - creates new ticket. Use: /newticket {subject}.
`
slapp.message('help', ['mention', 'direct_message'], (msg) => {
    msg.say(HELP_TEXT)
})


var ticket = {}

slapp.command('/newticket', (msg, subject) => {
    ticket.subject = subject
    msg.say(`Subject: ${subject}`)
        .say(queue_options)
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
    ticket.queue = value
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
    ticket.priority = value
    msg.respond(msg.body.response_url, `Priority: ${value}`)
        .say(country_options)
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
    ticket.country = value
    msg.respond(msg.body.response_url, `Country: ${value}`)
        .say('Describe problem in few words:')
        .route('comment-route', {})
})
    .route('comment-route', (msg, state) => {
        var text = (msg.body.event && msg.body.event.text) || ''
        ticket.comment = text
        console.log(`New ticket: ${JSON.stringify(ticket)}`)
        msg.say(`Description: ${text}`)
            .say('The problem was reported: https://cerimnoplt.localtunnel.me/cm-client/ticket/ticket_name/100806')
            .say('Thank you! Bye!')
    })

var server = slapp.attachToExpress(express())

server.listen(port, (err) => {
    if (err) {
        return console.error(err)
    }

    console.log(`Listening on port ${port}`)
})