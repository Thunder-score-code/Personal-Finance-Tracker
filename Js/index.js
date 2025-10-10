import { showSection, blockNonNumericInput } from './Exports/background-runners.js';
import { createChart, createIncomeVsExpensesChart, incomeTrendChart } from './Exports/create-charts.js';
import { updateTotals, renderTransactions, getDailySummary, getWeeklySummary, getMonthlySummary } from './Exports/ui-updaters.js';
import { filterTransactions, getTotalsByCategory, getDataForLast6Months } from './Exports/data-processors.js';

const dashboardBtn = document.getElementById("dashboard-btn");
const transactionsBtn = document.getElementById("transactions-btn");
const statisticsBtn = document.getElementById("statistics-btn");

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
createChart(ctx, housingTotal, foodTotal, transportationTotal, entertainmentTotal, utilitiesTotal, insuranceTotal, financialObligationTotal, medicalTotal, businessTotal, othersTotal);

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
  filterTransactions(filter, filtered, transactions, transactionList, renderTransactions);
});

const transactions = [];
let filtered = [];
let balance = 0;
let income = 0;
let expense = 0;

showSection("dashboard")

addIncomeBtn.addEventListener("click", () => {
    if (incomeAmountInput.value < 0) {
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
    updateTotals(balance, income, expense)
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
    updateTotals(balance, income, expense)
    renderTransactions([...transactions].reverse(), transactionList)
    renderTransactions([...transactions].reverse().slice(0, 5), recentTransactions)
    const totals = getTotalsByCategory(transactions);
    housingTotal = totals.housingTotal;
    foodTotal = totals.foodTotal;
    transportationTotal = totals.transportationTotal;
    entertainmentTotal = totals.entertainmentTotal;
    utilitiesTotal = totals.utilitiesTotal;
    insuranceTotal = totals.insuranceTotal;
    financialObligationTotal = totals.financialObligationTotal;
    medicalTotal = totals.medicalTotal;
    businessTotal = totals.businessTotal;
    othersTotal = totals.othersTotal;
    createChart(
      ctx,
      housingTotal, foodTotal, transportationTotal, entertainmentTotal,
      utilitiesTotal, insuranceTotal, financialObligationTotal,
      medicalTotal, businessTotal, othersTotal
    )
    transactionSelect.value = "latest"
})

statisticsBtn.addEventListener("click", () => getDailySummary(transactions));
statisticsBtn.addEventListener("click", () => getWeeklySummary(new Date(), transactions));
statisticsBtn.addEventListener("click", () => getMonthlySummary(transactions));
statisticsBtn.addEventListener("click", () => getDataForLast6Months(transactions, createIncomeVsExpensesChart, lineCtx, incomeTrendChart, trendCtx));