require("dotenv").config()
const paypal = require("@paypal/checkout-server-sdk")
const {
    PayPalHttpClient
} = require("@paypal/checkout-server-sdk/lib/core/paypal_http_client")
const jwt = require("jsonwebtoken");
const User = require("../models/user");


const checkout_index = (req, res) => {
    const {
        token
    } = req.params;
    if (!token) {
        req.flash("error", "The link you clicked on is invalid.");
        res.redirect("/");
    } else {
        const secret = process.env.JWT_SECRET
        jwt.verify(token, secret, (err, decodedData) => {
            if (!err) {
                console.log(decodedData.length)
                const error = req.flash().error || [];
                res.render("checkout", {
                    token,
                    productOrder: decodedData["order"],
                    purchaseDuration: decodedData.duration,
                    purchaseAsset: decodedData.asset,
                    purchaseTotal: decodedData.price,
                    paypal: process.env.PAYPAL_CLIENT_ID
                });
            } else {
                res.send(
                    "There was an error with the link. Please request another one."
                );
            }
        });
    }
}

const create_payment = async (req, res) => {
    const Environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
    const paypalClient = new paypal.core.PayPalHttpClient(Environment)
    const request = new paypal.orders.OrdersCreateRequest()
    const total = req.body.purchaseTotal
    const order = req.body.productOrder
    console.log(req.body["headers"] + "\n")

    request.prefer("return=representation");
    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: total,
                breakdown: {
                    item_total: {
                        currency_code: 'USD',
                        value: total
                    }
                }
            },
            items: {
                name: order,
                unit_amount: {
                    currency_code: "USD",
                    value: total
                }
            }
        }]
    })
    try {
        const paypal_order = await paypalClient.execute(request)
        console.log(paypal_order)
    } catch (error) {
        res.status(500)
        console.log(error)
    }
}


module.exports = {
    checkout_index,
    create_payment
}