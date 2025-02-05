import mongoose from "mongoose"

const InviteSchema = new mongoose.Schema({
  senderName: String,
  senderEmail: String,
  recipientName: String,
  recipientEmail: { type: String, required: false },
  message: String,
  isAnonymous: Boolean,
  theme: String,
  gif: String,
  poem: String,
  link: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  responses: { type: [String], default: [] },
  respondedBy: { type: [String], default: [] },
  views: { type: Number, default: 0 },
  emailSent: { type: Boolean, default: false },
})

export default mongoose.models.Invite || mongoose.model("Invite", InviteSchema)