import customerrorhandler from "../service/customerrorhandler.js";
import jwtservice from "../service/jwtservice.js";

const userauth = async (req, res, next) => {
    let headerAuth = req.headers.authorization;
    // console.log(headerAuth);
    if (!headerAuth) {
        return next(customerrorhandler.unauthorized("user is unauthorized... !"))
    }

    try {
        const token = headerAuth.split(' ')[1];
         console.log(token);

        // token verify
        const { _id, role } = await jwtservice.verify(token);
        const user = {
            _id, role
        }
         console.log(user);
        req.user = user;
        next()
    } catch (error) {
        return next(customerrorhandler.notfound('invalid token'));
    }
}
export default userauth;