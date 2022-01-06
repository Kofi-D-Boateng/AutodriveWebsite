require("dotenv").config()
const paypal = require("@paypal/checkout-server-sdk")
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

const create_paypal_payment = async (req, res) => {
    const Environment = new paypal.core.SandboxEnvironment()
    const paypalClient = new paypal.core.PayPalHttpClient(Environment)
    const request = new paypal.orders.OrdersCreateRequest()
    const secret = process.env.JWT_SECRET
    // Since user is already logged in you could just grab token off of req.user reducing queries to DB.
    const customer = await User.findOne({
        username: req.user.username
    })
    console.log(customer)
    const token = req.user.purchaseToken

    const decodedData = await jwt.verify(token, secret)
    console.log(decodedData)
    const order = decodedData.order.trim()
    const totalAmount = decodedData.price
    console.log(totalAmount)
    const number = totalAmount.substring(1, 9)
    console.log(number)
    const new_num = parseFloat(number)
    console.log(new_num)




    request.prefer("return=representation");
    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: 1033.33,
                breakdown: {
                    item_total: {
                        currency_code: 'USD',
                        value: 1033.33
                    },
                },
            },

        }]
    })
    try {
        const paypal_order = await paypalClient.execute(request)
        console.log(paypal_order)
        console.log(paypal_order.result.purchase_units)
        res.json({
            id: paypal_order.result.id
        })
    } catch (error) {
        res.status(500)
        console.log(error)
    }
}




const create_stripe_session = async (req, res) => {

    const stripe = require("stripe")(process.env.STRIPE_CREDENTIALS)
    const secret = process.env.JWT_SECRET
    const token = req.user.purchaseToken

    const decodedData = await jwt.verify(token, secret)
    console.log(decodedData)
    const order = decodedData.order.trim()
    console.log(order)
    const totalAmount = decodedData.price
    console.log(totalAmount)

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: 'USD',
                    product_data: {
                        name: order
                    },
                    unit_amount: 20000,
                },
                quantity: 1,
            }],
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}`,
            cancel_url: `${process.env.CLIENT_URL}/login`,
        })
        console.log(session.url)
        res.json({
            url: session.url
        })
    } catch (error) {
        res.status(500)
        console.log(error)
    }
}


module.exports = {
    checkout_index,
    create_paypal_payment,
    create_stripe_session
}