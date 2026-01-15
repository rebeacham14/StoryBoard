import mongoose from "mongoose";

const novelElementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: false },
  visible: { type: Boolean, required: true},
  title: { type: String, required: false },
  data: { type: String, required: false },
}, { timestamps: true });

export const NovelElementModel = mongoose.model("NovelElement", novelElementSchema);

export const getNovelElements = async () => NovelElementModel.find();
export const createNovelElement = async (novelElementData: { name: string; icon: string; visible: boolean; title?: string; data?: string }) => {
  const novelElement = new NovelElementModel(novelElementData);
  return novelElement.save();
};
export const updateNovelElement = (id: string, updateData: Partial<{ name: string; icon: string; visible: boolean; title?: string; data?: string }>) => NovelElementModel.findByIdAndUpdate(id, updateData, { new: true });
export const deleteNovelElement = (id: string) => NovelElementModel.findByIdAndDelete(id);