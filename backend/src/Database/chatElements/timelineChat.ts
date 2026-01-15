import mongoose from "mongoose";

const timelineChatSchema = new mongoose.Schema({
  userContent: { type: String, required: true },
  aiContent: { type: String, required: true },
}, { timestamps: true });

export const TimelineChatModel = mongoose.model("TimelineChat", timelineChatSchema);

export const getTimelineChat = async () => TimelineChatModel.find();
export const createTimelineChat = async (timelineChatData: { userContent: string; aiContent: string }) => {
  const chatElement = new TimelineChatModel(timelineChatData);
  return chatElement.save();
};
export const updateTimelineChat = (id: string, updateData: Partial<{ userContent: string; aiContent: string }>) => TimelineChatModel.findByIdAndUpdate(id, updateData, { new: true });
export const deleteTimelineChat = (id: string) => TimelineChatModel.findByIdAndDelete(id);