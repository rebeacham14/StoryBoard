import mongoose from "mongoose";

const novelChatSchema = new mongoose.Schema({
  userContent: { type: String, required: true },
  aiContent: { type: String, required: true },
}, { timestamps: true });

export const NovelChatModel = mongoose.model("NovelChat", novelChatSchema);

export const getNovelChat = async () => NovelChatModel.find();
export const createNovelChat = async (novelChatData: { userContent: string; aiContent: string }) => {
  const chatElement = new NovelChatModel(novelChatData);
  return chatElement.save();
};
export const updateNovelChat = (id: string, updateData: Partial<{ userContent: string; aiContent: string }>) => NovelChatModel.findByIdAndUpdate(id, updateData, { new: true });
export const deleteNovelChat = (id: string) => NovelChatModel.findByIdAndDelete(id);