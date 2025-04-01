const makeModels = require('../models');

let models = 'Empty';

async function fetchModels() {
    if(models!='Empty') return models;
    models = await makeModels();
    return models;
}

module.exports = fetchModels;