const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const bookingForm = document.querySelector("#booking-form");
const bookingDialog = document.querySelector("#booking-dialog");
const dialogClose = document.querySelector(".dialog-close");

const serviceSelect = document.querySelector("#service");
const clientName = document.querySelector("#client-name");
const dateInput = document.querySelector("#date");
const timeSelect = document.querySelector("#time");
const notesInput = document.querySelector("#notes");

const bookingSummary = document.querySelector("#booking-summary");
const whatsappLink = document.querySelector("#whatsapp-link");
const calendarLink = document.querySelector("#calendar-link");

const whatsappNumber = "56900000000";

document.querySelector("#year").textContent = new Date().getFullYear();

const today = new Date();
const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
)
    .toISOString()
    .split("T")[0];

dateInput.min = localDate;

menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.textContent = isOpen ? "×" : "☰";
});

document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => {
        nav.classList.remove("open");
        document.body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    });
});

document.querySelectorAll(".choose-service").forEach((button) => {
    button.addEventListener("click", () => {
        serviceSelect.value = button.dataset.service;

        document.querySelector("#agenda").scrollIntoView({
            behavior: "smooth"
        });

        setTimeout(() => {
            clientName.focus();
        }, 500);
    });
});

function formatDate(dateValue) {
    return new Intl.DateTimeFormat("es-CL", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(new Date(`${dateValue}T12:00:00`));
}

function formatCalendarDate(dateValue, timeValue) {
    return `${dateValue.replaceAll("-", "")}T${timeValue.replace(":", "")}00`;
}

bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
    }

    const name = clientName.value.trim();
    const service = serviceSelect.value;
    const date = dateInput.value;
    const time = timeSelect.value;
    const notes = notesInput.value.trim();

    const readableDate = formatDate(date);

    bookingSummary.textContent =
        `${name}, preparé tu solicitud para ${service}, ` +
        `el ${readableDate} a las ${time}.`;

    const whatsappMessage = [
        "Hola Zurieth 👋",
        "",
        "Quisiera solicitar una hora:",
        `• Nombre: ${name}`,
        `• Servicio: ${service}`,
        `• Fecha: ${readableDate}`,
        `• Horario: ${time}`,
        notes ? `• Comentario: ${notes}` : "",
        "",
        "¿Podrías confirmarme la disponibilidad? Gracias."
    ]
        .filter(Boolean)
        .join("\n");

    whatsappLink.href =
        `https://wa.me/${whatsappNumber}?text=` +
        encodeURIComponent(whatsappMessage);

    const startDate = formatCalendarDate(date, time);

    const start = new Date(`${date}T${time}:00`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const endDate =
        `${end.getFullYear()}` +
        `${String(end.getMonth() + 1).padStart(2, "0")}` +
        `${String(end.getDate()).padStart(2, "0")}` +
        `T${String(end.getHours()).padStart(2, "0")}` +
        `${String(end.getMinutes()).padStart(2, "0")}00`;

    const calendarParameters = new URLSearchParams({
        action: "TEMPLATE",
        text: `${service} con Zurieth Arias`,
        dates: `${startDate}/${endDate}`,
        details:
            `Solicitud de atención para ${name}. ` +
            `La disponibilidad debe ser confirmada por WhatsApp.`,
        location: "Santiago de Chile"
    });

    calendarLink.href =
        `https://calendar.google.com/calendar/render?${calendarParameters}`;

    bookingDialog.showModal();
});

dialogClose.addEventListener("click", () => {
    bookingDialog.close();
});

bookingDialog.addEventListener("click", (event) => {
    const dialogPosition = bookingDialog.getBoundingClientRect();

    const clickedOutside =
        event.clientX < dialogPosition.left ||
        event.clientX > dialogPosition.right ||
        event.clientY < dialogPosition.top ||
        event.clientY > dialogPosition.bottom;

    if (clickedOutside) {
        bookingDialog.close();
    }
});
