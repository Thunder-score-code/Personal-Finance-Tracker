import { showSection, blockNonNumericInput } from './Exports/background-runners.js';
import { createChart, createIncomeVsExpensesChart, incomeTrendChart } from './Exports/create-charts.js';



const dashboardBtn = document.getElementById("dashboard-btn");
const transactionsBtn = document.getElementById("transactions-btn");
const statisticsBtn = document.getElementById("statistics-btn");

const subTotalBalance = document.querySelector(".balance");

const ctx = document.getElementById('pie-chart').getContext('2d');
const lineCtx = document.getElementById('line-chart').getContext('2d');
const trendCtx = document.getElementById('line-chart-trend').getContext('2d')

const addIncomeBtn = document.getElementById("income-button");
const incomeAmountInput = document.getElementById("income-amount");
const incomeDescriptionInput = document.getElementById("income-description");
const incomeCategory = document.getElementById("income-category");

const addExpenseBtn = document.getElementById("expense-button");
const expenseAmountInput = document.getElementById("expense-amount");
const expenseDescriptionInput = document.getElementById("expense-description");
const expenseCategory = document.getElementById("expense-category");

const transactionList = document.getElementById("transaction-list");
const transactionSelect = document.getElementById("transaction-filter");
const recentTransactions = document.getElementById("recent-transactions-list");

const dailyEarnings = document.getElementById("daily-earning");
const dailySpending = document.getElementById("daily-spending");
const dailyNetProfit = document.getElementById("daily-net-profit");

const weeklyEarnings = document.getElementById("weekly-earning");
const weeklySpending = document.getElementById("weekly-spending");
const weeklyNetProfit = document.getElementById("weekly-net-profit");

const monthlyEarnings = document.getElementById("monthly-earning");
const monthlySpending = document.getElementById("monthly-spending");
const monthlyNetProfit = document.getElementById("monthly-net-profit");

let totalBalance = document.getElementById("total-balance");
let totalIncome = document.getElementById("total-income");
let totalExpense = document.getElementById("total-expenses");

let amount = 0;
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

dashboardBtn.addEventListener("click", () => showSection("dashboard"));
transactionsBtn.addEventListener("click", () => showSection("transaction-section"));
statisticsBtn.addEventListener("click", () => showSection("statistics"));
createChart(
  ctx,
  housingTotal, foodTotal, transportationTotal, entertainmentTotal,
  utilitiesTotal, insuranceTotal, financialObligationTotal,
  medicalTotal, businessTotal, othersTotal
);

incomeAmountInput.addEventListener("keydown", blockNonNumericInput);
incomeAmountInput.addEventListener('input', function (e) {
    if (e.target.value.length > 7) {
        e.target.value = e.target.value.slice(0, 7);
    }
});
expenseAmountInput.addEventListener("keydown", blockNonNumericInput);
expenseAmountInput.addEventListener('input', function (e) {
    if (e.target.value.length > 7) {
        e.target.value = e.target.value.slice(0, 7);
    }
});

transactionSelect.addEventListener("change", () => {
  const filter = transactionSelect.value;
  filterTransactions(filter);
});

const transactions = [];
let filtered = [];
let balance = 0;
let income = 0;
let expense = 0;

showSection("dashboard")

addIncomeBtn.addEventListener("click", () => {
    if (incomeAmountInput.value <= 0) {
        alert("Please enter a positive number.");
        return;
    }
    const addIncome = Number(incomeAmountInput.value) || 0
    const description = incomeDescriptionInput.value || ""
    const category = incomeCategory.value || ""
    transactions.push({type: "Income", amount: addIncome, description: description, category: category, date: new Date()})
    income += addIncome
    balance += addIncome
    incomeAmountInput.value = ""
    incomeDescriptionInput.value = ""
    incomeCategory.value = "salary"
    updateTotals()
    renderTransactions([...transactions].reverse(), transactionList)
    renderTransactions([...transactions].reverse().slice(0,5), recentTransactions)
    transactionSelect.value = "latest"
})

addExpenseBtn.addEventListener("click", () => {
      if (expenseAmountInput.value <= 0) {
        alert("Please enter a positive number.");
        return;
    }
      if (Number(expenseAmountInput.value) > balance) {
        alert("Expense exceeds current balance.");
        return;
    }
    const addExpense = Number(expenseAmountInput.value) || 0
    const description = expenseDescriptionInput.value || ""
    const category = expenseCategory.value || ""
    transactions.push({type: "Expense", amount: addExpense, description: description, category: category, date: new Date()})
    expense += addExpense
    balance -= addExpense
    expenseAmountInput.value = ""
    expenseDescriptionInput.value = ""
    expenseCategory.value = "housing"
    updateTotals()
    renderTransactions([...transactions].reverse(), transactionList)
    renderTransactions([...transactions].reverse().slice(0, 5), recentTransactions)
    getTotalsByCategory()
    createChart(
      ctx,
      housingTotal, foodTotal, transportationTotal, entertainmentTotal,
      utilitiesTotal, insuranceTotal, financialObligationTotal,
      medicalTotal, businessTotal, othersTotal
    )
    transactionSelect.value = "latest"
})

function updateTotals() {
  subTotalBalance.textContent = `Balance: $${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  totalBalance.textContent = `Total Balance: $${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  totalIncome.textContent = `Total Income: $${income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  totalExpense.textContent = `Total Expenses: $${expense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function renderTransactions(list, transaction) {
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

function getTotalsByCategory() {
  housingTotal = 0;
  foodTotal = 0;
  transportationTotal = 0;
  entertainmentTotal = 0;
  utilitiesTotal = 0;
  insuranceTotal = 0;
  financialObligationTotal = 0;
  medicalTotal = 0;
  businessTotal = 0;
  othersTotal = 0;
  transactions.forEach(transaction => {
    if(transaction.type === "Expense") {
      amount = transaction.amount;
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
  });
}

function filterTransactions(filter) {
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

function getDailySummary() {
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

function getWeeklySummary(date) {
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

function getMonthlySummary() {
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

function getLast6Months() {
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

function calculateLast6MonthsData() {
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

function getDataForLast6Months() {
  const monthsData = calculateLast6MonthsData();
  const [firstMonth, secondMonth, thirdMonth, fourthMonth, fifthMonth, currentMonth] = monthsData;
  createIncomeVsExpensesChart(lineCtx, firstMonth, secondMonth, thirdMonth, fourthMonth, fifthMonth, currentMonth);
  incomeTrendChart(trendCtx, firstMonth, secondMonth, thirdMonth, fourthMonth, fifthMonth, currentMonth);
}

statisticsBtn.addEventListener("click", getDailySummary);
statisticsBtn.addEventListener("click", () => getWeeklySummary(new Date()));
statisticsBtn.addEventListener("click", getMonthlySummary);
statisticsBtn.addEventListener("click", getDataForLast6Months);
