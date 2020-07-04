const { extend } = require('lodash');

const { join } = require('path');
let config = {
    viewDir : join(__dirname, '..', 'views'),
    staticDir: join(__dirname, '..', 'assets/back'),
};
if(process.env.NODE_ENV === "development"){
    let localConfig = {
        port: 8081,
        memoryFlag: false
    }
    config = extend(config, localConfig)
}
if(process.env.NODE_ENV === "production"){
    let proConfig = {
        port: 80,
        memoryFlag: "memory"
    }
    config = extend(config, proConfig)
}
module.exports = config;