import mongoose from "mongoose";

const gameplayChatSchema = new mongoose.Schema({
  userContent: { type: String, required: true },
  aiContent: { type: String, required: true },
}, { timestamps: true });

export const GameplayChatModel = mongoose.model("GameplayChat", gameplayChatSchema);

export const getGameplayChat = async () => GameplayChatModel.find();
export const createGameplayChat = async (gameplayChatData: { userContent: string; aiContent: string }) => {
  const chatElement = new GameplayChatModel(gameplayChatData);
  return chatElement.save();
};
export const updateGameplayChat = (id: string, updateData: Partial<{ userContent: string; aiContent: string }>) => GameplayChatModel.findByIdAndUpdate(id, updateData, { new: true });
export const deleteGameplayChat = (id: string) => GameplayChatModel.findByIdAndDelete(id);