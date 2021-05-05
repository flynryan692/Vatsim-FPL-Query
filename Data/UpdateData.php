<?php

/***** 
 * We need to first find the latest URL to the Vatsim V3 JSON file
 * in the whazzup, and make a copy so we aren't cosntantly hitting 
 * their sever, and also in case it goes down temporarily. 
 * 
 * Then we need to copy the data from the JSON file so we have it
 * locally. This way we can use the JS fetch API to begin using the 
 * data. Obviously we can do that with PHP, but this is a JS project!
 * 
 ******/
const CACHE_FILE = "stats-base.txt";
const WHAZZUP = "https://status.vatsim.net/";
const JSON_FILE = "vatsim-data.json";

//check the age of our whazzup file
if (time() - @filemtime(CACHE_FILE) > 43200) {
    //It's time to pull down a new whazzup
    $whazzup = file_get_contents(WHAZZUP);
    if (!$whazzup) {
        echo "Unable to fetch whazzup";
        die();
    }
    file_put_contents(CACHE_FILE, $whazzup);
    // make sure the mtime is mutated
    touch(CACHE_FILE);
} else {
    //We're using the cached whazzup
    $whazzup = file_get_contents(CACHE_FILE);
}

//check how old the json file is and update if older than x
$filetime = @filemtime(JSON_FILE);
$cache_life = '120'; //caching time, in seconds
if (!$filetime or (time() - $filetime >= $cache_life)) {
    //get the contents of the current json file
    preg_match_all("/json3=(.*)/", $whazzup, $matches);
    $servers = $matches[1];
    $server = trim($servers[array_rand($servers)]);

    //store the contents of the json file locally
    $dataFeed = file_get_contents($server);
    if (!$dataFeed) {
        echo 'No data feed';
        die();
    }
    file_put_contents(JSON_FILE, $dataFeed);
    // make sure the mtime is mutated
    touch(JSON_FILE);
    echo 'vatsim-data.json was updated successfully.';
} else {
    echo 'Data not updated.';
}
