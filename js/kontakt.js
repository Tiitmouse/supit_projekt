(()=> {
    const kontaktButton = document.createElement('button');
    kontaktButton.id = "kruzic";
    kontaktButton.className = "dot btn btn-primary";
    kontaktButton.type = "button";
    if(window.location.href.includes("index.html")) {
        kontaktButton.innerHTML = `<img src="./materijali/img/contactIcon.png" alt="kontakt"/>`;

    }
    else {
        kontaktButton.innerHTML = `<img src="../materijali/img/contactIcon.png" alt="kontakt"/>`;
    }

    kontaktButton.addEventListener('click', () => {modal.show()});

    document.body.append(kontaktButton);

    const modalElement = document.createElement('div');
    modalElement.id = "kontaktModal";
    modalElement.className = "modal fade";
    modalElement.setAttribute("tabindex", "-1")
    modalElement.setAttribute("aria-hidden", "true");
    modalElement.innerHTML = `
    <div class="modal-dialog">
            <div class="modal-content kontaktform round-borde">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="kontaktModalLabel">Kontakt</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body r">
                      <form
                        action="https://www.fulek.com/mvc/supit/project-contact-form"
                        method="post"
                      >
                        <div class="form-floating mb-3">
                          <input
                            class="form-control"
                            type="text"
                            name="fullName"
                            id="fullName"
                            placeholder="full name&#0042;"
                            required
                          />
                          <label for="text">full name&#0042;</label>
                        </div>
                        <div class="form-floating mb-3">
                          <input
                            class="form-control"
                            type="email"
                            name="email"
                            id="email"
                            value="${sessionStorage.getItem("username") ?? ""} "
                            placeholder="email&#0042;"
                            required
                          />
                          <label for="email">email&#0042;</label>
                        </div>
                        <div class="choiceThings mb-3">
                          <div class="importance">
                            <label for="importance">importance</label>
                            <select class="form-select" name="importance" id="importance" style="margin-left: 1rem;">
                              <option value="low">low</option>
                              <option value="medium">medium</option>
                              <option value="high">high</option>
                            </select>
                          </div>
                          <div>
                            <label for="receiveNewsletter" class="form-label">subscribe</label>
                            <input
                              type="checkbox"
                              class="form-check-input"
                              name="receiveNewsletter"
                              id="receiveNewsletter"
                              value="true" 
                            />
                          </div>
                        </div>
                        <div class="form-floating">
                          <textarea
                            class="form-control"
                            name="message"
                            id="message"
                            cols="30"
                            rows="10"
                            placeholder="message"
                          ></textarea>
                          <label for="message">message</label>
                        </div>
                        <div class="buttgroup">
                            <button type="submit" class="buttlog btn">send</button>
                        </div>
                            
                      </form>
                </div>

            </div>
        </div>`

    document.body.append(modalElement);

    const modal = new bootstrap.Modal("#kontaktModal", {});
})()