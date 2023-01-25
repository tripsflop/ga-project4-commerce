const result = require("dotenv").config();
const express = require("express");
const Product = require("../models/product.js");
const checkout = express.Router();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const Order = require("../models/order");
const nodemailer = require("nodemailer");

// check dot env
if (result.error) {
  console.log(result.error);
}

checkout.post("/create", async (req, res) => {
  const lineItems = [];
  const cartItems = [];
  // retrive price from database, create line items for Stripe
  for (let item of req.body.cart) {
    const storeItem = await Product.findById(item._id);
    cartItems.push({
      name: storeItem._id,
      size: item.size,
      quantity: item.quantity,
    });
    lineItems.push({
      price_data: {
        currency: "sgd",
        product_data: {
          name: storeItem.shoeName,
          images: [storeItem.thumbnail],
          description: storeItem.colorway,
          metadata: {
            id: storeItem._id,
          },
        },
        unit_amount: storeItem.retailPrice * 100,
      },
      quantity: item.quantity,
    });
  }

  // stripe checkout
  try {
    const customer = await stripe.customers.create({
      metadata: {
        userId: req.body.user,
        cart: JSON.stringify(cartItems),
      },
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: { allowed_countries: ["SG"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "sgd" },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 1500, currency: "sgd" },
            display_name: "Express",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 1 },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      customer: customer.id,
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}/order`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    // update quantity in holding
    for (let item of req.body.cart) {
      let storeItem = await Product.findById(item._id);
      let itemSizes = storeItem.sizes;
      itemSizes[item.size] = itemSizes[item.size] - item.quantity;
      await Product.findByIdAndUpdate(item._id, {
        sizes: itemSizes,
      });
    }

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

let transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "limzk1994@hotmail.com",
    pass: process.env.EMAIL_PW,
  },
});

const sendReceipt = (email, url) => {
  let mailOptions = {
    from: "limzk1994@hotmail.com",
    to: email,
    subject: "Here's your Receipt.",
    text: url,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

// Create Order in database
const createOrder = async (customer, data) => {
  const Items = JSON.parse(customer.metadata.cart);
  console.log(Items);
  const newOrder = new Order({
    user: customer.metadata.userId,
    paymentIntent: data.payment_intent,
    products: JSON.parse(customer.metadata.cart),
    subtotal: data.amount_subtotal,
    total: data.amount_total,
    payment: data.payment_method_types,
    paymentStatus: data.payment_status,
    shippingDetails: data.shipping_details.address,
    isDeleted: false,
    refundInitiated: false,
  });

  try {
    const savedOrder = await newOrder.save();
    console.log(savedOrder);
  } catch (err) {
    console.log(err);
  }
};

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_LOCAL_CLI_WEBHOOK_SECRET;

checkout.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;
    let data;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("=======Webhook Event Constructed=======");
      data = event.data.object;
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      console.log(err.message);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        console.log(event.type);
        stripe.customers
          .retrieve(data.customer)
          .then((customer) => {
            createOrder(customer, data);
            // console.log(customer);
            // console.log("data:", data);
          })
          .catch((err) => console.log(err.message));
        break;
      case "payment_intent.succeeded":
        console.log(event.type);
        console.log(data);
        break;

      case "customer.updated":
        console.log(event.type);
        console.log(data);
        break;

      case "charge.succeeded":
        console.log(event.type);
        console.log(data);
        sendReceipt(data.receipt_email, data.receipt_url);
        break;

      case "payment_intent.created":
        console.log(event.type);
        console.log(data);
        break;

      case "charge.refunded":
        console.log(event.type);
        console.log(data);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

module.exports = checkout;
