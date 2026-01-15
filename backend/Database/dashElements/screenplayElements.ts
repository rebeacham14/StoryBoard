import mongoose from "mongoose";

const screenplayElementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: false },
  visible: { type: Boolean, required: true},
  title: { type: String, required: false },
  data: { type: String, required: false },
}, { timestamps: true });

export const ScreenplayElementModel = mongoose.model("ScreenplayElement", screenplayElementSchema);

export const getScreenplayElements = async () => ScreenplayElementModel.find();
export const createScreenplayElement = async (screenplayElementData: { name: string; icon: string; visible: boolean; title?: string; data?: string }) => {
  const screenplayElement = new ScreenplayElementModel(screenplayElementData);
  return screenplayElement.save();
};
export const updateScreenplayElement = (id: string, updateData: Partial<{ name: string; icon: string; visible: boolean; title?: string; data?: string }>) => ScreenplayElementModel.findByIdAndUpdate(id, updateData, { new: true });
export const deleteScreenplayElement = (id: string) => ScreenplayElementModel.findByIdAndDelete(id);