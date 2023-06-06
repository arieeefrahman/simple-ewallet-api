module.exports = (res, statusCode, statusMessage, message, data) => {
    return res.status(statusCode).json({
        status: statusMessage,
        message: message,
        data: data,
    });
}