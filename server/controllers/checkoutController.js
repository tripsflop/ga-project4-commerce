const result = require("dotenv").config();

const express = require("express");
const Product = require("../models/product.js");

const checkout = express.Router();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

// check dot env
if (result.error) {
  console.log(result.error);
}

checkout.post("/create", async (req, res) => {
  const lineItems = [];
  // retrive price from database, create line items for Stripe
  for (let item of req.body) {
    console.log(item);
    const storeItem = await Product.findById(item._id);
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
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}/order`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    // update quantity in holding
    for (let item of req.body) {
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

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_LOCAL_CLI_WEBHOOK_SECRET;

checkout.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("success");
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      console.log(err.message);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(paymentIntent);
        console.log(event.type);
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

module.exports = checkout;
