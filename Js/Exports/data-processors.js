export function filterTransactions(filter, filtered, transactions, transactionList, renderTransactions) {
  filtered = [...transactions];
  if (filter === "latest") {
    renderTransactions([...transactions].reverse(), transactionList)
  } else if (filter === "oldest") {
    renderTransactions([...transactions], transactionList)
  } else if (filter === "income") {
    filtered = filtered.filter(t => t.type === "Income")
    renderTransactions(filtered, transactionList);
  } else if (filter === "expense") {
    filtered = filtered.filter(t => t.type === "Expense")
    renderTransactions(filtered.reverse(), transactionList);
  } else if (filter === "amount-asc") {
    filtered =[...filtered].sort((a, b) => {
      if (a.amount > b.amount) {
        return 1;
      } else return -1
    });
    renderTransactions(filtered, transactionList);
  } else if (filter === "amount-desc") {
    filtered = [...filtered].sort((a, b) => {
      if (a.amount < b.amount) {
        return 1;
      } else return -1
    });
    renderTransactions(filtered, transactionList);
  }
}

export function getTotalsByCategory(transactions) {
    let housingTotal = 0;
    let foodTotal = 0;
    let transportationTotal = 0;
    let entertainmentTotal = 0;
    let utilitiesTotal = 0;
    let insuranceTotal = 0;
    let financialObligationTotal = 0;
    let medicalTotal = 0;
    let businessTotal = 0;
    let othersTotal = 0;
  transactions.forEach(transaction => {
    if(transaction.type === "Expense") {
      const amount = transaction.amount;
      switch (transaction.category) {
      case "housing":
        housingTotal += amount;
        break;
      case "food":
        foodTotal += amount;
        break;
      case "transportation":
        transportationTotal += amount;
        break;
      case "entertainment":
        entertainmentTotal += amount;
        break;
      case "utilities":
        utilitiesTotal += amount;
        break;
      case "insurance":
        insuranceTotal += amount;
        break;
      case "financial obligations":
        financialObligationTotal += amount;
        break;
      case "medical":
        medicalTotal += amount;
        break;
      case "business":
        businessTotal += amount;
        break;
      case "other":
        othersTotal += amount;
        break;
    }
    }
  })
  return {housingTotal, foodTotal, transportationTotal, entertainmentTotal, utilitiesTotal, insuranceTotal, financialObligationTotal, medicalTotal, businessTotal, othersTotal};
}

export function getLast6Months() {
  const currentDate = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    const monthName = date.toLocaleString('default', { month: 'short' });
    months.push({
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      label: `${monthName} ${date.getFullYear()}`
    });
  }
  return months;
}

export function calculateLast6MonthsData(transactions) {
  const monthsData = []
  const months = getLast6Months();
  for (let i = 0; i < months.length; i++) {
    const {income, expenses} = transactions.reduce((amount, transaction) => {
      const transactionDate = transaction.date;
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1;
      if (transactionYear === months[i].year && transactionMonth === months[i].month) {
        if (transaction.type === "Income") {
          amount.income += transaction.amount;
        } else if (transaction.type === "Expense") {
          amount.expenses += transaction.amount;
        }
      }
      return amount
    }, {income: 0, expenses: 0})
    const profit = income - expenses;
    monthsData.push({date: months[i], income: income, expenses: expenses, profit: profit});
  }
  return monthsData;
}

export function getDataForLast6Months(transactions, createIncomeVsExpensesChart, lineCtx, incomeTrendChart, trendCtx) {
  const monthsData = calculateLast6MonthsData(transactions);
  const [firstMonth, secondMonth, thirdMonth, fourthMonth, fifthMonth, currentMonth] = monthsData;
  createIncomeVsExpensesChart(lineCtx, firstMonth, secondMonth, thirdMonth, fourthMonth, fifthMonth, currentMonth);
  incomeTrendChart(trendCtx, firstMonth, secondMonth, thirdMonth, fourthMonth, fifthMonth, currentMonth);
}