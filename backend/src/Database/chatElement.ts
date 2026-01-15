import mongoose from "mongoose";



// const userSchema = new Schema<IUser>({
//   name: { type: String, required: true },
//   role: {
//     type: String,
//     enum: Object.values(UserRole), // Use Object.values to get an array of 'admin', 'user', 'guest'
//     required: true,
//   },



const chatElementSchema = new mongoose.Schema({
  userContent: { type: String, required: true },
  aiContent: { type: String, required: true },
}, { timestamps: true });

export const ChatElementModel = mongoose.model("ChatElement", chatElementSchema);

export const getChatElements = async () => ChatElementModel.find();
export const createChatElement = async (chatElementData: { userContent: string; aiContent: string }) => {
  const chatElement = new ChatElementModel(chatElementData);
  return chatElement.save();
};
export const updateChatElement = (id: string, updateData: Partial<{ userContent: string; aiContent: string }>) => ChatElementModel.findByIdAndUpdate(id, updateData, { new: true });
export const deleteChatElement = (id: string) => ChatElementModel.findByIdAndDelete(id);