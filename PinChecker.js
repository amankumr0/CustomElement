class CustomElement extends HTMLElement {
    constructor() {
        super();
        this.pinData = [];
        this.pinInput = this.querySelector("#pinInput");
        this.pinCheckBtn = this.querySelector("#pinButton");
        this.messageContainer = this.querySelector("#message");

        this.pinInput.addEventListener('click', this.clearInput.bind(this));

        this.pinInput.addEventListener('keypress', function (e) {
            if (e.which < 48 || e.which > 57 || e.target.value.length >= 6) {
                e.preventDefault();
            }
        })

        this.pinCheckBtn.addEventListener('click', this.validatePin.bind(this))
    }



    async validatePin() {
        const resp = await fetch("./data.json")
        const data = await resp.json();
        // console.log(data.deliveryLocations)
        this.pinData = data.deliveryLocations
        let temp = null;
        if (this.pinInput.value.length !== 6) {
            let errorMsg = '<span>Enter valid pincode</span>';
            this.messageContainer.innerHTML = errorMsg;
        }
        else {
            // console.log(this.pinData)
            this.pinData.map(data => {
                // console.log(data)
                // console.log(typeof data["pincode"])
                // console.log(typeof this.pinInput.value)
                if (data.pincode === this.pinInput.value) {
                    temp = data
                };
            })
            if (temp) {
                let today = new Date();
                let numberOfDaysToAdd = temp.estimatedDeliveryDays + 1;
                let result = today.setDate(today.getDate() + numberOfDaysToAdd);
                let estimatedDeliveryDate = new Date(result)
                this.messageContainer.innerHTML = `${estimatedDeliveryDate.toLocaleDateString('en-US', { weekday: "short" })}, ${estimatedDeliveryDate.getDate()} ${estimatedDeliveryDate.toLocaleString('en-us', { month: 'short' })}`
            } else {
                let errorMsg2 = '<span>This area is not in service</span>';
                this.messageContainer.innerHTML = errorMsg2;
            }
        }
    }

    clearInput() {
        this.pinInput.value = '';
        this.messageContainer.innerHTML = '';
    }
}

customElements.define("pin-check", CustomElement);