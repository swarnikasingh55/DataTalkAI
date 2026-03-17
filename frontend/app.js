const promptInput = document.getElementById("prompt-input");
const generateBtn = document.getElementById("generate-btn");
const csvInput = document.getElementById("csv-input");
const statusPill = document.getElementById("status-pill");
const rowsMetric = document.getElementById("metric-rows");
const sourceMetric = document.getElementById("metric-source");
const insightText = document.getElementById("insight-text");
const sqlOutput = document.getElementById("sql-output");
const feedbackCard = document.getElementById("feedback-card");
const tableHead = document.querySelector("#results-table thead");
const tableBody = document.querySelector("#results-table tbody");
const chartOneTitle = document.getElementById("chart-one-title");
const chartTwoTitle = document.getElementById("chart-two-title");

let sessionToken = null;
let history = [];
let chartOne = null;
let chartTwo = null;

const palette = ["#0f766e", "#2563eb", "#c2410c", "#7c3aed", "#d97706", "#0891b2"];

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    promptInput.value = chip.dataset.prompt;
  });
});

generateBtn.addEventListener("click", runQuery);
csvInput.addEventListener("change", uploadCsv);

async function runQuery() {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    showFeedback("Enter a prompt first so the dashboard can be generated.");
    return;
  }

  setLoadingState(true);
  clearFeedback();

  try {
    const response = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        session_token: sessionToken,
        history,
      }),
    });
    const payload = await response.json();

    if (payload.error) {
      showFeedback(payload.error + (payload.suggestion ? ` ${payload.suggestion}` : ""));
      setLoadingState(false, "Needs Review");
      return;
    }

    rowsMetric.textContent = payload.row_count;
    insightText.textContent = payload.insight || "Dashboard generated successfully.";
    sqlOutput.textContent = payload.sql || "No SQL returned.";

    history.push({ user: prompt, sql: payload.sql });
    history = history.slice(-5);

    renderTable(payload.data);
    renderCharts(payload.charts, payload.data);
    setLoadingState(false, "Dashboard Ready");
  } catch (error) {
    showFeedback(`Something went wrong while generating the dashboard. ${error.message}`);
    setLoadingState(false, "Error");
  }
}

async function uploadCsv(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  setLoadingState(true, "Uploading CSV");

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.detail || "Upload failed");
    }

    sessionToken = payload.session_token;
    sourceMetric.textContent = file.name;
    promptInput.value = "Compare average online spend by shopping preference";
    showFeedback(payload.message, false);
    setLoadingState(false, "CSV Ready");
  } catch (error) {
    showFeedback(`CSV upload failed. ${error.message}`);
    setLoadingState(false, "Error");
  }
}

function renderCharts(charts, data) {
  destroyCharts();

  const usableCharts = (charts || []).filter((chart) => chart.type !== "table").slice(0, 2);
  const firstChart = usableCharts[0] || defaultChart(data);
  const secondChart = usableCharts[1] || defaultChart(data);

  chartOneTitle.textContent = firstChart.title || "Primary Chart";
  chartTwoTitle.textContent = secondChart.title || "Secondary Chart";

  chartOne = new Chart(document.getElementById("chart-one"), buildConfig(firstChart, data, 0));
  chartTwo = new Chart(document.getElementById("chart-two"), buildConfig(secondChart, data, 1));
}

