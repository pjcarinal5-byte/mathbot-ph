
const express = require("express");

const app = express();

const PORT = process.env.PORT || 10000;

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
>

<title>MathBot PH</title>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<style>

* {
  box-sizing: border-box;
}

body {

  margin: 0;

  font-family:
    Arial,
    Helvetica,
    sans-serif;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #7c3aed
    );

  min-height: 100vh;

  color: #111827;
}


/* HEADER */

header {

  background: rgba(255,255,255,.95);

  padding: 15px 25px;

  display: flex;

  justify-content: space-between;

  align-items: center;

  box-shadow:
    0 2px 10px
    rgba(0,0,0,.1);

}

.logo {

  font-size: 22px;

  font-weight: bold;

  color: #2563eb;

}

.header-buttons button {

  width: auto;

  margin-left: 8px;

  padding:
    9px 15px;

}


/* MAIN */

.main {

  max-width: 1000px;

  margin:
    40px auto;

  padding:
    20px;

}


/* HERO */

.hero {

  text-align: center;

  color: white;

  margin-bottom: 30px;

}

.hero h1 {

  font-size:
    clamp(32px, 7vw, 55px);

  margin:
    10px 0;

}

.hero p {

  font-size: 18px;

}


/* CARD */

.card {

  background: white;

  border-radius: 18px;

  padding: 30px;

  box-shadow:
    0 15px 40px
    rgba(0,0,0,.2);

  margin-bottom: 25px;

}


/* SOLVER */

.solver {

  max-width: 700px;

  margin:
    0 auto;

}

input {

  width: 100%;

  padding: 15px;

  margin:
    8px 0;

  border:
    1px solid #d1d5db;

  border-radius: 10px;

  font-size: 16px;

  outline: none;

}

input:focus {

  border-color:
    #2563eb;

}


/* BUTTON */

button {

  width: 100%;

  padding: 14px;

  border: none;

  border-radius: 10px;

  background:
    #2563eb;

  color: white;

  font-size: 16px;

  font-weight: bold;

  cursor: pointer;

  margin-top: 10px;

}

button:hover {

  background:
    #1d4ed8;

}

.secondary {

  background:
    #64748b;

}

.secondary:hover {

  background:
    #475569;

}

.premium-btn {

  background:
    linear-gradient(
      90deg,
      #f59e0b,
      #f97316
    );

}

.premium-btn:hover {

  background:
    linear-gradient(
      90deg,
      #d97706,
      #ea580c
    );

}


/* ANSWER */

.answer {

  margin-top: 20px;

  padding: 20px;

  border-radius: 10px;

  background:
    #eff6ff;

  font-size: 18px;

  text-align: center;

}


/* FREE COUNTER */

.counter {

  text-align: center;

  margin-top: 15px;

  color: #475569;

}


/* FEATURES */

.features {

  display: grid;

  grid-template-columns:
    repeat(
      auto-fit,
      minmax(200px, 1fr)
    );

  gap: 15px;

  margin-top: 25px;

}

.feature {

  padding: 20px;

  background:
    #f8fafc;

  border-radius: 12px;

  text-align: center;

}


/* LOGIN */

.auth {

  max-width: 420px;

  margin:
    40px auto;

}

.auth h2 {

  text-align: center;

}


/* DASHBOARD */

.dashboard {

  max-width: 800px;

  margin:
    0 auto;

}

.user-box {

  background:
    #eff6ff;

  padding: 20px;

  border-radius: 12px;

  margin-bottom: 20px;

}


/* PREMIUM */

.premium-card {

  background:
    linear-gradient(
      135deg,
      #fff7ed,
      #fef3c7
    );

  border:
    2px solid #f59e0b;

}

.price {

  font-size: 42px;

  font-weight: bold;

  color:
    #ea580c;

  text-align: center;

}

.price span {

  font-size: 16px;

  color: #64748b;

}


/* NAVIGATION */

.hidden {

  display: none !important;

}


/* MESSAGE */

.message {

  text-align: center;

  margin-top: 15px;

  font-size: 14px;

}


/* FOOTER */

footer {

  text-align: center;

  color: white;

  padding:
    30px 20px;

}

</style>

</head>


<body>


<!-- HEADER -->

<header>

<div class="logo">

🤖 MathBot PH

</div>


<div class="header-buttons">

<button
  id="loginButton"
  onclick="showLogin()"
>
Login
</button>

<button
  id="registerButton"
  onclick="showRegister()"
>
Register
</button>

<button
  id="dashboardButton"
  class="hidden"
  onclick="showDashboard()"
>
Dashboard
</button>

</div>

</header>



<!-- FREE HOME -->

<div
  id="homePage"
  class="main"
>


<div class="hero">

<h1>
🤖 MathBot PH
</h1>

<p>
Your Filipino Math Assistant
</p>

</div>



<div class="card solver">

<h2>
🧮 Solve Your Math Problem
</h2>

