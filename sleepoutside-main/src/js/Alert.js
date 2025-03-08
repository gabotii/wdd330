// Alert
export default class Alert {
  constructor() {
    this.alerts = [];
  }

  async loadAlerts() {
    try {
      const response = await fetch("../json/alerts.json");
      this.alerts = await response.json();
    } catch (error) {
      console.error("Error loading alerts:", error);
    }
  }

  displayAlerts() {
    const main = document.querySelector("main");
    if (!main) return;

    const alertList = document.createElement("section");
    alertList.classList.add("alert-list");

    this.alerts.forEach((alert) => {
      const alertContainer = document.createElement("div");
      alertContainer.classList.add("alert-container");
      alertContainer.style.backgroundColor = alert.background;
      alertContainer.style.color = alert.color;

      const p = document.createElement("p");
      p.textContent = alert.message;

      const closeButton = document.createElement("button");
      closeButton.textContent = "×"; 
      closeButton.classList.add("alert-close");
      closeButton.style.marginLeft = "10px"; 
      closeButton.style.marginTop = "-50px";
      closeButton.style.background = "none";
      closeButton.style.border = "none";
      closeButton.style.color = alert.color;
      closeButton.style.cursor = "pointer";
      closeButton.style.fontSize = "1.2em";

      closeButton.addEventListener("click", () => {
        alertContainer.remove();
      });

      alertContainer.appendChild(p);
      alertContainer.appendChild(closeButton);
      alertList.appendChild(alertContainer);
    });

    main.prepend(alertList);
  }

  async init() {
    await this.loadAlerts();
    this.displayAlerts();
  }
}
