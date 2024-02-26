//import Chat from "../models/User.js";
import { NextFunction, Request, Response } from "express";
import { chatCompletionValidators } from "../utils/validators.js";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
//import { createToken } from "../utils/token-manager.js";
//import { COOKIE_NAME } from "../utils/constants.js";
//import { hash, compare } from "bcrypt";
//import Configuration from "openai";
import OpenAI from "openai";
//import  createChatCompletion  from "openai"

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
  if (!user) return res.status(401).json({ message: "No such user" });
  const chats = user.chats.map(({ role, content }) => ({ role, content }));
  chats.push({ content: message, role: "user" });
  user.chats.push({ content: message, role: "user" });

  //const config = configureOpenAI();
  //   const config = new Configuration({
  //     apiKey: process.env.OPENAI_API_SECRET,
  //     organization: process.env.OPEN_AI_ORG
  // })

  //const openai = new OpenAI();
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_SECRET,
    organization: process.env.OPEN_AI_ORG,
  });
  const chatResponse = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });
  user.chats.push(chatResponse.choices[0].message);
  console.log(chatResponse.choices[0]);
  await user.save();
  return res.status(200).json({chats: user.chats});
    
  } catch (error) {
    console.log(error);
    res.status(500).json({message: error.message});
  }
  
  //const chatResponse = await openai.createChatCompletionRequest
  //({model:"gpt-3.5-turbo"})
};
