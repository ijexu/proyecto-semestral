const { use } = require("react");

const form = document.getElementById("index-form");
const button = document.getElementById("index-form-button");

 form.addEventListener("input", function () {
    button.disabled = !form.checkValidity();
 })

 button.disabled = !form.checkValidity();

 // ---------------------------------------------------------
 
