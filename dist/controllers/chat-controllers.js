import User from "../models/User.js";
//import { OpenAIApi, ChatCompletionRequestMessage } from "openai";
import OpenAI from "openai";
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        console.log("Test");
        if (!user)
            return res.status(401).json({ message: "No such user" });
        const chats = user.chats.map(({ role, content }) => ({ role, content }));
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });
        console.log("checking");
        const openai = new OpenAI({
            apiKey: process.env.OPEN_AI_SECRET,
            organization: process.env.OPEN_AI_ORG,
        });
        const chatResponse = await openai.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "gpt-3.5-turbo",
        });
        console.log("response:", chatResponse);
        user.chats.push(chatResponse.choices[0].message);
        console.log(chatResponse.choices[0]);
        await user.save();
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
export const sendChatsToUser = async (req, res, next) => {
    try {
        //user token check
        console.log(res.locals.jwtData.id);
        const user = await User.findById(res.locals.jwtData.id);
        console.log("user:", user);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        return res.status(200).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const deleteChats = async (req, res, next) => {
    try {
        //user token check
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({ message: "OK" });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
//import Chat from "../models/User.js";
//import { NextFunction, Request, Response } from "express";
//import { chatCompletionValidator } from "../utils/validators.js";
//import User from "../models/User.js";
//import { configureOpenAI } from "../config/openai-config.js";
//import { createToken } from "../utils/token-manager.js";
//import { COOKIE_NAME } from "../utils/constants.js";
//import { hash, compare } from "bcrypt";
//import Configuration from "openai";
//import OpenAI from "openai";
//import  createChatCompletion  from "openai"
// export const generateChatCompletion = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { message } = req.body;
//   try {
//     const user = await User.findById(res.locals.jwtData.id);
//     console.log("Test");
//     if (!user) return res.status(401).json({ message: "No such user" });
//     const chats = user.chats.map(({ role, content }) => ({ role, content }));
//     chats.push({ content: message, role: "user" });
//     user.chats.push({ content: message, role: "user" });
//     console.log("checking");
//     const openai = new OpenAI({
//        apiKey: process.env.OPEN_AI_SECRET,
//       organization: process.env.OPEN_AI_ORG,
//     });
//     const chatResponse = await openai.chat.completions.create({
//       messages: [{ role: "user", content: message }],
//       model: "gpt-3.5-turbo",
//     });
//     console.log("response:", chatResponse)
//     user.chats.push(chatResponse.choices[0].message);
//     console.log(chatResponse.choices[0]);
//     await user.save();
//     return res.status(200).json({ chats: user.chats });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// };
// export const sendChatsToUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     //user token check
//     console.log("ID: ",res.locals.jwtData.id)
//     const user = await User.findById(res.locals.jwtData.id);
//     if (!user) {
//       return res.status(401).send("User not registered OR Token malfunctioned");
//     }
//     if (user._id.toString() !== res.locals.jwtData.id) {
//       return res.status(401).send("Permissions didn't match");
//     }
//     return res.status(200).json({ message: "OK", chats: user.chats });
//   } catch (error) {
//     console.log(error);
//     return res.status(200).json({ message: "ERROR", cause: error.message });
//   }
// };
//# sourceMappingURL=chat-controllers.js.map