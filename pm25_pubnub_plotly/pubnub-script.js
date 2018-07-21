var PubNub = require('pubnub')

pubnub = new PubNub({
   publishKey : 'key_here',
   subscribeKey : 'key_here'
})

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('Com6', {
    baudRate:115200
});
const parser = new Readline();
port.pipe(parser);
parser.on('data', function (data) {
	data = data.trim();
	var data_values = data.split(',')
	if(data != 'null' && data != "" && data_values.length ==6){ 
		data_values = data_values.map(Number);
		var data = [
			{
				"event_name": "> 0.3um",
				"data": data_values[0]
			},
			{
				"event_name": "> 0.5um",
				"data": data_values[1]
			},
			{
				"event_name": "> 1.0um",
				"data": data_values[2]
			},
			{
				"event_name": "> 2.5um",
				"data": data_values[3]
			},
			{
				"event_name": "> 5.0um",
				"data": data_values[4]
			},
			{
				"event_name": "> 50 um",
				"data": data_values[5]
			}
		]

		pubnub.publish(
			{
				message: data,
				channel: "pm25",
			},
			function (status, response) {
				console.log(status, response);
			}
		);

	}
});


