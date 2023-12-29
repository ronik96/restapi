import mongoose from "mongoose";
const refreshTokenschema  = new mongoose.Schema({
    token: { type: String, required: true },
  
}, { timestamps: true });
export default mongoose.model('refreshToken', refreshTokenschema);