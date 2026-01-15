import mongoose from "mongoose";

const loreElementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: false },
  visible: { type: Boolean, required: true},
  title: { type: String, required: false },
  data: { type: String, required: false },
}, { timestamps: true });

export const LoreElementModel = mongoose.model("LoreElement", loreElementSchema);

export const getLoreElements = async () => LoreElementModel.find();
export const createLoreElement = async (loreElementData: { name: string; icon: string; visible: boolean; title?: string; data?: string }) => {
  const loreElement = new LoreElementModel(loreElementData);
  return loreElement.save();
};
export const updateLoreElement = (id: string, updateData: Partial<{ name: string; icon: string; visible: boolean; title?: string; data?: string }>) => LoreElementModel.findByIdAndUpdate(id, updateData, { new: true });
export const deleteLoreElement = (id: string) => LoreElementModel.findByIdAndDelete(id);