function buildConfig(chart, data, paletteOffset) {
  if (chart.type === "pie") {
    return {
      type: "pie",
      data: {
        labels: data.map((row) => row[chart.x]),
        datasets: [
          {
            data: data.map((row) => row[chart.y]),
            backgroundColor: palette,
            borderWidth: 0,
          },
        ],
      },
      options: chartOptions(),
    };
  }

  if (chart.type === "scatter") {
    const seriesField = chart.series;
    const seriesNames = seriesField
      ? [...new Set(data.map((row) => row[seriesField]))]
      : ["Series"];
    const datasets = seriesNames.map((seriesName, index) => ({
      label: seriesName,
      data: data
        .filter((row) => !seriesField || row[seriesField] === seriesName)
        .map((row) => ({
          x: Number(row[chart.x]),
          y: Number(row[chart.y]),
        })),
      backgroundColor: palette[index % palette.length],
      borderColor: palette[index % palette.length],
    }));

    return {
      type: "scatter",
      data: { datasets },
      options: chartOptions(true),
    };
  }

  const type = chart.type === "area" ? "line" : chart.type;
  if (chart.series) {
    const labels = [...new Set(data.map((row) => row[chart.x]))];
    const seriesNames = [...new Set(data.map((row) => row[chart.series]))];
    const datasets = seriesNames.map((seriesName, index) => ({
      label: seriesName,
      data: labels.map((label) => {
        const match = data.find((row) => row[chart.x] === label && row[chart.series] === seriesName);
        return match ? Number(match[chart.y]) : 0;
      }),
      borderColor: palette[index % palette.length],
      backgroundColor: palette[index % palette.length],
      fill: false,
      tension: 0.3,
    }));

    return {
      type,
      data: { labels, datasets },
      options: chartOptions(),
    };
  }

  return {
    type: type === "table" ? "bar" : type,
    data: {
      labels: data.map((row) => row[chart.x]),
      datasets: [
        {
          label: chart.title || chart.y,
          data: data.map((row) => Number(row[chart.y])),
          borderColor: palette[paletteOffset % palette.length],
          backgroundColor:
            type === "line" ? "rgba(37, 99, 235, 0.2)" : palette[paletteOffset % palette.length],
          fill: type === "line",
          tension: 0.3,
        },
      ],
    },
    options: chartOptions(),
  };
}

function chartOptions(isScatter = false) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
    scales: {
      x: {
        type: isScatter ? "linear" : "category",
        beginAtZero: isScatter,
      },
      y: {
        beginAtZero: true,
      },
    },
  };
}

function renderTable(rows) {
  tableHead.innerHTML = "";
  tableBody.innerHTML = "";

  if (!rows || rows.length === 0) {
    return;
  }

  const columns = Object.keys(rows[0]);
  const headerRow = document.createElement("tr");
  columns.forEach((column) => {
    const th = document.createElement("th");
    th.textContent = humanize(column);
    headerRow.appendChild(th);
  });
  tableHead.appendChild(headerRow);

  rows.slice(0, 12).forEach((row) => {
    const tr = document.createElement("tr");
    columns.forEach((column) => {
      const td = document.createElement("td");
      const value = row[column];
      td.textContent = typeof value === "number" ? formatNumber(value) : value;
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });
}

function setLoadingState(isLoading, label = "Generating") {
  generateBtn.disabled = isLoading;
  generateBtn.textContent = isLoading ? "Generating..." : "Generate Dashboard";
  statusPill.textContent = label;
}

function showFeedback(message, isError = true) {
  feedbackCard.classList.remove("hidden");
  feedbackCard.textContent = message;
  feedbackCard.style.background = isError ? "rgba(194, 65, 12, 0.1)" : "rgba(15, 118, 110, 0.12)";
  feedbackCard.style.color = isError ? "#9a3412" : "#115e59";
}

function clearFeedback() {
  feedbackCard.classList.add("hidden");
  feedbackCard.textContent = "";
}

function destroyCharts() {
  if (chartOne) {
    chartOne.destroy();
  }
  if (chartTwo) {
    chartTwo.destroy();
  }
}

function defaultChart(data) {
  if (!data || !data[0]) {
    return { type: "bar", title: "Results", x: "label", y: "value" };
  }
  const columns = Object.keys(data[0]);
  return {
    type: "bar",
    title: "Results Overview",
    x: columns[0],
    y: columns[1],
  };
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function humanize(value) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
