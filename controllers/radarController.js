const { Droid } = require('../classes/droid');
const droid = new Droid();

exports.radarResponse = (req, res, next) => {
    try {
        const result = droid.processData(req.body);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}