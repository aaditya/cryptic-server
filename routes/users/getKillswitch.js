const Killswitch = require('../../models/killswitch');

const getSwitchController = async (req, res, next) => {
    try {
        let kill = await Killswitch.findOne({ role: 'main' });
        if (!kill) {
            return res.status(200).json({ "message": "Killswitch", data: null });
        }

        let { scheduledOn, activateOn } = kill;

        return res.status(200).json({ "message": "Killswitch", data: { scheduledOn, activateOn } });
    } catch (err) {
        next(err);
    }
}

module.exports = getSwitchController;