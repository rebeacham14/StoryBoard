import mongoose from "mongoose";

const dashElementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: false },
  visible: { type: Boolean, required: true},
  title: { type: String, required: false },
  data: { type: String, required: false },
}, { timestamps: true });

export const DashElementModel = mongoose.model("DashElement", dashElementSchema);

export const getDashElements = async () => DashElementModel.find();
export const createDashElement = async (dashElementData: { name: string; icon: string; visible: boolean; title?: string; data?: string }) => {
  const dashElement = new DashElementModel(dashElementData);
  return dashElement.save();
};
export const updateDashElement = (id: string, updateData: Partial<{ name: string; icon: string; visible: boolean; title?: string; data?: string }>) => DashElementModel.findByIdAndUpdate(id, updateData, { new: true });
export const deleteDashElement = (id: string) => DashElementModel.findByIdAndDelete(id);