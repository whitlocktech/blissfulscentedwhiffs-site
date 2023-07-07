const mongoose = require('mongoose')

const ordersSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  orders: [
    {
      orderId: {
        type: String,
      },
      ref: {
        type: String,
      },
      total: {
        type: Number,
      },
      totalPaid: {
        type: Number,
      },
      orderDate: {
        type: Date,
      },
      shipped: {
        type: Boolean,
      },
      expectedDeliveryDate: {
        type: Date,
      },
      shippingMethod: {
        type: String,
      },
      trackingNumber: {
        type: String,
      },
      trackingUrl: {
        type: String,
      },
      items: [
        {
          dolibarrId: {
            type: String,
            required: true,
          },
          productRef: {
            type: String,
          },
          productName: {
            type: String,
          },
          quantity: {
            type: Number,
          },
          unitPrice: {
            type: Number,
          },
        }
      ],
    }
  ]
})

const Orders = mongoose.model('Orders', ordersSchema)