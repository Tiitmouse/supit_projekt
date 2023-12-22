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
        email: email.value,
        password: password.value,
      };
  
      const response = fetch(
        "https://us-central1-supit-5519f.cloudfunctions.net/app/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );
  
      response.then((result) =>
        result.json()
          .then((data) => {
              storeTokenSessionStorage(data.token)
              location.replace("data.html")
          })
          .catch(() => alert("wrong email or password"))
      )
  
          function storeTokenSessionStorage(token) {
              sessionStorage.setItem("token", token)
          }
    }
  })();
  