const form = document.querySelector("form");
const itemName = document.querySelector("#name");
const cost = document.querySelector("#cost");
const error = document.querySelector("#error");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const parsedCost = isNaN(parseInt(cost.value))
    ? "error"
    : parseInt(cost.value);
  if (itemName.value && parsedCost !== "error") {
    const item = {
      name: itemName.value,
      cost: parsedCost,
    };
    db.collection("expenses")
      .add(item)
      .then((_) => {
        form.reset();
        error.innerText = "";
      });
  } else {
    error.innerText = `Please fill in ${
      itemName.value ? "valid cost" : "all the values "
    }`;
  }
});
