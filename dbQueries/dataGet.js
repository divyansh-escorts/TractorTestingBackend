const fetchModels = require('./fetchModels')

async function getTripData(date) {
    console.log(date);
    const Models = await fetchModels()
    return await Models.TripData.findAll({
        where: {date}
    })
}

module.exports={getTripData};