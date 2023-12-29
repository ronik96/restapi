import Joi from "joi"
import user from "../../model/user.js";
import jwtservice from "../../service/jwtservice.js";
import bcrypt from 'bcrypt'
import { REFRESH_SECRET_KEY } from "../../config/index.js";
import refreshtoken from "../../model/refreshtoken.js";

const logincontroller = {
    async login(req, res, next) {
        const loginschema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        })

        const { error } = loginschema.validate(req.body);

        if (error) {
            return next(error);
        }
        //res.json({message:"this is  validation "})
        try {
            const finduser = await user.findOne({ email: req.body.email })
            if (!finduser) {
                return next(customerrorhandler.wrongcredentials("email is invalid"));
            }

            const match = await bcrypt.compare(req.body.password, finduser.password);

            if (!match) {
                return next(customerrorhandler.wrongcredentials("This password is not match"));
            }

            const access_token = jwtservice.sign({ _id: finduser._id, role: finduser.role })
            const refresh_token = jwtservice.sign({ _id: finduser._id, role: finduser.role }, '1y', REFRESH_SECRET_KEY)
            await refreshtoken.create({token:refresh_token})
            res.json({ access_token: access_token, refresh_token: refresh_token })
        } catch (error) {
            return next(error);
        }
    },


       async  logout(req, res, next) { 
             const refreshschema = Joi.object({
                 refresh_token: Joi.string().required()
             })

             const { error } = refreshschema.validate(req.body);
             if (error) {
                 return next(error);
             }
             try {
                await refreshtoken.deleteOne({token:req.body.refresh_token})
             } catch (error) {
                 return next(new Error());
           }
           res.json("user logout");
        }


}
export default logincontroller;
