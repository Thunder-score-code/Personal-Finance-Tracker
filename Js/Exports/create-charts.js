// Module-scoped chart instances (no globals from index.js)
let pieChart = null;
let incomeVsChart = null;
let profitTrendChart = null;

export function createChart(
  ctx,
  housing,
  food,
  transportation,
  entertainment,
  utilities,
  insurance,
  financial_obligation,
  medical,
  business,
  others
) {
  if (pieChart) pieChart.destroy();
  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: [
        "Housing",
        "Food",
        "Transportation",
        "Entertainment",
        "Utilities",
        "Insurance",
        "Financial Obligation",
        "Medical",
        "Business",
        "Others",
      ],
      datasets: [
        {
          label: "Expenses",
          data: [
            housing,
            food,
            transportation,
            entertainment,
            utilities,
            insurance,
            financial_obligation,
            medical,
            business,
            others,
          ],
          backgroundColor: [
            "rgba(78, 121, 167, 0.2)",
            "rgba(242, 142, 43, 0.2)",
            "rgba(225, 87, 89, 0.2)",
            "rgba(118, 183, 178, 0.2)",
            "rgba(89, 161, 79, 0.2)",
            "rgba(237, 201, 72, 0.2)",
            "rgba(176, 122, 161, 0.2)",
            "rgba(255, 157, 167, 0.2)",
            "rgba(156, 117, 95, 0.2)",
            "rgba(186, 176, 172, 0.2)",
          ],
          borderColor: [
            "rgba(78, 121, 167, 1)",
            "rgba(242, 142, 43, 1)",
            "rgba(225, 87, 89, 1)",
            "rgba(118, 183, 178, 1)",
            "rgba(89, 161, 79, 1)",
            "rgba(237, 201, 72, 1)",
            "rgba(176, 122, 161, 1)",
            "rgba(255, 157, 167, 1)",
            "rgba(156, 117, 95, 1)",
            "rgba(186, 176, 172, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      layout: { padding: { right: 32, left: 16, top: 16, bottom: 16 } },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "right", labels: { padding: 24 } },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.parsed || 0;
              return `${label}: ${value.toLocaleString("en-US")} $`;
            },
          },
        },
      },
    },
  });
}

export function createIncomeVsExpensesChart(
  lineCtx,
  firstMonth,
  secondMonth,
  thirdMonth,
  fourthMonth,
  fifthMonth,
  currentMonth
) {
  if (incomeVsChart) incomeVsChart.destroy();

  incomeVsChart = new Chart(lineCtx, {
    type: "line",
    data: {
      labels: [
        firstMonth.date.label,
        secondMonth.date.label,
        thirdMonth.date.label,
        fourthMonth.date.label,
        fifthMonth.date.label,
        currentMonth.date.label,
      ],
      datasets: [
        {
          label: "Income",
          data: [
            firstMonth.income,
            secondMonth.income,
            thirdMonth.income,
            fourthMonth.income,
            fifthMonth.income,
            currentMonth.income,
          ],
          borderColor: "green",
          fill: false,
          tension: 0.2,
        },
        {
          label: "Expenses",
          data: [
            firstMonth.expenses,
            secondMonth.expenses,
            thirdMonth.expenses,
            fourthMonth.expenses,
            fifthMonth.expenses,
            currentMonth.expenses,
          ],
          borderColor: "red",
          fill: false,
          tension: 0.2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {},
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax:
            Math.max(
              ...[
                firstMonth.income,
                secondMonth.income,
                thirdMonth.income,
                fourthMonth.income,
                fifthMonth.income,
                currentMonth.income,
              ]
            ) * 1.25,
        },
      },
    },
  });
}

export function incomeTrendChart(
  trendCtx,
  firstMonth,
  secondMonth,
  thirdMonth,
  fourthMonth,
  fifthMonth,
  currentMonth
) {
  if (profitTrendChart) profitTrendChart.destroy();

  profitTrendChart = new Chart(trendCtx, {
    type: "line",
    data: {
      labels: [
        firstMonth.date.label,
        secondMonth.date.label,
        thirdMonth.date.label,
        fourthMonth.date.label,
        fifthMonth.date.label,
        currentMonth.date.label,
      ],
      datasets: [
        {
          label: "Profit",
          data: [
            firstMonth.profit,
            secondMonth.profit,
            thirdMonth.profit,
            fourthMonth.profit,
            fifthMonth.profit,
            currentMonth.profit,
          ],
          borderColor: "green",
          fill: false,
          tension: 0.2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {},
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax:
            Math.max(
              ...[
                firstMonth.income,
                secondMonth.income,
                thirdMonth.income,
                fourthMonth.income,
                fifthMonth.income,
                currentMonth.income,
              ]
            ) * 1,
        },
      },
    },
  });
}