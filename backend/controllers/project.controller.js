import projectModel from '../models/project.model.js';
import * as projectService from '../services/project.service.js';
import { validationResult } from 'express-validator';
import userModel from '../models/user.model.js';

export const createProject = async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
    const { name } = req.body;
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const userId = loggedInUser._id;
    const newProject = await projectService.createProject({ name, userId });
    res.status(201).json(newProject);
    }catch(error){  
        console.log(error);
        
        res.status(400).json({ error: error.message });
    }
}

export const getAllProjects = async (req, res) => {
    try{
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const userId = loggedInUser._id;
    const projects = await projectService.getAllProjects(userId);
    return res.status(200).json(projects);
    }catch(error){
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}

export const addUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
    const { users, projectId } = req.body;
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const userId = loggedInUser._id;
    const updatedProject = await projectService.addUsersToProject({ users, userId, projectId });
    res.status(200).json(updatedProject);
    }catch(error){
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}

export const getProject = async (req, res) => {
    try {
        const projectId = req.params.projectId; 
        if (!projectId) {
            throw new Error("ProjectId is required");
        }
        const project = await projectService.getProject(projectId);
        return res.status(200).json(project);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};
