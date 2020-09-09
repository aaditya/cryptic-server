const Killswitch = require('../../models/killswitch');

const setSwitchController = async (req, res, next) => {
    try {
        let { activateOn, scheduledOn } = req.body;

        let kill = await Killswitch.findOne({ role: 'main' });
        if (!kill) {
          if (!activateOn) activateOn = new Date();
          if (!scheduledOn) scheduledOn = new Date();
            await new Killswitch({ role: 'main', activateOn: new Date(activateOn), scheduledOn: new Date(scheduledOn) }).save();
        } else {
          if (!activateOn) activateOn = kill.activateOn;
          if (!scheduledOn) scheduledOn = kill.scheduledOn;  
          await Killswitch.findOneAndUpdate({ role: 'main' }, { $set: { activateOn: new Date(activateOn), scheduledOn: new Date(scheduledOn) } });
        }

        return res.status(200).json({ "message": "Killswitch Set" });
    } catch (err) {
        next(err);
    }
}

module.exports = setSwitchController;