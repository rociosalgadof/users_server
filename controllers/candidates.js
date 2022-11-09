import axios from "axios";
import express from "express";
import mongoose from 'mongoose';
import Candidate from "../models/candidate.js";


export const getCandidates = async (req, res) => { 
  try {
      const allCandidates = await Candidate.find();
              
      res.status(200).json(allCandidates);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
}

export const deleteCandidate = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No candidate with id: ${id}`);

  await Candidate.findByIdAndRemove(id);

  res.json({ message: "Candidate deleted successfully." })}