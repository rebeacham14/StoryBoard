import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

export const UserModel = mongoose.model("User", userSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email }); 
export const createUser = (userData: { name: string; email: string; password: string }) => {
  const user = new UserModel(userData);
  return user.save();
};
export const updateUser = (id: string, updateData: Partial<{ name: string; email: string; password: string }>) => UserModel.findByIdAndUpdate(id, updateData, { new: true });
export const deleteUser = (id: string) => UserModel.findByIdAndDelete(id);