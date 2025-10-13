import { showSection, blockNonNumericInput } from './Exports/background-runners.js';
import { createChart, createIncomeVsExpensesChart, incomeTrendChart } from './Exports/create-charts.js';
import { updateTotals, renderTransactions, getDailySummary, getWeeklySummary, getMonthlySummary } from './Exports/ui-updaters.js';
import { filterTransactions, getTotalsByCategory, getDataForLast6Months } from './Exports/data-processors.js';
import { handleAddIncome, handleAddExpense } from './Exports/transaction-handlers.js';

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

let transactions = [];
let filtered = [];
let balance = 0;
let income = 0;
let expense = 0;

if (localStorage.getItem("transactions")) {
    transactions = JSON.parse(localStorage.getItem("transactions"));
    // Convert date strings back to Date objects
    transactions.forEach(t => {
        t.date = new Date(t.date);
    });
    // Calculate totals from loaded transactions
    transactions.forEach(t => {
        if(t.type === "Income") {
            income += t.amount;
            balance += t.amount;
        } else if(t.type === "Expense") {
            expense += t.amount;
            balance -= t.amount;
        }
    });
    
    // Calculate category totals and create chart for loaded data
    const totals = getTotalsByCategory(transactions);
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
    
    // Update UI with loaded data
    updateTotals(balance, income, expense);
    renderTransactions([...transactions].reverse(), transactionList);
    renderTransactions([...transactions].reverse().slice(0,5), recentTransactions);
}

dashboardBtn.addEventListener("click", () => showSection("dashboard"));
transactionsBtn.addEventListener("click", () => showSection("transaction-section"));
statisticsBtn.addEventListener("click", () => showSection("statistics"));

// Only create initial chart if no data is loaded from localStorage
if (!localStorage.getItem("transactions")) {
    createChart(ctx, housingTotal, foodTotal, transportationTotal, entertainmentTotal, utilitiesTotal, insuranceTotal, financialObligationTotal, medicalTotal, businessTotal, othersTotal);
}

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

showSection("dashboard")

addIncomeBtn.addEventListener("click", () => {
    const result = handleAddIncome(
        transactions,
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
    );
    income = result.income;
    balance = result.balance;
    expense = result.expense;
});

addExpenseBtn.addEventListener("click", () => {
    const result = handleAddExpense(
        transactions,
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
    );
    income = result.income;
    balance = result.balance;
    expense = result.expense;
});

statisticsBtn.addEventListener("click", () => getDailySummary(transactions));
statisticsBtn.addEventListener("click", () => getWeeklySummary(new Date(), transactions));
statisticsBtn.addEventListener("click", () => getMonthlySummary(transactions));
statisticsBtn.addEventListener("click", () => getDataForLast6Months(transactions, createIncomeVsExpensesChart, lineCtx, incomeTrendChart, trendCtx));