const Profile = require("./model");
const ProfileModel = new Profile();

exports.render = async (req, res) => {
    try {
        const information = await ProfileModel.getInformation(1);
        res.render("profile/views/profile", { layout: '/profile/views/profile-layout', information })
    } catch (err) {
        res.json(err.message);
    }
}