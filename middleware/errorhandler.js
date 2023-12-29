import { DEBUG_MODE } from "../config/index.js";
import Joi from "joi";
import customerrorhandler from "../service/customerrorhandler.js";
const { ValidationError } = Joi

const errorhandler = (err, req, res, next) => {
    let stautscode = 500;
    let errordata = { message: "internal server error", ...(DEBUG_MODE === true && { originalError: err.message }) }
    if (err instanceof ValidationError) { stautscode = 422, errordata = { message: err.message } }
    if (err instanceof customerrorhandler) {
        stautscode = err.status;
        errordata = {
            message: err.message
        }
    }

    return res.status(stautscode).json(errordata);
}
export default errorhandler