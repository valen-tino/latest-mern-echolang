import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
    try {
        let token;
        if(req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token){
            return res.status(401).json({ message: "No token provided!" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            if(!user){
                return res.status(401).json({ message: 'User is not found in the system.' });
            }

            req.user = user;
            next();
        } catch(err){
            console.error("Token verification error: ", err);
            res.status(401).json({ message: 'Invalid authorization token' });
        }
    } catch(err){
        console.error("Auth Middleware went error: ", err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}