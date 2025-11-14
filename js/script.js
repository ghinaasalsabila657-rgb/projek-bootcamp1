document.addEventListener("DOMContentLoaded", () => {
  // =======================================================
  // I. VARIABEL (let/const) - Kriteria 3. Variables
  // =======================================================

  // A. Navbar (Hamburger Menu)
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const allNavLinks = document.querySelectorAll(".nav-links a");

  // B. Chatbot (Wajib Ditambahkan ke HTML)
  // Asumsi: Anda menambahkan elemen <div id="chatbot-popup"> dan <button id="open-chatbot-btn">
  const chatbotPopup = document.getElementById("chatbot-popup");
  const openChatbotBtn = document.getElementById("open-chatbot-btn");
  const closeChatbotBtn = document.getElementById("close-chatbot-btn");
  const chatInput = document.getElementById("chat-input");
  const sendButton = document.getElementById("send-button");
  const chatMessagesContainer = document.getElementById("chat-messages");

  // Variabel untuk status chatbot (opsional, untuk If-else sederhana)
  let isChatbotOpen = false;

  // =======================================================
  // II. FUNCTIONS & DOM MANIPULATION - Kriteria 3. Functions & DOM Manipulation
  // =======================================================

  // A. Fungsi Toggle Hamburger Menu
  function toggleMenu() {
    // DOM Manipulation: Menambah/menghapus class 'active'
    navLinks.classList.toggle("active");

    // Opsional: Mengubah ikon hamburger
    const icon = hamburger.querySelector("i");
    if (navLinks.classList.contains("active")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times"); // Ikon 'X' saat terbuka
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars"); // Ikon Hamburger saat tertutup
    }
  }

  // B. Fungsi Chatbot Logic - Kriteria 4. Chatbot 3 Varian Jawaban
  function processUserInput(message) {
    const lowerCaseMessage = message.toLowerCase().trim();
    let botResponse;

    // Kriteria 4: If-else statements untuk minimal 3 varian jawaban
    if (lowerCaseMessage.includes("halo") || lowerCaseMessage.includes("hai")) {
      // Varian 1: Sapaan dan memperkenalkan diri
      botResponse =
        "Halo! Saya GhinaBot. Ghina adalah Front-end Developer yang fokus pada estetika dan pengalaman pengguna.";
    } else if (
      lowerCaseMessage.includes("hobi") ||
      lowerCaseMessage.includes("minat")
    ) {
      // Varian 2: Informasi Hobi/Minat
      botResponse =
        "Ghina memiliki minat pada Desain Grafis, Teknologi Baru, dan Berpikir Kreatif. Cek bagian About untuk detailnya!";
    } else if (lowerCaseMessage.includes("javascript")) {
      // Varian 3: Jawaban Teknis / Skill
      botResponse =
        "JavaScript adalah bahasa utama yang Ghina gunakan untuk interaktivitas website ini (seperti saya!).";
    } else {
      // Jawaban default (fallback)
      botResponse =
        "Maaf, saya hanya bisa menjawab tentang Ghina, skill, dan kontak. Coba tanyakan itu!";
    }

    return botResponse;
  }

  // C. Fungsi DOM Manipulation untuk Chat
  function appendMessage(text, sender) {
    const messageElement = document.createElement("p");
    messageElement.classList.add(`${sender}-message`); // class: user-message atau bot-message
    messageElement.textContent = text;
    chatMessagesContainer.appendChild(messageElement);

    // Scroll ke pesan terbaru (DOM Manipulation)
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  }

  // D. Fungsi Utama Mengirim Pesan
  function sendMessage() {
    const userMessage = chatInput.value;

    if (userMessage.trim() === "") return;

    // Tampilkan pesan pengguna
    appendMessage(userMessage, "user");

    // Kosongkan input (DOM Manipulation)
    chatInput.value = "";

    // Dapatkan dan tampilkan respons bot
    const botReply = processUserInput(userMessage);

    // Jeda singkat 500ms agar interaksi terlihat natural
    setTimeout(() => {
      appendMessage(botReply, "bot");
    }, 500);
  }

  // E. Fungsi Toggle Popup Chatbot
  function toggleChatbot() {
    // Kriteria 3. If-else statements
    if (isChatbotOpen) {
      chatbotPopup.classList.remove("open");
      openChatbotBtn.style.display = "block";
      isChatbotOpen = false;
    } else {
      chatbotPopup.classList.add("open");
      openChatbotBtn.style.display = "none";
      isChatbotOpen = true;
    }
  }

  // =======================================================
  // III. EVENT LISTENERS - Kriteria 3. Event Listeners
  // =======================================================

  // A. Event Listener untuk Hamburger Menu
  hamburger.addEventListener("click", toggleMenu);

  // Menutup menu saat link diklik (untuk mobile experience)
  allNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      hamburger.querySelector("i").classList.remove("fa-times");
      hamburger.querySelector("i").classList.add("fa-bars");
    });
  });

  // B. Event Listener untuk Chatbot
  if (openChatbotBtn && closeChatbotBtn) {
    openChatbotBtn.addEventListener("click", toggleChatbot);
    closeChatbotBtn.addEventListener("click", toggleChatbot);
  }

  // C. Event Listener untuk Chat Input & Tombol Kirim
  if (sendButton && chatInput) {
    sendButton.addEventListener("click", sendMessage);

    chatInput.addEventListener("keypress", function (event) {
      // Cek apakah tombol yang ditekan adalah 'Enter'
      if (event.key === "Enter") {
        sendMessage();
      }
    });
  }
});
