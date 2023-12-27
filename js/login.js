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

    const response = fetch("https://www.fulek.com/data/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    response.then((result) =>
      result
        .json()
        .then(({ data, isSuccess, errorMessages }) => {
          if (!isSuccess && errorMessages.length > 0) {
            alert(errorMessages.join("\n"));
            return;
          }
          storeUserLogin(data.username, data.token);
          location.replace("../index.html");
        })
        .catch(() => alert("wrong email or password"))
    );

    function storeUserLogin(username, token) {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("username", username);
    }
  }
})();
