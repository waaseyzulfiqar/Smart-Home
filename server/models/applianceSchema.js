import mongoose from "mongoose";

const applianceSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    enum: ["fan", "light"],
  },
  state: {
    required: true,
    type: String,
    enum: ["on", "off"],
  },
});

const ApplianceModel = mongoose.model("appliance", applianceSchema);
export default ApplianceModel;
