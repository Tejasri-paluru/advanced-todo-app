// Get users from localStorage
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// Save users to localStorage
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// SIGNUP LOGIC
const signupBtn = document.getElementById("signupBtn");

if (signupBtn) {
  signupBtn.addEventListener("click", function () {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (name === "" || email === "" || password === "") {
      alert("All fields are required!");
      return;
    }

    let users = getUsers();

    // Check if user already exists
    let existingUser = users.find(user => user.email === email);

    if (existingUser) {
      alert("Email already registered! Please login.");
      window.location.href = "index.html";
      return;
    }

    // Add new user
    users.push({ name, email, password });
    saveUsers(users);

    alert("Signup successful! Please login now.");
    window.location.href = "index.html";
  });
}

// LOGIN LOGIC
const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", function () {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (email === "" || password === "") {
      alert("All fields are required!");
      return;
    }

    let users = getUsers();

    // Check login
    let validUser = users.find(user => user.email === email && user.password === password);

    if (validUser) {
      localStorage.setItem("currentUser", JSON.stringify(validUser));
      alert("Login Successful!");
      window.location.href = "todo.html";
    } else {
      alert("Invalid Email or Password!");
    }
  });
}