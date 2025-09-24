// --- Simple deterministic prime test ---
function isPrime(n) {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  if (n % 3 === 0) return n === 3;
  const limit = Math.floor(Math.sqrt(n));
  for (let f = 5; f <= limit; f += 6) {
    if (n % f === 0 || n % (f + 2) === 0) return false;
  }
  return true;
}

// --- Goldbach decomposition via UPE ---
function findGoldbachPair(E) {
  const x = E / 2;
  const lnX = Math.log(x);
  const P = Math.floor(lnX);

  let c2 = 1;
  let tested = 0;
  let found = null;

  while (!found && c2 <= 6) {
    const T = Math.ceil(c2 * lnX * lnX);
    for (let t = 0; t <= T; t++) {
      const a = x - t;
      const b = E - a;
      if (a > 1 && b > 1 && isPrime(a) && isPrime(b)) {
        found = [a, b];
        break;
      }
      tested++;
    }
    if (!found) c2++;
  }

  return {
    E, x, lnX, P, c2,
    tested,
    pair: found
  };
}

// --- UI for calculator ---
function setupCalculator() {
  const findBtn = document.getElementById("findBtn");
  const clearBtn = document.getElementById("clearBtn");
  if (!findBtn) return;

  findBtn.addEventListener("click", () => {
    const E = parseInt(document.getElementById("evenInput").value);
    if (isNaN(E) || E % 2 !== 0 || E < 4) {
      alert("Please enter an even integer ≥ 4.");
      return;
    }

    const result = findGoldbachPair(E);
    const resDiv = document.getElementById("result");
    if (result.pair) {
      resDiv.innerHTML = `✅ Goldbach pair for E = ${E}: <b>${result.pair[0]} + ${result.pair[1]}</b>
        <br>Found with c₂ = ${result.c2}, tested ${result.tested} candidates.`;
    } else {
      resDiv.innerHTML = `❌ No pair found (stopped at c₂ = ${result.c2}).`;
    }

    const diag = document.getElementById("diagnostics");
    diag.innerHTML = `
      <ul>
        <li>Center x = ${result.x}</li>
        <li>ln(x) = ${result.lnX.toFixed(6)}</li>
        <li>P cutoff = ${result.P}</li>
        <li>Final c₂ = ${result.c2}</li>
        <li>Tested = ${result.tested}</li>
      </ul>
    `;
  });

  clearBtn.addEventListener("click", () => {
    document.getElementById("evenInput").value = "";
    document.getElementById("result").innerHTML = "";
    document.getElementById("diagnostics").innerHTML = "";
  });
}

// --- UI for tables ---
function setupTables() {
  const populateBtn = document.getElementById("populateExamples");
  if (!populateBtn) return;
  const tbody = document.querySelector("#examplesTable tbody");

  populateBtn.addEventListener("click", () => {
    tbody.innerHTML = "";
    const examples = [20, 36, 100, 246, 1000, 2000, 5000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 1000000000000];
    for (const E of examples) {
      const result = findGoldbachPair(E);
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${E}</td>
        <td>${result.x}</td>
        <td>${result.lnX.toFixed(4)}</td>
        <td>${result.P}</td>
        <td>${Math.ceil(result.c2 * result.lnX * result.lnX)}</td>
        <td>${result.pair ? result.pair[0] + " + " + result.pair[1] : "—"}</td>
        <td>${result.tested}</td>
      `;
      tbody.appendChild(row);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupCalculator();
  setupTables();
});
