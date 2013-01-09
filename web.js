var irc = require('irc');
var http = require('http');
var url = require('url');
var crypto = require('crypto');

var settings = {
    irc_host: process.env.IRC_HOST,
    irc_user: process.env.IRC_USER,
    irc_channels: process.env.IRC_CHANNELS.split(','),
    secret: process.env.SECRET
};

var client = new irc.Client(settings.irc_host, settings.irc_user, {
    channels: settings.irc_channels,
});

client.addListener('error', function(e){
    console.log(e);
});

client.addListener('join', function(channel, nick, message){
    console.log('join: ' + channel + ' ' + nick + ' ' + message);
});

http.createServer(function (req, res) {
    var query = url.parse(req.url, true).query;

    if ('string' !== typeof(query.message)) {
        return res.end('error');
    }

    if ('string' != typeof(query.channel)) {
        return res.end('no channel');
    }

    if (settings.secret) {
        if ('string' != typeof(query.timestamp)) {
            return res.end('no timestamp');
        }

        if (Math.abs(1000 * parseInt(query.timestamp) - (new Date()).getTime()) > 300 * 1000) {
            return res.end('expired');
        }

        if ('string' != typeof(query.sig)) {
            return res.end('no sig');
        }

        var md5_crypto = crypto.createHash('md5');
        md5_crypto.update(query.message + settings.secret + query.timestamp + query.channel);
        var sig = md5_crypto.digest('hex');

        if (sig != query.sig) {
            return res.end('sig error');
        }
    }

    client.say(query.channel, query.message);

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('done\n');
}).listen(process.env.PORT, '0.0.0.0');
