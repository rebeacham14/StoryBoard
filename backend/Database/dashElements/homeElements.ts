import mongoose from "mongoose";

const homeElementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: false },
  visible: { type: Boolean, required: true},
  title: { type: String, required: false },
  data: { type: String, required: false },
}, { timestamps: true });

export const HomeElementModel = mongoose.model("HomeElement", homeElementSchema);

export const getHomeElements = async () => HomeElementModel.find();
export const createHomeElement = async (homeElementData: { name: string; icon: string; visible: boolean; title?: string; data?: string }) => {
  const homeElement = new HomeElementModel(homeElementData);
  return homeElement.save();
};
export const updateHomeElement = (id: string, updateData: Partial<{ name: string; icon: string; visible: boolean; title?: string; data?: string }>) => HomeElementModel.findByIdAndUpdate(id, updateData, { new: true });
export const deleteHomeElement = (id: string) => HomeElementModel.findByIdAndDelete(id);