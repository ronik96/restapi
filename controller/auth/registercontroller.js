import Joi from "joi";
import User from "../../model/user.js"
import customerrorhandler from "../../service/customerrorhandler.js";
import bcrypt from "bcrypt";
import jwtservice from "../../service/jwtservice.js";
import { REFRESH_SECRET_KEY } from "../../config/index.js";
const registercontroller = {
    async register(req, res, next) {
        const registerSchema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref("password"),
            role: Joi.string().default("customer")

        })

        const { error } = registerSchema.validate(req.body)
        if (error) {
            return next(error);
        }

        const { name, password, email, role } = req.body;

        const hashpassword = await bcrypt.hash(password, 10)
        const userdata = await new User({ name, password: hashpassword, email, role });

        let access_token, refresh_token;
        try {
            const exist = await User.exists({ email: req.body.email })
            if (exist) {
                return next(customerrorhandler.alreadyexist("email is alredy exist"));
            }
            const finaldata = await userdata.save()
            // console.log(finaldata);

            access_token = jwtservice.sign({ _id: finaldata._id, role: finaldata.role })
            refresh_token = jwtservice.sign({ _id: finaldata._id, role: finaldata.role }, '1y', REFRESH_SECRET_KEY)
        } catch (err) {
            return next(err);
        }
        res.json({ access_token: access_token, refresh_token: refresh_token });
    }


}
export default registercontroller;