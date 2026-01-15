import mongoose from "mongoose";

const gameplayElementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: false },
  visible: { type: Boolean, required: true},
  title: { type: String, required: false },
  data: { type: String, required: false },
}, { timestamps: true });

export const GameplayElementModel = mongoose.model("GameplayElement", gameplayElementSchema);

export const getGameplayElements = async () => GameplayElementModel.find();
export const createGameplayElement = async (gameplayElementData: { name: string; icon: string; visible: boolean; title?: string; data?: string }) => {
  const gameplayElement = new GameplayElementModel(gameplayElementData);
  return gameplayElement.save();
};
export const updateGameplayElement = (id: string, updateData: Partial<{ name: string; icon: string; visible: boolean; title?: string; data?: string }>) => GameplayElementModel.findByIdAndUpdate(id, updateData, { new: true });
export const deleteGameplayElement = (id: string) => GameplayElementModel.findByIdAndDelete(id);