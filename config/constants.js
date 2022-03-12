require('dotenv').config();

exports.LIVE_MODE = process.env.LIVE_MODE === 'true';
exports.STEPS_TO_FOLLOW = parseInt(process.env.STEPS_TO_FOLLOW) || 9;
