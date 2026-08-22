

```javascript
const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MathBot PH</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg,#2563eb,#7c3aed);
      color: white;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .box {
      width: 90%;
      max-width: 650px;
      background: white;
      color: #111827;
      padding: 35px;
      border-radius: 20px;
      text-align: center;
      box-shadow: 0 15px 40px rgba(0,0,0,.25);
    }

    h1 {
      margin-bottom: 10px;
      font-size: 40px;
    }

    p {
      color: #6b7280;
    }

    input {
      width: 90%;
      padding: 15px;
      margin-top: 20px;
      border: 1px solid #ddd;
      border-radius: 10px;
      font-size: 18px;
    }

    button {
      margin-top: 15px;
      padding: 15px 30px;
      border: 0;
      border-radius: 10px;
      background: #2563eb;
      color: white;
      font-size: 18px;
      cursor: pointer;
    }

    #answer {
      margin-top: 25px;
      font-size: 20px;
      font-weight: bold;
    }
  </style>
</head>
<body>

<div class="box">
  <h1>🤖 MathBot PH</h1>
  <p>Your Simple Math Assistant 🇵🇭</p>

  <input id="math" placeholder="Example: 25 + 75">

  <br>

  <button onclick="solve()">Solve</button>

  <div id="answer">Answer will appear here.</div>
</div>

<script>
function solve() {
  const input = document.getElementById("math").value;

  if (!input) {
    document.getElementById("answer").innerText =
      "Please enter a math problem.";
    return;
  }

  try {
    let expression = input
      .replace(/×/g, "*")
      .replace(/x/gi, "*")
      .replace(/÷/g, "/");

    const result = Function(
      '"use strict"; return (' + expression + ')'
    )();

    document.getElementById("answer").innerText =
      "✅ Answer: " + result;

  } catch {
    document.getElementById("answer").innerText =
      "❌ Invalid math problem.";
  }
}
</script>

</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log("MathBot PH running on port " + PORT);
});
```
