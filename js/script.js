// -----------------------------------------------------------------------
// -------------Loading Pages And Fade In Animation-----------------------
// -----------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const content = document.getElementById("content");

  function loadPage(page) {
    content.classList.remove("fade-in");

    setTimeout(() => {
      fetch(`pages/${page}`)
        .then((response) => response.text())
        .then((data) => {
          content.innerHTML = data;
          content.classList.add("fade-in");
          history.pushState({ page }, "", `#${page}`);

          reloadScripts();
        })
        .catch((error) => {
          console.error("Error loading page:", error);
        });
    }, 500);
  }

  function reloadScripts() {
    // Remove old scripts
    document
      .querySelectorAll("script.dynamic-script")
      .forEach((script) => script.remove());

    // Load new scripts from the loaded page
    content.querySelectorAll("script").forEach((oldScript) => {
      const newScript = document.createElement("script");
      newScript.classList.add("dynamic-script");
      newScript.src = oldScript.src;
      newScript.async = true;
      document.body.appendChild(newScript);
    });
  }

  // ✅ Attach event listener for all navigation links (even dynamically loaded ones)
  document.addEventListener("click", function (event) {
    const link = event.target.closest(".nav--link");
    if (link) {
      event.preventDefault();
      let page = link.getAttribute("data-page");
      loadPage(`${page}.html`);
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener("popstate", function (event) {
    if (event.state && event.state.page) {
      loadPage(event.state.page);
    }
  });

  loadPage("home.html");
});
