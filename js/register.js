(() => {
  const loginForm = document.querySelector("#register-form");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");
  const passwordConfirm = document.querySelector("#password-confirm");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    login();
  });

  function login() {
    if (password.value !== passwordConfirm.value) {
      alert("passwords do not match");
      return;
    }

    const loginData = {
      username: email.value,
      password: password.value,
    };

    const response = fetch("https://www.fulek.com/data/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    response.then((result) =>
      result
        .json()
        .then(({isSuccess, errorMessages }) => {
          debugger;
          if(isSuccess) {
            alert("Registration successful");
            location.replace("../html/prijava.html");
          }
          else if (errorMessages.lenght > 0) {
            alert(errorMessages.join("\n"));
          }
        })
        .catch(() => alert("registration failed"))
    );
  }
})();
