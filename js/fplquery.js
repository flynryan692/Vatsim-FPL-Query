function refreshData() {
    var refreshBtn = document.getElementById("refreshBtn");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "./Data/UpdateData.php");
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            refreshBtn.disabled = true;
            console.log(this.responseText);
        } else {
            refreshBtn.innerHTML = `<i class="bi bi-cloud-download"></i> Refreshing`;
            setTimeout(function () {
                refreshBtn.disabled = false;
                refreshBtn.innerHTML = `<i class="bi bi-arrow-clockwise"></i> Refresh Data`;
            }, 5000);
        };
    }
}

function searchFlights() {
    let acid = document.getElementById('acidInput');
    let resultBox = document.getElementById('queryResults');

    if (acid.value.length > 1) {
        acid.classList.remove("is-invalid");

        //Use fetch to begin manipulating the JSON.
        const url = './Data/vatsim-data.json';
        fetch(url)
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
                console.log(dataAsJson.general.update_timestamp);
                for (i = 0; i < dataAsJson.pilots.length; i++) {

                    if (acid.value.toUpperCase() === dataAsJson.pilots[i].callsign) {
                        resultBox.innerHTML = `
                        <div class="card mx-auto" style="width: 48rem;">
                            <div class="card-body">
                                <h5 class="card-title">Flight Plan Results For ${dataAsJson.pilots[i].callsign}</h5>
                                <table class="table">
                                    <tr>
                                        <td><strong>Origin:</strong> ${dataAsJson.pilots[i].flight_plan.departure}</td>
                                        <td><strong>ETD:</strong> ${dataAsJson.pilots[i].flight_plan.deptime}</td>
                                        <td><strong>Destination:</strong> ${dataAsJson.pilots[i].flight_plan.arrival}</td>
                                        <td><strong>Alternate:</strong> ${dataAsJson.pilots[i].flight_plan.alternate}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Aircraft:</strong> ${dataAsJson.pilots[i].flight_plan.aircraft_short}</td>
                                        <td><strong>Cruise Speed:</strong> ${dataAsJson.pilots[i].flight_plan.cruise_tas}</td>
                                        <td><strong>Cruise Altitude:</strong> ${dataAsJson.pilots[i].flight_plan.altitude}</td>
                                        <td><strong>Fuel Time:</strong> ${dataAsJson.pilots[i].flight_plan.fuel_time}</td>
                                    </tr>
                                    <tr>
                                        <td colspan="4"><strong>Remarks:</strong> ${dataAsJson.pilots[i].flight_plan.remarks}</td>
                                    </tr>
                                    <tr>
                                        <td colspan="4"><strong>Route:</strong> ${dataAsJson.pilots[i].flight_plan.route}</td>
                                    </tr>

                                </table>
                            </div>
                        </div>
                        `;
                        break;
                    } else {
                        resultBox.innerHTML = `
                        <div class="alert alert-danger" role="alert">
                        No Results Found For <strong>${acid.value.toUpperCase()}</strong>. Please try again.
                      </div>
                        `;
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