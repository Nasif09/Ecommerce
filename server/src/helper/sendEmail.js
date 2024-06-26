const createHttpError = require("http-errors");

const emailWithNodeMailer = require("./email");

const sendEmail = async(emailData) => {
    try{
        await emailWithNodeMailer(emailData);
    }catch(error){
        throw createHttpError(500, 'Failed to send verification email');
    }
}
module.exports = sendEmail;