<p>
No account required.
Try MathBot for FREE!
</p>


<input
  id="problem"
  placeholder="Example: 25 + 35"
/>


<button onclick="solve()">

Solve Problem

</button>


<div
  id="answer"
  class="answer hidden"
></div>


<div
  id="freeCounter"
  class="counter"
>
Free questions remaining:
<strong id="remaining">
10
</strong>
</div>


<button
  class="premium-btn"
  onclick="showRegister()"
>

⭐ Create Free Account

</button>


</div>



<div class="card">

<h2>
Why use MathBot PH?
</h2>


<div class="features">


<div class="feature">

🧮

<h3>
Math Solver
</h3>

<p>
Solve basic math problems instantly.
</p>

</div>


<div class="feature">

📚

<h3>
Easy to Use
</h3>

<p>
Simple interface for students.
</p>

</div>


<div class="feature">

🇵🇭

<h3>
Filipino Friendly
</h3>

<p>
Designed for Filipino students.
</p>

</div>


<div class="feature">

⭐

<h3>
Premium
</h3>

<p>
Unlock unlimited math assistance.
</p>

</div>


</div>

</div>


</div>



<!-- LOGIN -->

<div
  id="loginPage"
  class="main hidden"
>

<div class="card auth">

<h2>
🔐 Login
</h2>


<input
  id="loginEmail"
  type="email"
  placeholder="Email"
/>


<input
  id="loginPassword"
  type="password"
  placeholder="Password"
/>


<button onclick="login()">

Login

</button>


<button
  class="secondary"
  onclick="showHome()"
>

Back

</button>


<div
  id="loginMessage"
  class="message"
></div>


<p
  class="message"
>

Don't have an account?

<button
  onclick="showRegister()"
>

Create Account

</button>

</p>

</div>

</div>



<!-- REGISTER -->

<div
  id="registerPage"
  class="main hidden"
>

<div class="card auth">

<h2>
📝 Create Account
</h2>


<input
  id="registerEmail"
  type="email"
  placeholder="Email"
/>


<input
  id="registerPassword"
  type="password"
  placeholder="Password"
/>


<input
  id="confirmPassword"
  type="password"
  placeholder="Confirm Password"
/>


<button onclick="register()">

Create Free Account

</button>


<button
  class="secondary"
  onclick="showHome()"
>

Back

</button>


<div
  id="registerMessage"
  class="message"
></div>

</div>

</div>



<!-- DASHBOARD -->

<div
  id="dashboardPage"
  class="main hidden"
>


<div class="dashboard">


<div class="card">

<h2>
👤 My Account
</h2>


<div class="user-box">

Logged in as:

<strong
  id="userEmail"
>
</strong>

</div>


<h3>
Account Status
</h3>


<p id="accountStatus">

🟢 Free Account

</p>


</div>



<!-- PREMIUM -->

<div class="card premium-card">

<h2>
⭐ MathBot PH Premium
</h2>


<div class="price">

₱99

<span>
/ month
</span>

</div>


<p style="text-align:center">

Unlock the full MathBot PH experience.

</p>


<ul>

<li>
Unlimited math questions
</li>

<li>
Step-by-step solutions
</li>

<li>
AI Math Tutor
</li>

<li>
Save your math history
</li>

<li>
No advertisements
</li>

</ul>


<button
  class="premium-btn"
  onclick="premiumMessage()"
>

⭐ Upgrade to Premium

</button>


<div
  id="premiumMessage"
  class="message"
></div>


</div>



<button
  class="secondary"
  onclick="logout()"
>

Logout

</button>


</div>

</div>



<footer>

© 2026 MathBot PH

</footer>



<script>


const SUPABASE_URL =
"${SUPABASE_URL}";


const SUPABASE_ANON_KEY =
"${SUPABASE_ANON_KEY}";


const supabaseClient =
window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);



/* FREE TRIAL */

const FREE_LIMIT = 10;

const today =
new Date()
.toISOString()
.slice(0, 10);


const savedDate =
localStorage.getItem(
  "mathbot_date"
);


if (savedDate !== today) {

  localStorage.setItem(
    "mathbot_date",
    today
  );

  localStorage.setItem(
    "mathbot_questions",
    "0"
  );

}


let questions =
parseInt(
  localStorage.getItem(
    "mathbot_questions"
  ) || "0"
);


function updateCounter() {

  const remaining =
    Math.max(
      0,
      FREE_LIMIT - questions
    );

  document
    .getElementById("remaining")
    .innerText =
    remaining;

}


updateCounter();



/* PAGE FUNCTIONS */


function hideAllPages() {

  document
    .getElementById("homePage")
    .classList.add("hidden");

  document
    .getElementById("loginPage")
    .classList.add("hidden");

  document
    .getElementById("registerPage")
    .classList.add("hidden");

  document
    .getElementById("dashboardPage")
    .classList.add("hidden");

}


