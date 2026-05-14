const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

async function loadData() {
  const response = await fetch("/data/sample-dashboard-data.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`Sample data failed to load: ${response.status}`);
  return response.json();
}

function card(label, value, note, pct = 70) {
  return `
    <section class="card">
      <div class="label">${label}</div>
      <div class="value">${value}</div>
      <div class="note">${note}</div>
      <div class="bar"><span style="width:${Math.max(2, Math.min(100, pct))}%"></span></div>
    </section>
  `;
}

function renderExecutive(data) {
  const c = data.company;
  document.querySelector("#app").innerHTML = `
    ${header("Restaurant KPI Dashboard", data.period.note)}
    ${nav("executive")}
    <div class="grid">
      ${card("Net Sales", money.format(c.netSales), data.period.label, 82)}
      ${card("Discounts", money.format(c.discounts), "2.8% of sales", 28)}
      ${card("Total Orders", number.format(c.orders), `AOV ${money.format(c.aov)}`, 74)}
      ${card("7shifts Labor", `${number.format(c.laborPercent)}%`, `${money.format(c.laborCost)} labor cost`, 62)}
      ${card("Third Party Sales", money.format(c.thirdPartySales), `${number.format(c.thirdPartyPercent)}% of net sales`, 58)}
      ${card("Catering Sales", money.format(c.cateringSales), `${number.format(c.cateringPercent)}% of net sales`, 72)}
      ${card("Prime Cost", c.primeCostStatus, c.primeCostNote, 18)}
      ${card("Top Location", data.locations[0].name, "By selected-period net sales", 90)}
    </div>
    <h2>Combo Demand</h2>
    <div class="grid">${data.combos.map(x => card(x.label, `${x.sold} sold`, `${money.format(x.value)} total value`, 55)).join("")}</div>
    ${locationTable(data)}
  `;
}

function renderAiOps(data) {
  const ops = data.aiOps;
  document.querySelector("#app").innerHTML = `
    ${header("AI Mission Control", "Supervised QA agents, pipeline health, and recommendations.")}
    ${nav("ai")}
    <div class="grid">
      ${card("System Health", ops.health, "Dashboard source data is synthetic and valid.", 95)}
      ${card("Prime Cost", ops.primeCost, "Ready only when sales, labor, and food cost periods match.", 80)}
      ${card("Active Agents", String(ops.agents.length), "Supervised read-only workers.", 72)}
      ${card("Cache", "Demo", "No private data stored in this public copy.", 52)}
    </div>
    <h2>Agent Overview</h2>
    <div class="grid two">${ops.agents.map(agent => `
      <section class="card">
        <span class="badge ${agent.status === "Online" ? "good" : "warn"}">${agent.status}</span>
        <div class="label" style="margin-top:16px">${agent.name}</div>
        <div class="note">${agent.message}</div>
      </section>
    `).join("")}</div>
    <section class="table-card">
      <h2>Logs & Events</h2>
      <table>
        <thead><tr><th>Time</th><th>Agent</th><th>Severity</th><th>Message</th></tr></thead>
        <tbody>${ops.logs.map(log => `<tr><td>${log.time}</td><td>${log.agent}</td><td><span class="badge ${log.severity === "Info" ? "good" : "warn"}">${log.severity}</span></td><td>${log.message}</td></tr>`).join("")}</tbody>
      </table>
    </section>
  `;
}

function locationTable(data) {
  return `
    <section class="table-card">
      <h2>Location Ranking</h2>
      <table>
        <thead><tr><th>Location</th><th class="right">Net Sales</th><th class="right">Orders</th><th class="right">AOV</th><th class="right">Third Party</th><th class="right">Catering</th><th class="right">Labor</th></tr></thead>
        <tbody>${data.locations.map(row => `
          <tr>
            <td>${row.name}</td>
            <td class="right">${money.format(row.netSales)}</td>
            <td class="right">${number.format(row.orders)}</td>
            <td class="right">${money.format(row.aov)}</td>
            <td class="right">${number.format(row.thirdPartyPercent)}%</td>
            <td class="right">${number.format(row.cateringPercent)}%</td>
            <td class="right">${number.format(row.laborPercent)}%</td>
          </tr>`).join("")}</tbody>
      </table>
    </section>
  `;
}

function header(title, subtitle) {
  return `
    <header class="topbar">
      <div>
        <h1>${title}</h1>
        <p class="subtitle">${subtitle}</p>
      </div>
      <span class="badge good">Synthetic Portfolio</span>
    </header>
  `;
}

function nav(active) {
  return `
    <nav class="nav">
      <a class="${active === "executive" ? "active" : ""}" href="/">Executive</a>
      <a class="${active === "ai" ? "active" : ""}" href="/ai-ops.html">AI Mission Control</a>
      <a href="/docs/architecture.html">Architecture</a>
    </nav>
  `;
}

loadData()
  .then(data => window.location.pathname.includes("ai-ops") ? renderAiOps(data) : renderExecutive(data))
  .catch(error => {
    document.querySelector("#app").innerHTML = `<main class="shell"><h1>Demo failed safely</h1><p>${error.message}</p></main>`;
  });
