const fs = require('fs');

function logMessage(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

function logError(error) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR: ${error}`);
}

module.exports = {
    logMessage,
    logError
};