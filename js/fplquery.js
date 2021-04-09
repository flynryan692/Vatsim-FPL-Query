//Use fetch to begin manipulating the JSON.
fetch('./Data/vatsim-data.json')
    .then(function (response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        // Read the response as json.
        return response.json();
    })
    .then(function (responseAsJson) {
        // Do stuff with the JSON
        console.log(responseAsJson);
        for (i = 0; i < responseAsJson.pilots.length; i++) {
            var callsign = responseAsJson.pilots[i].callsign;
        }
    })
    .catch(function (error) {
        console.log('Looks like there was a problem: \n', error);
    });