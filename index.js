const Mongo = require('./utils/mongo');
const axios = require('axios');
const zipCodes = require('./assets/zipcodes').zipCodes();

const delay = seconds => {
    return new Promise((fulfill, reject) => {
        setTimeout(() => {
            fulfill();
        }, seconds * 1000);
    })
};

const init = async (db = undefined) => {

    if (db == undefined) {
        db = await Mongo.mongoConnect('carfax_com');
    }

    const zip = zipCodes[Math.floor(Math.random() * zipCodes.length)]['zipcode'];
    console.log(zip);

    const cfxUrl = `https://www.carfax.com/api/vehicles?zip=${zip}&radius=75&sort=BEST&yearMin=2015&dynamicRadius=false`;

    const cfxRes = await axios.get(cfxUrl);

    if (cfxRes.data.pageSize > 0) {
        // at least 1 vehicle found
        let vehicles = cfxRes.data.listings;
        const dealers = vehicles.map(vehicle => {
            return vehicle.dealer;
        });
        vehicles = vehicles.map(vehicle => {
            vehicle = {
                dealerId: vehicle.dealer.carfaxId,
                ...vehicle
            };
            return vehicle;
        });
        await Mongo.insertDocuments(db, 'demo_vehicles', vehicles);
        if (dealers.length > 0) {
            await Mongo.insertDocuments(db, 'demo_dealers', dealers);
        }
    }

    await delay(Math.floor(Math.random() * 3) + 3);

    init(db);
};

init();