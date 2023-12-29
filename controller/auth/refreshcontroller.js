import Joi from "joi"
import refreshtoken from "../../model/refreshtoken.js";
import customerrorhandler from "../../service/customerrorhandler.js";
import jwtservice from "../../service/jwtservice.js";
import { REFRESH_SECRET_KEY } from "../../config/index.js";
import user from "../../model/user.js";

const refreshcontroller = {
    async refresh(req, res, next) {
        const refreshschema = Joi.object({
            refresh_token: Joi.string().required()
        })
        const { error } = refreshschema.validate(req.body)
        if (error) {
            return next(error);
        }

        try {

            const find_token = await refreshtoken.findOne({ token: req.body.refresh_token })

            // console.log(find_token)
            if (!find_token) {
                return next(customerrorhandler.unauthorized("invalid refresh token"))

            }

            let user_id;
            try {
                const { _id } = jwtservice.verify(find_token.token, REFRESH_SECRET_KEY)
                // console.log(_id);

                user_id = _id;
            } catch (error) {
                return next(customerrorhandler.unauthorized("invalid refresh token"))
            }

            //user find
            const find_user = await user.findOne({ _id: user_id });

            if (!find_user) {
                return next(customerrorhandler.notfound())
            }

            // token create

            const access_token = jwtservice.sign({ _id: find_user._id, role: find_user.role });
            const refresh_token = jwtservice.sign({ _id: find_user._id, role: find_user.role }, '1y', REFRESH_SECRET_KEY);

            res.json({ access_token: access_token, refresh_token: refresh_token })

        } catch (error) {
            return next(new Error('something went wrong' + error.message));
        }



    }
}
export default refreshcontroller