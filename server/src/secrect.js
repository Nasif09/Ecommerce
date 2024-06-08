require('dotenv').config();

const serverPort = process.env.SERVER_PORT || 3002;
const mongodbURL = process.env.MONGODB_ATLAS_URL;

const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH || 'public/images/users/noavatar.png';

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || 'NASIFURRAHMANDEV';
const jwtAccessKey = process.env.JWT_ACCESS_KEY || 'ACCESSNASIFURRAHMANDEV';
const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY || 'ACCESSNASIFURRAHMANDEV';

const smtpUsername = process.env.SMTP_USERNAME || '';
const smtpPassword = process.env.SMTP_PASSWORD || '';

const clientURL = process.env.CLIENT_URL ;

module.exports = { 
    serverPort, 
    mongodbURL, 
    defaultImagePath, 
    jwtActivationKey, 
    jwtResetPasswordKey,
    smtpUsername, 
    smtpPassword, 
    clientURL, 
    jwtAccessKey }