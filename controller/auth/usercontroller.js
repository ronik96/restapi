import User from "../../model/user.js"
import customerrorhandler from "../../service/customerrorhandler.js"


const usercontroller = {
    async me(req, res, next) {
        try {
            const user = await User.findOne({ _id: req.user._id }).select("-password -createAt -updatedAt -__v");
            console.log(user);
            if (!user) {
                return next(customerrorhandler.notfound());
            }
            res.json(user);
        } catch (error) {
            return next(error)
        }
    }
}
export default usercontroller;