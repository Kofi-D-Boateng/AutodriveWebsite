paypal.Buttons({
    style: {
        layout: 'horizontal'
    },
    createOrder: () => {
        return fetch("/checkout/create-payment", {
            method: "POST",
        }).then(res => {
            if (res.ok) return console.log("MADE IT HERE IS ORDER")
            return res.json().then(json => Promise.reject(json))
        }).then(({
            order
        }) => {
            return order
        }).catch(e => {
            console.log(e.error)
        })
    },
    onApprove: async (data, actions) => {
        return actions.order.capture()
    }
}).render('#paypal-button-container')