import User from "../models/User.js";
import OpenAI from "openai";
//import  createChatCompletion  from "openai"
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user)
            return res.status(401).json({ message: "No such user" });
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
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant." }],
            model: "gpt-3.5-turbo",
        });
        user.chats.push(completion.choices[0].message);
        console.log(completion.choices[0]);
        await user.save();
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
    //const chatResponse = await openai.createChatCompletionRequest
    //({model:"gpt-3.5-turbo"})
};
//# sourceMappingURL=chat-controllers.js.map