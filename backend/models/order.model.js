const mongoose = require("mongoose");

 
const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    items: [
      {
        item :  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
        },
        qty: { type: Number , required: true }
      }
    ],
    phone: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, default: "Đặt hàng thành công" },
    totalQty: { type: Number, default:1 },
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", orderSchema);
