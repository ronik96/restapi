import user from "../model/user.js"
import customerrorhandler from "../service/customerrorhandler.js";

const admincontroller=async(req,res,next)=> {
    try {
        const userdata = await user.findOne({ _id: req.user._id })
        console.log(userdata)
        if (userdata.role == 'admin') {
            next();
        } else { 
            return next(customerrorhandler.unauthorized('user is not admin'));
        }
    } catch (error) {
        return next(customerrorhandler.unauthorized('not found'));
    }
}
export default admincontroller