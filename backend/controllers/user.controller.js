import userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";
export const createUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await userService.createUser(req.body);
        const token = await user.generateJWT();
        delete user._doc.password;
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).send(error.message);
    }
};


export const loginController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            throw new Error("User not found");
        }
        if (!(await user.isValidPassword(password))) {
            throw new Error("Invalid Password");
        }
        const token = await user.generateJWT();
        delete user._doc.password;
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const profileController = async (req, res) =>{
    console.log(req.user);
    res.status(200).json({user:req.user});
}

export const logoutController = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];
        redisClient.set(token, "logout", "EX", 60 * 60 * 24);
        res.status(200).send("Logged out successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const getAllUsersController = async (req, res) => {
    try {
        const loggedInUser = await userModel.findOne({ email: req.user.email });
        const users = await userService.getAllUsers({userId:loggedInUser._id});
        return res.status(200).json(users);
    } catch (error) {
        res.status(400).send(error.message);
    }
}