require("dotenv").config()
const paypal = require("@paypal/checkout-server-sdk")
const {
    PayPalHttpClient
} = require("@paypal/checkout-server-sdk/lib/core/paypal_http_client")

const checkout_index = (req, res) => {
    res.render("checkout", {
        paypal: process.env.PAYPAL_CLIENT_ID
    })
}

const create_payment = async (req, res) => {
    const Environment = process.env.NODE_ENV === "production" ? paypal.core.LiveEnvironment : paypal.core.SandboxEnvironment
    const paypalClient = new paypal.core.PayPalHttpClient(new Environment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET))
    const request = new paypal.orders.OrdersCreateRequest()

    request.prefer("return=representation");
    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [{
            amount: {
                currency_code: ['USD', 'JPY'],
                value: total,
                breakdown: {
                    item_total: {
                        currency_code: ['USD', 'JPY'],
                        value: total
                    }
                }
            },
            // ADD STORE ITEMS HERE
        }]
    })
    try {
        const order = await paypalClient.execute(request)
    } catch (error) {

    }
}


module.exports = {
    checkout_index,
    create_payment
}