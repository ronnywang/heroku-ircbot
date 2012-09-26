在 Heroku 上面跑一隻 IRC 機器人
===============================

環境建立法
1. git clone git://github.com/ronnywang/heroku-ircbot.git
2. cd heroku-ircbot
3. git remote add heroku git@heroku.com:your-ircbot-app
4. heroku config:set IRC\_HOST=irc.freenode.net IRC\_USER=your\_bot\_nick IRC\_CHANNELS=#your\_channel\_1,#your\_channel\_2 SECRET=your\_secret
3. git push heroku master

這樣子就建立好環境了, 如果到 http://your-irc-app.herokuapp.com/ 裡面有看到 error 就表示成功了

PHP Sample:
    
    {{lang:php}}
    <?php
    $now = time();
    $message = 'Your Message';
    $channel = '#your_channel_1';
    $secret = 'your_secret';

    $sig = md5($message . $secret . $now . $channel);
    $url = 'http://your-ircbot-app.herokuapp.com/?message=' . urlencode($message) . '&channel=' . urlencode($channel) . '&timestamp=' . $now . '&sig=' . urlencode($sig)
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_exec($curl);
    curl_close($curl);
