const Killswitch = require('../../models/killswitch');

const setSwitchController = async (req, res, next) => {
    try {
        let { date } = req.body;

        let kill = await Killswitch.findOne({ role: 'main' });
        if (!kill) {
            await new Killswitch({ role: 'main', activateOn: new Date(date) }).save();
        } else {
            await Killswitch.findOneAndUpdate({ role: 'main' }, { $set: { activateOn: new Date(date) } });
        }

        return res.status(200).json({ "message": "Killswitch Set" });
    } catch (err) {
        next(err);
    }
}

module.exports = setSwitchController;