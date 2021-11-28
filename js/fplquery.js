const resultBox = document.getElementById('queryResults');

//Run PHP script to grab data from Vatsim and save it locally
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

//handle the JSON and return the data
async function getJSONData(){
   //const response = await fetch('./Data/vatsim-data.json');
   const response = await fetch('https://data.vatsim.net/v3/vatsim-data.json');

   if(!response.ok){
       const message = `There was a problem getting the JSON: ${response.status}`;
       throw new Error(message);
   }

   const data = await response.json();
   return data;
}

//search the JSON for the flight
async function findFlight(){
    let acid = document.getElementById('acidInput');
    const vatsimData = await getJSONData();

    if (acid.value.length > 1) {
        acid.classList.remove("is-invalid");
        console.log(vatsimData);
        for (i = 0; i < vatsimData.pilots.length; i++) {

            if (acid.value.toUpperCase() === vatsimData.pilots[i].callsign) {
                displayFlight(vatsimData.pilots[i]);
                break;
            } else {
                resultBox.innerHTML = `
                <div class="alert alert-danger" role="alert">
                No Results Found For <strong>${acid.value.toUpperCase()}</strong>. Please try again.
            </div>
                `;
            }
        }

    } else {
        acid.classList.add("is-invalid");
        console.log("No aircraft id entered");
    }


}

//TODO display the flight information seperate from the search 
function displayFlight(flight, valid=true){
   const flightInfo = resultBox.innerHTML = `
    <div class="card mx-auto" style="width: 48rem;">
        <div class="card-body">
            <h5 class="card-title">Flight Plan Results For ${flight.callsign}</h5>
            <table class="table">
                <tr>
                    <td><strong>Origin:</strong> ${flight.flight_plan.departure}</td>
                    <td><strong>ETD:</strong> ${flight.flight_plan.deptime}</td>
                    <td><strong>Destination:</strong> ${flight.flight_plan.arrival}</td>
                    <td><strong>Alternate:</strong> ${flight.flight_plan.alternate}</td>
                </tr>
                <tr>
                    <td><strong>Aircraft:</strong> ${flight.flight_plan.aircraft_short}</td>
                    <td><strong>Cruise Speed:</strong> ${flight.flight_plan.cruise_tas}</td>
                    <td><strong>Cruise Altitude:</strong> ${flight.flight_plan.altitude}</td>
                    <td><strong>Fuel Time:</strong> ${flight.flight_plan.fuel_time}</td>
                </tr>
                <tr>
                    <td colspan="4"><strong>Remarks:</strong> ${flight.flight_plan.remarks}</td>
                </tr>
                <tr>
                    <td colspan="4"><strong>Route:</strong> ${flight.flight_plan.route}</td>
                </tr>

            </table>
        </div>
    </div>
    `; 
    return flightInfo;
}