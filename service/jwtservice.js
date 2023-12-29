import Jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/index.js";
class jwtservice {
    static sign(payload, expiry = "1d", secret = SECRET_KEY) {
        return Jwt.sign(payload, secret, { expiresIn: expiry })
    }
    static verify(payload, secret = SECRET_KEY) {
        return Jwt.verify(payload, secret,)
    }
}
export default jwtservice;