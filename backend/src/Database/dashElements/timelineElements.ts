import mongoose from "mongoose";

const timelineElementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: false },
  visible: { type: Boolean, required: true},
  title: { type: String, required: false },
  data: { type: String, required: false },
}, { timestamps: true });

export const TimelineElementModel = mongoose.model("TimelineElement", timelineElementSchema);

export const getTimelineElements = async () => TimelineElementModel.find();
export const createTimelineElement = async (timelineElementData: { name: string; icon: string; visible: boolean; title?: string; data?: string }) => {
  const timelineElement = new TimelineElementModel(timelineElementData);
  return timelineElement.save();
};
export const updateTimelineElement = (id: string, updateData: Partial<{ name: string; icon: string; visible: boolean; title?: string; data?: string }>) => TimelineElementModel.findByIdAndUpdate(id, updateData, { new: true });
export const deleteTimelineElement = (id: string) => TimelineElementModel.findByIdAndDelete(id);