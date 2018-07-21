/* ------------------ plotly -------------------- */

var plotly = require('plotly')('robinvanemden', 'key_here');
var stream_token = 'token_here'

var initData = [{
    x: ['> 0.3um', '> 0.5um', '> 1.0um', '> 2.5um', '> 5.0um', '> 50 um'],
    y: [],
    marker: {
        color: ["#1d4877", "#1b8a5a", " #fbb021", "#f68838", "#ee3e32", "#003e32"]
    },
    name: 'sample',
    type: 'bar',
    stream: {
        token: stream_token,
        maxpoints: 2000
    }
}];

var layout = {
    barmode: "stack",
    autosize: false,
    width: 600,
    height: 400,
	yaxis: {
      type: "log",
	  yaxis: {range: [0, 1500]}
    }
};

var initGraphOptions = {
    fileopt: "extend",
    filename: "pm25",
    layout: layout
};

plotly.plot(initData, initGraphOptions, function(err, msg) {
    if (err) return console.log(err)
});

var stream = plotly.stream(stream_token, function(err, res) {
	console.log(err, res);
	clearInterval(loop); 
});

/* ------------------ pubnub -------------------- */

var PubNub = require('pubnub')

pubnub = new PubNub({
    subscribeKey: 'key_here'
})

pubnub.subscribe({
    channels: ['pm25']
});


pubnub.addListener({
    status: function(statusEvent) {},
    message: function(msg) {
        console.log(msg.message[0]);
        var arr = new Array(6)
        arr[0] = msg.message[0].data
        arr[1] = msg.message[1].data
        arr[2] = msg.message[2].data
        arr[3] = msg.message[3].data
        arr[4] = msg.message[4].data
        arr[5] = msg.message[5].data
        console.log(arr);
        var streamObject = JSON.stringify({
            y: arr
        });
        console.log(streamObject);
        stream.write(streamObject + '\n');
    }
})

