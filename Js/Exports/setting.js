export function resetWebsite() {
    localStorage.clear();
    window.location.reload()
}

export function setBalance() {
    let balanceInput = document.getElementById("balance-input");
    let setAmount = balanceInput.value;
    let amount = parseFloat(setAmount);
    document.getElementById("total-balance").textContent = `Total Balance: $${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    balanceInput.value = "";
}