(() => {
  const loginForm = document.querySelector("#login-form");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");
  const passwordConfirm = document.querySelector("#password-confirm");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    login();
  });

  function login() {
    // if (password.value !== passwordConfirm.value)
    //   return alert("passwords do not match");

    const loginData = {
    username: email.value,
      password: password.value,
    };

    const response = fetch(
      "https://www.fulek.com/data/api/user/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      }
    );
debugger;
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
