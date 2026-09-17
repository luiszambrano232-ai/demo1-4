const CONFIG = {
  // Reemplazar por el número real con código de país, sin + ni espacios.
  whatsappNumber: "",
  calendarLocation: "Santiago de Chile",
};

const form = document.querySelector("#booking-form");
const dialog = document.querySelector("#booking-dialog");
const serviceField = document.querySelector("#service");
const dateField = document.querySelector("#date");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

const today = new Date();
dateField.min = today.toISOString().split("T")[0];
document.querySelector("#year").textContent = today.getFullYear();

menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
});

document.querySelectorAll(".nav a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}));

document.querySelectorAll(".choose-service").forEach((button) => {
  button.addEventListener("click", () => {
    serviceField.value = button.dataset.service;
    document.querySelector("#agenda").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => dateField.focus(), 450);
  });
});

function calendarDate(date, time, minutesToAdd = 0) {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  const value = new Date(year, month - 1, day, hours, minutes + minutesToAdd);
  const pad = (number) => String(number).padStart(2, "0");
  return `${value.getFullYear()}${pad(value.getMonth() + 1)}${pad(value.getDate())}T${pad(value.getHours())}${pad(value.getMinutes())}00`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const name = document.querySelector("#client-name").value.trim();
  const service = serviceField.value;
  const date = dateField.value;
  const time = document.querySelector("#time").value;
  const notes = document.querySelector("#notes").value.trim();
  const formattedDate = new Intl.DateTimeFormat("es-CL", { dateStyle: "long" }).format(new Date(`${date}T12:00:00`));
  const message = [
    `Hola Zurieth 😊 Mi nombre es ${name} y quisiera solicitar una hora.`,
    `Servicio: ${service}`,
    `Fecha preferida: ${formattedDate}`,
    `Horario preferido: ${time}`,
    notes ? `Comentario: ${notes}` : "",
    "¿Me confirmas disponibilidad, por favor?",
  ].filter(Boolean).join("\n");

  const waBase = CONFIG.whatsappNumber ? `https://wa.me/${CONFIG.whatsappNumber}` : "https://wa.me/";
  document.querySelector("#whatsapp-link").href = `${waBase}?text=${encodeURIComponent(message)}`;
  const calendarParams = new URLSearchParams({
    action: "TEMPLATE",
    text: `${service} · Zurieth Arias`,
    dates: `${calendarDate(date, time)}/${calendarDate(date, time, 60)}`,
    details: `Solicitud de hora para ${name}. La cita queda sujeta a confirmación por WhatsApp.${notes ? `\n\nComentario: ${notes}` : ""}`,
    location: CONFIG.calendarLocation,
  });
  document.querySelector("#calendar-link").href = `https://calendar.google.com/calendar/render?${calendarParams}`;
  document.querySelector("#booking-summary").textContent = `${service}, el ${formattedDate} a las ${time}.`;
  dialog.showModal();
});

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
