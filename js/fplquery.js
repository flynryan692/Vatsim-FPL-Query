function searchFlights() {
    let acid = document.getElementById('acidInput');

    if (acid.value.length > 1) {
        acid.classList.remove("is-invalid");

        //Use fetch to begin manipulating the JSON.
        fetch('./Data/vatsim-data.json')
            .then(function (response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                // Read the response as json.
                return response.json();
            })
            .then(function (dataAsJson) {
                // Do stuff with the JSON
                console.log(dataAsJson);
                for (i = 0; i < dataAsJson.pilots.length; i++) {

                    if (acid.value.toUpperCase() === dataAsJson.pilots[i].callsign) {
                        console.log("We found a match!");
                    }
                }

            })
            .catch(function (error) {
                console.log('Looks like there was a problem: \n', error);
            });


    } else {
        acid.classList.add("is-invalid");
        console.log("No aircraft id entered");
    }

}