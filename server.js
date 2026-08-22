
const express = require("express");

const app = express();

const PORT = process.env.PORT || 10000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>MathBot PH</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f4f7fb;
            text-align: center;
            padding: 50px 20px;
          }

          .box {
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          }

          h1 {
            color: #2563eb;
          }

          input {
            width: 80%;
            padding: 12px;
            margin: 10px;
            border: 1px solid #ccc;
            border-radius: 8px;
          }

          button {
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            background: #2563eb;
            color: white;
            cursor: pointer;
          }

          #answer {
            margin-top: 20px;
            font-size: 18px;
            font-weight: bold;
          }
        </style>
      </head>

      <body>
        <div class="box">
          <h1>🤖 MathBot PH</h1>
          <p>Enter your math problem:</p>

          <input id="problem" placeholder="Example: 25 + 35">

          <button onclick="solve()">Solve</button>

          <div id="answer"></div>
        </div>

        <script>
          function solve() {
            const problem = document.getElementById("problem").value;
            const answer = document.getElementById("answer");

            try {
              if (!/^[0-9+\\-*/().%\\s]+$/.test(problem)) {
                answer.innerText = "Please enter a valid math expression.";
                return;
              }

              const result = Function("return " + problem)();

              answer.innerText = "Answer: " + result;
            } catch (error) {
              answer.innerText = "Invalid math problem.";
            }
          }
        </script>
      </body>
    </html>
  `);
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    app: "MathBot PH"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`MathBot PH running on port ${PORT}`);
});
