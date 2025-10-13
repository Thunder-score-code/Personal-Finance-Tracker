export function handleAddIncome(
    list, 
    income, 
    balance, 
    expense, 
    incomeAmountInput, 
    incomeDescriptionInput, 
    incomeCategory, 
    transactionList, 
    recentTransactions, 
    transactionSelect, 
    updateTotals,
    renderTransactions
) {
    if (incomeAmountInput.value < 0) {
        alert("Please enter a positive number.");
        return { income, balance, expense };
    }
    
    const addIncome = Number(incomeAmountInput.value) || 0;
    const description = incomeDescriptionInput.value || "";
    const category = incomeCategory.value || "";
    
    list.push({type: "Income", amount: addIncome, description: description, category: category, date: new Date()});
    income += addIncome;
    balance += addIncome;
    
    incomeAmountInput.value = "";
    incomeDescriptionInput.value = "";
    incomeCategory.value = "salary";
    
    updateTotals(balance, income, expense);
    renderTransactions([...list].reverse(), transactionList);
    renderTransactions([...list].reverse().slice(0,5), recentTransactions);
    transactionSelect.value = "latest";

    localStorage.setItem("transactions", JSON.stringify(list));

    return { income, balance, expense }; 
}

export function handleAddExpense(
    list, 
    income, 
    balance, 
    expense, 
    expenseAmountInput, 
    expenseDescriptionInput, 
    expenseCategory, 
    transactionList, 
    recentTransactions, 
    transactionSelect, 
    updateTotals,
    renderTransactions,
    getTotalsByCategory,
    createChart,
    ctx
) {
    if (expenseAmountInput.value <= 0) {
        alert("Please enter a positive number.");
        return { income, balance, expense };
    }
    if (Number(expenseAmountInput.value) > balance) {
        alert("Expense exceeds current balance.");
        return { income, balance, expense };
    }
    
    const addExpense = Number(expenseAmountInput.value) || 0;
    const description = expenseDescriptionInput.value || "";
    const category = expenseCategory.value || "";
    
    list.push({type: "Expense", amount: addExpense, description: description, category: category, date: new Date()});
    expense += addExpense;
    balance -= addExpense;
    
    expenseAmountInput.value = "";
    expenseDescriptionInput.value = "";
    expenseCategory.value = "housing";
    
    updateTotals(balance, income, expense);
    renderTransactions([...list].reverse(), transactionList);
    renderTransactions([...list].reverse().slice(0, 5), recentTransactions);
    
    const totals = getTotalsByCategory(list);
    createChart(
        ctx,
        totals.housingTotal, 
        totals.foodTotal, 
        totals.transportationTotal, 
        totals.entertainmentTotal,
        totals.utilitiesTotal, 
        totals.insuranceTotal, 
        totals.financialObligationTotal,
        totals.medicalTotal, 
        totals.businessTotal, 
        totals.othersTotal
    );
    transactionSelect.value = "latest";
    
    localStorage.setItem("transactions", JSON.stringify(list));
    
    return { income, balance, expense };
}