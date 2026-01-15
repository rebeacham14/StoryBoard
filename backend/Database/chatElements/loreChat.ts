import mongoose from "mongoose";

const loreChatSchema = new mongoose.Schema({
  userContent: { type: String, required: true },
  aiContent: { type: String, required: true },
}, { timestamps: true });

export const LoreChatModel = mongoose.model("LoreChat", loreChatSchema);

export const getLoreChat = async () => LoreChatModel.find();
export const createLoreChat = async (loreChatData: { userContent: string; aiContent: string }) => {
  const chatElement = new LoreChatModel(loreChatData);
  return chatElement.save();
};
export const updateLoreChat = (id: string, updateData: Partial<{ userContent: string; aiContent: string }>) => LoreChatModel.findByIdAndUpdate(id, updateData, { new: true });
export const deleteLoreChat = (id: string) => LoreChatModel.findByIdAndDelete(id);