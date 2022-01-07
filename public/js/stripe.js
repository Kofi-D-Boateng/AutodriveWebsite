const checkout_button = $("#checkout_button")
checkout_button.on("click", async () => {
    fetch("/checkout/create-stripe-session", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        if (res.ok) {
            return res.json()
        }
    }).then(({
        url
    }) => {
        window.location = url
    }).catch(error => {
        console.log(error)
    })
})