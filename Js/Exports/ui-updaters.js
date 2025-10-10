const subTotalBalance = document.querySelector(".balance");
const totalBalance = document.getElementById("total-balance");
const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expenses");

const dailyEarnings = document.getElementById("daily-earning");
const dailySpending = document.getElementById("daily-spending");
const dailyNetProfit = document.getElementById("daily-net-profit");

const weeklyEarnings = document.getElementById("weekly-earning");
const weeklySpending = document.getElementById("weekly-spending");
const weeklyNetProfit = document.getElementById("weekly-net-profit");

const monthlyEarnings = document.getElementById("monthly-earning");
const monthlySpending = document.getElementById("monthly-spending");
const monthlyNetProfit = document.getElementById("monthly-net-profit");

export function updateTotals(balance, income, expense) {
  subTotalBalance.textContent = `Balance: $${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  totalBalance.textContent = `Total Balance: $${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  totalIncome.textContent = `Total Income: $${income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  totalExpense.textContent = `Total Expenses: $${expense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function renderTransactions(list, transaction) {
    let templateTransactions = "";
    list.map(transaction => {
      const type = transaction.type;
      let amount = ""
      if (type === "Income") {
        amount = `+ $${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}▴`;
      } else if (type === "Expense") {
        amount = `- $${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}▾`;
      }
      let hours = transaction.date.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutes = String(transaction.date.getMinutes()).padStart(2, '0');
      const date = transaction.date.toLocaleDateString()
      const time = hours + ":" + minutes + " " + ampm;
      const description = transaction.description || ""
      templateTransactions += `
        <li class="list-item">
          <div class="list-top">
            <span class="list-top-left">
              <span class="bold">${type}:</span> <span class="${type.toLowerCase()}">${amount}</span>
            </span> 
            <span class="transaction-date">${date}, ${time}</span>
          </div>
          <div class="list-bottom"><span><span class="bold">Category:</span> ${transaction.category}</span> <span class="description">${description}</span></div>
        </li>
      `;
    })
    transaction.innerHTML = templateTransactions;
}

export function getDailySummary(transactions) {
  const dailyEarning = transactions.reduce((amount, transaction) => {
    const transactionDate = transaction.date.toLocaleDateString();
    const date = new Date().toLocaleDateString();
    if (transactionDate === date) {
      if (transaction.type === "Income") {
        return amount + transaction.amount;
      }
    }
    return amount;
  }, 0);
  const dailyExpenses = transactions.reduce((amount, transaction) => {
    const transactionDate = transaction.date.toLocaleDateString();
    const date = new Date().toLocaleDateString();
    if (transactionDate === date) {
      if (transaction.type === "Expense") {
        return amount + transaction.amount;
      }
    }
    return amount;
  }, 0);
  const netProfit = dailyEarning - dailyExpenses;
  let net = `Net Profit: $${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (netProfit > 0) {
    net = `Net Profit: + $${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}▴`;
  } else if (netProfit < 0) {
    net = `Net Profit: - $${Math.abs(netProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}▾`;
  }
  dailyEarnings.textContent = `Daily Earnings: $${dailyEarning.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  dailySpending.textContent = `Daily Spending: $${dailyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  dailyNetProfit.textContent = net;
}

export function getWeeklySummary(date, transactions) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDays = Math.floor((date - startOfYear) / 86400000);
  const weekNumber = Math.ceil((pastDays + 1) / 7);

  const {income, expenses} = transactions.reduce((amount, transaction) => {
    const transactionDate = transaction.date;
    const transactionPastDays = Math.floor((transactionDate - startOfYear) / 86400000);
    const transactionWeekNumber = Math.ceil((transactionPastDays + 1) / 7);
    if (transactionWeekNumber === weekNumber) {
      if (transaction.type === "Income") {
        amount.income += transaction.amount;
      } else if (transaction.type === "Expense") {
        amount.expenses += transaction.amount;
      }
    }
    return amount
  }, {income: 0, expenses: 0})
  const netProfit = income - expenses;
  let net = `Net Profit: $${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (netProfit > 0) {
    net = `Net Profit: + $${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}▴`;
  } else if (netProfit < 0) {
    net = `Net Profit: - $${Math.abs(netProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}▾`;
  }
  weeklyEarnings.textContent = `Weekly Earnings: $${income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  weeklySpending.textContent = `Weekly Spending: $${expenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  weeklyNetProfit.textContent = net;
}

export function getMonthlySummary(transactions) {
  const date = new Date().getFullYear()
  const month = new Date().getMonth() + 1;
  const {income, expenses} = transactions.reduce((amount, transaction) => {
    const transactionDate = transaction.date;
    const transactionYear = transactionDate.getFullYear();
    const transactionMonth = transactionDate.getMonth() + 1
    if (transactionYear === date && transactionMonth === month) {
      if (transaction.type === "Income") {
        amount.income += transaction.amount;
      } else if (transaction.type === "Expense") {
        amount.expenses += transaction.amount;
      }
    }
    return amount
  }, {income: 0, expenses: 0})
  const netProfit = income - expenses;
  let net = `Net Profit: $${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (netProfit > 0) {
    net = `Net Profit: + $${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}▴`;
  } else if (netProfit < 0) {
    net = `Net Profit: - $${Math.abs(netProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}▾`;
  }
  monthlyEarnings.textContent = `Monthly Earnings: $${income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  monthlySpending.textContent = `Monthly Spending: $${expenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  monthlyNetProfit.textContent = net;
}