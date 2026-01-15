import mongoose from "mongoose";

const screenplayChatSchema = new mongoose.Schema({
  userContent: { type: String, required: true },
  aiContent: { type: String, required: true },
}, { timestamps: true });

export const ScreenplayChatModel = mongoose.model("ScreenplayChat", screenplayChatSchema);

export const getScreenplayChat = async () => ScreenplayChatModel.find();
export const createScreenplayChat = async (screenplayChatData: { userContent: string; aiContent: string }) => {
  const chatElement = new ScreenplayChatModel(screenplayChatData);
  return chatElement.save();
};
export const updateScreenplayChat = (id: string, updateData: Partial<{ userContent: string; aiContent: string }>) => ScreenplayChatModel.findByIdAndUpdate(id, updateData, { new: true });
export const deleteScreenplayChat = (id: string) => ScreenplayChatModel.findByIdAndDelete(id);