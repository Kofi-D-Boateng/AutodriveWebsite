const checkout_button = $("#checkout_button")
checkout_button.on("click", () => {
    console.log("CONNECTED")
    fetch("/checkout/create-stripe-session", {
            method: "POST"
        }).then(({
            url
        }) => {
            console.log(ur)
            res.json(url)
            window.open(url)
        })
        .catch(e => {
            console.log(e.error)
        })

})