import mongoose from "mongoose";

const homeChatSchema = new mongoose.Schema({
  userContent: { type: String, required: true },
  aiContent: { type: String, required: true },
}, { timestamps: true });

export const HomeChatModel = mongoose.model("HomeChat", homeChatSchema);

export const getHomeChat = async () => HomeChatModel.find();
export const createHomeChat = async (homeChatData: { userContent: string; aiContent: string }) => {
  const chatElement = new HomeChatModel(homeChatData);
  return chatElement.save();
};
export const updateHomeChat = (id: string, updateData: Partial<{ userContent: string; aiContent: string }>) => HomeChatModel.findByIdAndUpdate(id, updateData, { new: true });
export const deleteHomeChat = (id: string) => HomeChatModel.findByIdAndDelete(id);