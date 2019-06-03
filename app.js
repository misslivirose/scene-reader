const express = require('express');
const path = require('path');
var request = require('request');


const app = express();
const port = 3000;

require('dotenv').config();

const apiEndpoint = "https://westus2.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Description&language=en";

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));
app.use('/js', express.static(__dirname + '/js'));
app.use('/resources', express.static(__dirname + '/resources'));

app.listen(port, () => console.log(`Server running on port :${port}/`));

app.post('/requestCaption', function (req, res) {
    var body = [];
    req.on('data', chunk => {
        body.push(chunk);
    });
    req.once('end', function() {
        var buffer = body;
        var options = {
            url: apiEndpoint,
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': process.env.API_KEY,
                'Content-Type' : 'application/octet-stream' 
            },
            body: buffer
        }
        request(options, function (error, response) {
            if (response.statusCode == 200) {
                var responseJSON;
                try {
                    responseJSON = JSON.parse(response.body);
                }
                catch (e) {
                    return res.status(417).send({
                        success: 'false', 
                        message: 'Error Generating Caption'
                    });
                }
                return res.status(200).send({
                    success: 'true', 
                    message: responseJSON.description.captions[0].text
                });
            } else {
                console.log("Error Generating Caption");
                return res.status(417).send({
                    success: 'false', 
                    message: 'Error Generating Caption'
                });
            }
        });
    });
    
});
