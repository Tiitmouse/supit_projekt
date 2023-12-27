(() => {
  const loginForm = document.querySelector("#login-form");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    login();
  });

  function login() {
    const loginData = {
        username: email.value,
      password: password.value,
    };

    const response = fetch(
      "https://www.fulek.com/data/api/user/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      }
    );

    response.then((result) =>
      result
        .json()
        .then((data) => {
          storeTokenSessionStorage(data.token);
          location.replace("data.html");
        })
        .catch(() => alert("wrong email or password"))
    );

    function storeTokenSessionStorage(token) {
      sessionStorage.setItem("token", token);
    }
  }
})();
