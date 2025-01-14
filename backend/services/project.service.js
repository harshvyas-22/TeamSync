import { isValidObjectId } from "mongoose";
import projectModel from "../models/project.model.js";

export const createProject = async ({ name, userId }) => {
  if (!name) {
    throw new Error("Name is required");
  }
  if (!userId) {
    throw new Error("User is required");
  }
  let project;
  try {
    project = await projectModel.create({
      name,
      users: [userId],
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Project name already exists");
    }
    throw error;
  }
  return project;
};

export const getAllProjects = async (userId) => {
  if (!userId) {
    throw new Error("UserId is required");
  }
  const projects = await projectModel.find({ users: userId });
  return projects;
};

export const addUsersToProject = async ({ users, userId, projectId }) => {
  if (!projectId) {
    throw new Error("ProjectId is required");
  }
  if (!isValidObjectId(projectId)) {
    throw new Error("ProjectId is invalid");
  }
  if (!users) {
    throw new Error("Users are required");
  }
  if (
    !Array.isArray(users) ||
    users.some((userId) => !isValidObjectId(userId))
  ) {
    throw new Error("Users must be an array");
  }
  if(!userId){
    throw new Error("UserId is required");
  }
  if(!isValidObjectId(userId)){
    throw new Error("UserId is invalid");
  }
const project = await projectModel.findOne({ _id: projectId , users: userId });
if(!project){
  throw new Error("User is not authorized to add users to this project"); 

}
 const updatedProject = await projectModel.findOneAndUpdate({
    _id: projectId,
     },
    {
      $addToSet: { users: { $each: users } },
    },
    { new: true });
return updatedProject;
};

export const getProject = async (projectId) => {
  if (!projectId) {
    throw new Error("ProjectId is required");
  }
  if (!isValidObjectId(projectId)) {
    throw new Error("ProjectId is invalid");
  }
  const project = await projectModel.findOne({ _id: projectId }).populate("users");
  if (!project) {
    throw new Error("Project not found");
  }
  return project;
};
