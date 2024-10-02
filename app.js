const fs = require('node:fs');

let config = null;

function _initialize_config(){
    try {
        //load api key from local config file
        const data = fs.readFileSync(__dirname + '/config.json', 'utf8');
        config = JSON.parse(data.toString());

    } catch (err) {
        console.error(err);
    }
}