function showHome() {

  hideAllPages();

  document
    .getElementById("homePage")
    .classList.remove("hidden");

}


function showLogin() {

  hideAllPages();

  document
    .getElementById("loginPage")
    .classList.remove("hidden");

}


function showRegister() {

  hideAllPages();

  document
    .getElementById("registerPage")
    .classList.remove("hidden");

}


function showDashboard() {

  hideAllPages();

  document
    .getElementById("dashboardPage")
    .classList.remove("hidden");

}



/* SOLVER */


function solve() {

  const problem =
    document
      .getElementById("problem")
      .value
      .trim();


  const answer =
    document
      .getElementById("answer");


  if (!problem) {

    answer.innerText =
      "Please enter a math problem.";

    answer.classList.remove(
      "hidden"
    );

    return;

  }


  if (questions >= FREE_LIMIT) {

    answer.innerHTML = `
      <strong>
      Free trial finished.
      </strong>
      <br><br>
      Create a free account to continue.
    `;

    answer.classList.remove(
      "hidden"
    );

    return;

  }


  try {


    if (
      !/^[0-9+\\-*/().%\\s]+$/
      .test(problem)
    ) {

      throw new Error(
        "Invalid"
      );

    }


    const result =
      Function(
        "return " + problem
      )();


    questions++;


    localStorage.setItem(
      "mathbot_questions",
      questions
    );


    updateCounter();


    answer.innerHTML = `
      <strong>
      Answer: ${result}
      </strong>
    `;


    answer.classList.remove(
      "hidden"
    );


  } catch (error) {


    answer.innerText =
      "Invalid math expression.";

    answer.classList.remove(
      "hidden"
    );

  }

}



/* REGISTER */


async function register() {


  const email =
    document
      .getElementById(
        "registerEmail"
      )
      .value
      .trim();


  const password =
    document
      .getElementById(
        "registerPassword"
      )
      .value;


  const confirm =
    document
      .getElementById(
        "confirmPassword"
      )
      .value;


  const message =
    document
      .getElementById(
        "registerMessage"
      );


  if (!email || !password) {

    message.innerText =
      "Please complete all fields.";

    return;

  }


  if (password.length < 6) {

    message.innerText =
      "Password must be at least 6 characters.";

    return;

  }


  if (password !== confirm) {

    message.innerText =
      "Passwords do not match.";

    return;

  }


  message.innerText =
    "Creating account...";


  const { data, error } =
    await supabaseClient
      .auth
      .signUp({

        email,
        password

      });


  if (error) {

    message.innerText =
      error.message;

    return;

  }


  message.innerText =
    "Account created! Check your email for confirmation.";

}



/* LOGIN */


async function login() {


  const email =
    document
      .getElementById(
        "loginEmail"
      )
      .value
      .trim();


  const password =
    document
      .getElementById(
        "loginPassword"
      )
      .value;


  const message =
    document
      .getElementById(
        "loginMessage"
      );


  if (!email || !password) {

    message.innerText =
      "Enter your email and password.";

    return;

  }


  message.innerText =
    "Logging in...";


  const { data, error } =
    await supabaseClient
      .auth
      .signInWithPassword({

        email,
        password

      });


  if (error) {

    message.innerText =
      error.message;

    return;

  }


  showLoggedIn(
    data.user
  );

}



/* USER */


function showLoggedIn(user) {


  document
    .getElementById(
      "loginButton"
    )
    .classList
    .add("hidden");


  document
    .getElementById(
      "registerButton"
    )
    .classList
    .add("hidden");


  document
    .getElementById(
      "dashboardButton"
    )
    .classList
    .remove("hidden");


  document
    .getElementById(
      "userEmail"
    )
    .innerText =
    user.email;


  showDashboard();

}



/* LOGOUT */


async function logout() {


  await supabaseClient
    .auth
    .signOut();


  document
    .getElementById(
      "dashboardButton"
    )
    .classList
    .add("hidden");


  document
    .getElementById(
      "loginButton"
    )
    .classList
    .remove("hidden");


  document
    .getElementById(
      "registerButton"
    )
    .classList
    .remove("hidden");


  showHome();

}



/* PREMIUM */


function premiumMessage() {


  document
    .getElementById(
      "premiumMessage"
    )
    .innerHTML = `

      ⭐ Premium checkout
      will be connected next.

      <br><br>

      Price:
      <strong>₱99/month</strong>

    `;

}



/* CHECK LOGIN */


async function checkUser() {


  const {
    data
  } =
    await supabaseClient
      .auth
      .getUser();


  if (data.user) {

    showLoggedIn(
      data.user
    );

  }

}


checkUser();


</script>

</body>

</html>
  `);
});



/* HEALTH CHECK */

app.get("/health", (req, res) => {

  res.json({

    status: "ok",

    app: "MathBot PH",

    version: "2.0"

  });

});



/* START SERVER */

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      "MathBot PH running on port " +
      PORT
    );

  }
);
