document.addEventListener("DOMContentLoaded", () => {
  // =======================================================
  // I. VARIABEL (let/const) - Kriteria 3. Variables
  // =======================================================

  // A. Navbar (Hamburger Menu)
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const allNavLinks = document.querySelectorAll(".nav-links a");

  // B. Chatbot Elements
  const chatContainer = document.getElementById("chatContainer");
  const chatbotToggle = document.getElementById("chatbotToggle");
  const minimizeBtn = document.getElementById("minimizeBtn");
  const chatMessages = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  const actionBtns = document.querySelectorAll(".action-btn");
  const notificationBadge = document.getElementById("notificationBadge");
  const typingIndicator = document.getElementById("typingIndicator");
  const quickActions = document.getElementById("quickActions");

  // Chatbot status variables
  let isOpen = false;
  let hasNotification = true;

  // =======================================================
  // II. FUNCTIONS & DOM MANIPULATION - Kriteria 3. Functions & DOM Manipulation
  // =======================================================

  // A. Fungsi Toggle Hamburger Menu
  function toggleMenu() {
    navLinks.classList.toggle("active");

    const icon = hamburger.querySelector("i");
    if (navLinks.classList.contains("active")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  }

  // B. STEP 3 REQUIREMENT: handleChatbot(message) Function with AI API

  // =======================================================
  // INPUT GUARDRAIL: Topic Checker Function
  // =======================================================

  /**
   * Checks if user's question is about allowed topics
   * Returns: { allowed: true/false, message: "response" }
   */
  function checkTopicAllowed(userMessage) {
    // Convert message to lowercase for easier matching
    const message = userMessage.toLowerCase();

    // ====================================
    // 1. ALLOWED TOPICS - Keywords to check
    // ====================================
    const allowedKeywords = {
      // About Ghina
      profile: ["ghina", "salsabila", "siapa", "about", "tentang", "profil"],

      // Skills & Technical
      skills: ["skill", "kemampuan", "keahlian", "bisa", "mahir", "expertise"],
      technical: [
        "html",
        "css",
        "javascript",
        "js",
        "coding",
        "programming",
        "ui",
        "ux",
        "design",
        "front-end",
        "frontend",
        "web",
      ],

      // Projects & Portfolio
      projects: [
        "proyek",
        "project",
        "portfolio",
        "karya",
        "pekerjaan",
        "work",
      ],

      // Contact Info
      contact: [
        "kontak",
        "contact",
        "hubungi",
        "email",
        "whatsapp",
        "wa",
        "instagram",
        "ig",
        "telepon",
        "phone",
      ],

      // Hobbies & Interests
      hobbies: [
        "hobi",
        "minat",
        "suka",
        "interest",
        "hobby",
        "hobbies",
        "passion",
        "interests",
      ],

      // Learning & Academic
      learning: [
        "belajar",
        "learn",
        "tutorial",
        "cara",
        "how",
        "bagaimana",
        "tips",
        "advice",
        "saran",
      ],

      // Greetings (always allowed)
      greetings: [
        "halo",
        "hai",
        "hello",
        "hi",
        "hey",
        "selamat",
        "good morning",
        "good afternoon",
        "pagi",
        "siang",
        "sore",
        "malam",
      ],
    };

    // ====================================
    // 2. FORBIDDEN TOPICS - Keywords to block
    // ====================================
    const forbiddenKeywords = {
      // Politics & Religion
      sensitive: [
        "politik",
        "politics",
        "agama",
        "religion",
        "pemilu",
        "election",
        "partai",
      ],

      // Harmful Content
      harmful: [
        "bunuh",
        "mati",
        "death",
        "kekerasan",
        "violence",
        "bom",
        "bomb",
        "senjata",
        "weapon",
      ],

      // Inappropriate
      inappropriate: [
        "pacaran",
        "pacar",
        "dating",
        "boyfriend",
        "girlfriend",
        "romantic",
        "sex",
        "dewasa",
      ],

      // Financial Scams
      financial: [
        "investasi",
        "investment",
        "crypto",
        "bitcoin",
        "trading",
        "uang cepat",
        "quick money",
        "mlm",
      ],

      // Academic Dishonesty
      cheating: [
        "kunci jawaban",
        "answer key",
        "contek",
        "cheat",
        "plagiat",
        "plagiarism",
        "jawaban ujian",
      ],

      // Personal/Sensitive Data
      sensitive_data: [
        "password",
        "pin",
        "ktp",
        "kartu kredit",
        "credit card",
        "nomor rekening",
        "account number",
      ],
    };

    // ====================================
    // 3. CHECK FOR FORBIDDEN TOPICS FIRST
    // ====================================

    // Loop through all forbidden categories
    for (let category in forbiddenKeywords) {
      const keywords = forbiddenKeywords[category];

      // Check if message contains any forbidden keyword
      for (let keyword of keywords) {
        if (message.includes(keyword)) {
          // BLOCKED! Return polite rejection message
          return {
            allowed: false,
            message: `Maaf, saya tidak dapat membantu dengan topik tersebut. Saya hanya dapat memberikan informasi tentang Ghina Salsabila, skill-nya, proyek-proyek, dan cara menghubunginya. Ada yang lain yang bisa saya bantu? 😊`,
          };
        }
      }
    }

    // ====================================
    // 4. CHECK FOR ALLOWED TOPICS
    // ====================================

    // Loop through all allowed categories
    for (let category in allowedKeywords) {
      const keywords = allowedKeywords[category];

      // Check if message contains any allowed keyword
      for (let keyword of keywords) {
        if (message.includes(keyword)) {
          // ALLOWED! Let the AI handle it
          return {
            allowed: true,
            message: null, // No blocking message needed
          };
        }
      }
    }

    // ====================================
    // 5. DEFAULT: If no keywords match
    // ====================================

    // Message doesn't clearly match allowed or forbidden topics
    // Give a helpful redirect message
    return {
      allowed: false,
      message: `Hmm, saya tidak yakin bagaimana menjawab itu. Saya di sini untuk membantu Anda mengenal Ghina Salsabila lebih baik!

Anda bisa bertanya tentang:
• Skill dan keahlian Ghina
• Proyek yang pernah dikerjakan
• Cara menghubungi Ghina
• Hobi dan minat Ghina

Silakan ajukan pertanyaan tentang topik di atas! 😊`,
    };
  }

  async function handleChatbot(message) {
    // 🛡️ INPUT GUARDRAIL: Check topic BEFORE calling AI
    const topicCheck = checkTopicAllowed(message);

    // If topic is NOT allowed, return the polite rejection message
    if (!topicCheck.allowed) {
      return topicCheck.message;
    }

    // If topic IS allowed, continue with AI API call
    try {
      const systemRules = `You are Assistant Holo, a friendly academic chatbot for Ghina Salsabila's portfolio website.

BEHAVIOR RULES:
1. ALLOWED TOPICS: Ghina's education, technical skills (HTML/CSS/JavaScript/UI-UX), projects, academic web development topics, contact info, hobbies, professional advice, learning resources.
2. FORBIDDEN TOPICS: Personal privacy beyond public info, harmful/illegal content, politics, religion, medical/legal advice, financial schemes, academic dishonesty, inappropriate content.
3. TONE: Friendly, professional, encouraging, clear, respectful, and positive.
4. LANGUAGE: Respond primarily in Indonesian (Bahasa Indonesia), support English if requested.
5. SAFETY: Never request sensitive data, warn about scams, maintain boundaries, admit limitations.

ABOUT GHINA:
- Student with deep interest in technology and UI design
- Front-end Developer: HTML, CSS, JavaScript, UI/UX Design
- Projects: Personal website, sentiment analyzer, UI/UX designs
- Interests: Graphic Design, technology, creative thinking, languages, journaling
- Contact: ghinaasalsabila657@gmail.com, +62 852-6434-9416, @ghinasln (Instagram)

Always respond helpfully and professionally in Indonesian.`;

      const response = await fetch(
        "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: {
              past_user_inputs: [],
              generated_responses: [],
              text: message,
            },
            parameters: {
              max_length: 200,
              temperature: 0.7,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      let botResponse;
      if (data.generated_text) {
        botResponse = data.generated_text;
      } else if (data[0] && data[0].generated_text) {
        botResponse = data[0].generated_text;
      } else {
        throw new Error("Unexpected API response format");
      }

      return botResponse;
    } catch (error) {
      console.error("AI API Error:", error);
      return getFallbackResponse(message);
    }
  }

  // Fallback function if API fails
  function getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("skill") ||
      lowerMessage.includes("kemampuan") ||
      lowerMessage.includes("keahlian")
    ) {
      return "Ghina memiliki skill dalam HTML & CSS untuk membangun struktur dan estetika visual website, JavaScript untuk menciptakan interaktivitas dan animasi, serta UI/UX Design untuk merancang antarmuka yang intuitif dan user-friendly.";
    } else if (
      lowerMessage.includes("proyek") ||
      lowerMessage.includes("project") ||
      lowerMessage.includes("portfolio")
    ) {
      return "Ghina telah mengerjakan berbagai proyek web development termasuk personal website dengan fitur sentiment analyzer, desain UI/UX, dan berbagai proyek front-end yang menggabungkan teknologi dengan estetika yang menarik.";
    } else if (
      lowerMessage.includes("hubungi") ||
      lowerMessage.includes("kontak") ||
      lowerMessage.includes("contact")
    ) {
      return "Anda bisa menghubungi Ghina melalui:\n📧 Email: ghinaasalsabila657@gmail.com\n📱 WhatsApp: +62 852-6434-9416\n📷 Instagram: @ghinasln";
    } else if (
      lowerMessage.includes("hobi") ||
      lowerMessage.includes("minat") ||
      lowerMessage.includes("interest") ||
      lowerMessage.includes("hobbies") ||
      lowerMessage.includes("interests")
    ) {
      return "Ghina memiliki hobi dalam Graphic Design, eksplorasi teknologi baru, Creative Thinking, belajar bahasa asing, dan journaling. Ia passionate dalam menciptakan pengalaman digital yang beautiful dan intuitif.";
    } else if (
      lowerMessage.includes("tentang") ||
      lowerMessage.includes("siapa") ||
      lowerMessage.includes("about")
    ) {
      return "Ghina Salsabila adalah seorang mahasiswa dengan minat mendalam dalam teknologi dan desain user interface. Fokus utamanya adalah front-end development, di mana ia menikmati proses mengubah ide desain menjadi website yang interaktif dan user-friendly.";
    } else if (
      lowerMessage.includes("halo") ||
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hai") ||
      lowerMessage.includes("hi")
    ) {
      return "Halo! 👋 Senang bertemu dengan Anda. Saya adalah Assistant Holo, siap membantu Anda mengenal Ghina lebih dalam. Ada yang bisa saya bantu?";
    } else if (
      lowerMessage.includes("terima kasih") ||
      lowerMessage.includes("thank")
    ) {
      return "Sama-sama! Senang bisa membantu. Jika ada pertanyaan lain tentang Ghina atau proyeknya, jangan ragu untuk bertanya! 😊";
    } else if (
      lowerMessage.includes("teknologi") ||
      lowerMessage.includes("technology")
    ) {
      return "Ghina memiliki minat besar dalam teknologi web, khususnya front-end development. Ia menguasai HTML, CSS, JavaScript, dan tertarik dengan teknologi UI/UX design untuk menciptakan pengalaman digital yang memorable.";
    } else {
      return "Terima kasih atas pertanyaannya! Saya di sini untuk membantu Anda mengenal Ghina Salsabila lebih baik. Silakan ajukan pertanyaan yang lain.";
    }
  }

  // =======================================================
  // COMPLETE INTEGRATION EXAMPLE
  // =======================================================

  // This shows the COMPLETE flow with the guardrail:

  async function sendMessage() {
    const message = chatInput.value.trim();

    if (message === "") return;

    // Hide quick actions
    if (quickActions && quickActions.style.display !== "none") {
      quickActions.style.display = "none";
    }

    // Display user message
    addMessage(message, true);

    // Clear input field
    chatInput.value = "";

    // Disable input while processing
    chatInput.disabled = true;
    if (sendBtn) sendBtn.disabled = true;

    // Show typing indicator
    showTypingIndicator();

    try {
      // 🛡️ Call handleChatbot (which now has the guardrail inside)
      const response = await handleChatbot(message);
      hideTypingIndicator();
      addMessage(response, false);
    } catch (error) {
      hideTypingIndicator();
      addMessage("Maaf, terjadi kesalahan. Silakan coba lagi.", false);
    } finally {
      // Re-enable input
      chatInput.disabled = false;
      if (sendBtn) sendBtn.disabled = false;
      chatInput.focus();
    }
  }

  // C. Display Message Function (DOM Manipulation)
  function addMessage(text, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${isUser ? "user" : "assistant"}`;

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = isUser ? "👤" : "🤖";

    const content = document.createElement("div");
    content.className = "message-content";
    content.textContent = text;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    if (typingIndicator) {
      chatMessages.insertBefore(messageDiv, typingIndicator);
    } else {
      chatMessages.appendChild(messageDiv);
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // D. Typing Indicator Functions
  function showTypingIndicator() {
    if (typingIndicator) {
      typingIndicator.classList.add("active");
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  function hideTypingIndicator() {
    if (typingIndicator) {
      typingIndicator.classList.remove("active");
    }
  }

  // E. STEP 3 REQUIREMENT: Send Message Function (async)
  async function sendMessage() {
    const message = chatInput.value.trim();

    if (message === "") return;

    // Hide quick actions after first user message
    if (quickActions && quickActions.style.display !== "none") {
      quickActions.style.display = "none";
    }

    // Display user message
    addMessage(message, true);

    // Clear input field
    chatInput.value = "";

    // Disable input while processing
    chatInput.disabled = true;
    if (sendBtn) sendBtn.disabled = true;

    // Show typing indicator
    showTypingIndicator();

    try {
      // STEP 3 REQUIREMENT: Call async handleChatbot(message) function
      const response = await handleChatbot(message);
      hideTypingIndicator();
      addMessage(response, false);
    } catch (error) {
      hideTypingIndicator();
      addMessage("Maaf, terjadi kesalahan. Silakan coba lagi.", false);
    } finally {
      // Re-enable input
      chatInput.disabled = false;
      if (sendBtn) sendBtn.disabled = false;
      chatInput.focus();
    }
  }

  // =======================================================
  // III. EVENT LISTENERS - Kriteria 3. Event Listeners
  // =======================================================

  // A. Hamburger Menu Event Listeners
  if (hamburger) {
    hamburger.addEventListener("click", toggleMenu);
  }

  if (allNavLinks) {
    allNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        const icon = hamburger.querySelector("i");
        if (icon) {
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
        }
      });
    });
  }

  // B. Chatbot Toggle Event Listeners
  if (chatbotToggle) {
    chatbotToggle.addEventListener("click", () => {
      isOpen = !isOpen;
      chatContainer.classList.toggle("active");

      if (isOpen && hasNotification && notificationBadge) {
        notificationBadge.style.display = "none";
        hasNotification = false;
      }
    });
  }

  if (minimizeBtn) {
    minimizeBtn.addEventListener("click", () => {
      isOpen = false;
      chatContainer.classList.remove("active");
    });
  }

  // C. STEP 2 REQUIREMENT: Send Button Event Listener
  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }

  // D. STEP 2 REQUIREMENT: Enter Key Event Listener
  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }

  // E. Quick Action Buttons Event Listeners
  if (actionBtns) {
    actionBtns.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const question = btn.getAttribute("data-question");

        if (quickActions) {
          quickActions.style.display = "none";
        }

        addMessage(question, true);

        // Disable input while processing
        chatInput.disabled = true;
        if (sendBtn) sendBtn.disabled = true;

        showTypingIndicator();

        try {
          // STEP 3 REQUIREMENT: Call async handleChatbot(message) function
          const response = await handleChatbot(question);
          hideTypingIndicator();
          addMessage(response, false);
        } catch (error) {
          hideTypingIndicator();
          addMessage("Maaf, terjadi kesalahan. Silakan coba lagi.", false);
        } finally {
          // Re-enable input
          chatInput.disabled = false;
          if (sendBtn) sendBtn.disabled = false;
        }
      });
    });
  }
});

// =======================================================
// SENTIMENT ANALYZER WIDGET
// =======================================================

// Modal Logic
function toggleSentimentModal() {
  const modal = document.getElementById("sentimentModalOverlay");
  if (modal) {
    modal.classList.toggle("active");

    if (modal.classList.contains("active")) {
      setTimeout(() => {
        const textInput = document.getElementById("textInput");
        if (textInput) textInput.focus();
      }, 100);
    }
  }
}

// Close modal when clicking outside
const sentimentModal = document.getElementById("sentimentModalOverlay");
if (sentimentModal) {
  sentimentModal.addEventListener("click", function (e) {
    if (e.target === this) {
      toggleSentimentModal();
    }
  });
}

// Close on Escape key
document.addEventListener("keydown", function (e) {
  const modal = document.getElementById("sentimentModalOverlay");
  if (e.key === "Escape" && modal && modal.classList.contains("active")) {
    toggleSentimentModal();
  }
});

// Sentiment Analysis Function
async function analyzeSentiment() {
  const textInput = document.getElementById("textInput");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const resultContainer = document.getElementById("result");
  const errorContainer = document.getElementById("error");
  const loadingDiv = document.getElementById("loading");

  if (!textInput) return;

  const text = textInput.value.trim();

  if (resultContainer) {
    resultContainer.classList.remove("show", "positive", "negative", "neutral");
  }
  if (errorContainer) {
    errorContainer.classList.remove("show");
  }

  const barFill = document.getElementById("barFill");
  if (barFill) {
    barFill.style.width = "0%";
  }

  if (!text) {
    if (errorContainer) {
      errorContainer.textContent = "Please enter text.";
      errorContainer.classList.add("show");
    }
    return;
  }

  if (analyzeBtn) {
    analyzeBtn.disabled = true;
    analyzeBtn.innerText = "Analyzing...";
  }
  if (loadingDiv) {
    loadingDiv.style.display = "block";
  }

  try {
    let result = await callHuggingFaceAPI(text);
    if (!result) result = clientSideSentimentAnalysis(text);
    displayResult(result.sentiment, result.icon, result.confidence);
  } catch (error) {
    const result = clientSideSentimentAnalysis(text);
    displayResult(result.sentiment, result.icon, result.confidence);
  } finally {
    if (analyzeBtn) {
      analyzeBtn.disabled = false;
      analyzeBtn.innerText = "Analyze Sentiment";
    }
    if (loadingDiv) {
      loadingDiv.style.display = "none";
    }
  }
}

async function callHuggingFaceAPI(text) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: text }),
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    if (data.error) return null;

    const top = data[0].reduce((p, c) => (p.score > c.score ? p : c));
    let sent = "neutral",
      icon = "😐";
    if (top.label === "POSITIVE") {
      sent = "positive";
      icon = "😄";
    } else if (top.label === "NEGATIVE") {
      sent = "negative";
      icon = "😔";
    }

    return { sentiment: sent, icon, confidence: top.score };
  } catch (e) {
    return null;
  }
}

function clientSideSentimentAnalysis(text) {
  const lower = text.toLowerCase();
  const posWords = [
    "good",
    "great",
    "love",
    "best",
    "happy",
    "cool",
    "nice",
    "excellent",
    "fantastic",
    "awesome",
  ];
  const negWords = [
    "bad",
    "terrible",
    "hate",
    "worst",
    "sad",
    "poor",
    "wrong",
    "awful",
    "mad",
    "angry",
  ];
  let p = 0,
    n = 0;

  posWords.forEach((w) => {
    if (lower.includes(w)) p++;
  });
  negWords.forEach((w) => {
    if (lower.includes(w)) n++;
  });

  if (p > n) return { sentiment: "positive", icon: "😄", confidence: 0.85 };
  if (n > p) return { sentiment: "negative", icon: "😔", confidence: 0.85 };
  return { sentiment: "neutral", icon: "😐", confidence: 0.6 };
}

function displayResult(sentiment, icon, confidence) {
  const resultContainer = document.getElementById("result");
  const sentimentIcon = document.getElementById("sentimentIcon");
  const sentimentLabel = document.getElementById("sentimentLabel");
  const confidenceLabel = document.getElementById("confidenceLabel");
  const barFill = document.getElementById("barFill");

  if (sentimentIcon) sentimentIcon.textContent = icon;
  if (sentimentLabel) sentimentLabel.textContent = sentiment;
  if (confidenceLabel)
    confidenceLabel.textContent = Math.round(confidence * 100) + "%";

  if (resultContainer) {
    resultContainer.classList.add("show", sentiment);
  }

  if (barFill) {
    setTimeout(() => (barFill.style.width = confidence * 100 + "%"), 100);
  }
}
