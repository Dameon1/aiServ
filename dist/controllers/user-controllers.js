import User from "../models/User.js";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
import { hash, compare } from "bcrypt";
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        console.log(users);
        return res
            .status(200)
            .json({ message: "Not OK", something: "something", users });
    }
    catch (err) {
        console.log(err);
        return res.status(200).json({ message: "Error", cause: err.message });
    }
    //get all users
};
export const userSignUp = async (req, res, next) => {
    try {
        //user sign up
        console.log(req.body);
        const { name, email, password } = req.body;
        const previousUser = await User.findOne({ email });
        console.log(previousUser);
        if (previousUser) {
            return res.status(401).send("User already exists");
        }
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.clearCookie(COOKIE_NAME, {
            path: "/",
            httpOnly: true,
            domain: "localhost",
            signed: true,
        });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });
        return res.status(201).json({ message: "Not OK", id: user._id.toString() });
    }
    catch (err) {
        console.log(err);
        return res.status(200).json({ message: "Error", cause: err.message });
    }
};
export const userLogin = async (req, res, next) => {
    try {
        //user Login
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User not registered");
        }
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).send("Password is not valid");
        }
        res.clearCookie(COOKIE_NAME, {
            path: "/",
            httpOnly: true,
            domain: "localhost",
            signed: true,
        });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
            path: "/",
            domain: "localhost",
            expires,
            httpOnly: true,
            signed: true,
        });
        return res.status(200).json({ message: "OK", name: user.name, email: user.email });
    }
    catch (err) {
        return res.status(200).json({ message: "Error", cause: err.message });
    }
};
export const verifyUser = async (req, res, next) => {
    try {
        //verify user
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered Or Token Malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        return res.status(200).json({ message: "OK", id: user._id.toString() });
    }
    catch (err) {
        console.log(err);
        return res.status(200).json({ message: "Error", cause: err.message });
    }
};
//# sourceMappingURL=user-controllers.js.map