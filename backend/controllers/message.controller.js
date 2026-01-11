import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  const { gigId, receiverId, text } = req.body;

  const msg = await Message.create({
    gigId,
    senderId: req.user._id,
    receiverId,
    text,
  });

  res.status(201).json(msg);
};

export const getMessages = async (req, res) => {
  const { gigId, userId } = req.params;

  const messages = await Message.find({
    gigId,
    $or: [
      { senderId: req.user._id, receiverId: userId },
      { senderId: userId, receiverId: req.user._id },
    ],
  }).sort("createdAt");

  res.json(messages);
};
