import axios from "axios";
import express from "express";
import mongoose from 'mongoose';
import User from "../models/user.js"


export const getUsers = async (req, res) => { 
  try {
      const allUsers = await User.find();
              
      res.status(200).json(allUsers);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
}

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  await User.findByIdAndRemove(id);

  res.json({ message: "User deleted successfully." });
}





