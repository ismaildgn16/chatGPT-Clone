//! HTML'den gelenler
const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const defaultText = document.querySelector(".default-text");
const deleteButton = document.querySelector("#delete-btn");
const container = document.querySelector(".container");

let userText = null;

//! Fonksiyonlar

//* Gönderdiğimiz html ve class ismine göre bize bir html oluşturur.
const createElement = (html, className) => {
  //* Yeni div oluştur.
  const chatDiv = document.createElement("div");

  //* Bu oluşturduğumuz dive chat ve dışarıdan parametre olarak gelen classı ekle.
  chatDiv.classList.add("chat", className);

  //* Oluşturduğumuz divin içerisine dışardan parametre olarak gelen html parametresini ekle.
  chatDiv.innerHTML = html;

  return chatDiv;
};

const getChatResponse = async (incomingChatDiv) => {
  const pElement = document.createElement("p");
  //* 1. adım: url'yi tanımla
  const url = "https://chatgpt-42.p.rapidapi.com/geminipro";

  //* 2. adım: options'u tanımla
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": "cf75691896msh4dfa17482ace454p12a963jsn80d87aaae04f",
      "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: `${userText}`,
        },
      ],
      temperature: 0.9,
      top_k: 5,
      top_p: 0.9,
      max_tokens: 256,
      web_access: false,
    }),
  };

  //* 3. adım: API'ye istek at
  try {
    //* API'ye url'i ve options'u kullanarak istek at ve bekle
    const response = await fetch(url, options);

    //* Gelen cevabı json'a çevir ve bekle
    const data = await response.json();

    //* API'den gelen cevabı oluşturduğumuz p etiketinin içerisine aktar.
    pElement.innerText = data.result;
  } catch (error) {
    //* hata varsa yakalar
    console.log(error);
  }

  //* Animasyonu kaldırabilmek için querySelector ile seçtik ve ekrandan remove ile kaldırdık.
  incomingChatDiv.querySelector(".typing-animation").remove();
  //* detail içerisine oluşturduğumuz pElement etiketini aktardık.
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);

  chatInput.value = null;
  savaChatHistory();
};

const showTypingAnimation = () => {
  const html = `
        <div class="chat-content">
            <div class="chat-details">
                <img src="./images/chatbot.jpg" alt="" />
                <div class="typing-animation">
                <div class="typing-dot" style="--delay: 0.2s"></div>
                <div class="typing-dot" style="--delay: 0.3s"></div>
                <div class="typing-dot" style="--delay: 0.4s"></div>
                </div>
            </div>
        </div>
    `;

  const incomingChatDiv = createElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  getChatResponse(incomingChatDiv);
};

const handleOutGoingChat = () => {
  //* Inputun içerisindeki değeri al ve fazladan bulunan boşlukları sil.
  userText = chatInput.value.trim();

  //* Inputun içerisinde veri yoksa fonksiyonu burada durdur ve ekrana alert bas.
  if (!userText) {
    alert("Lütfen bir şeyler aratın!");
    return;
  }

  const html = `
    <div class="chat-content">
        <div class="chat-details">
            <img src="./images/user.jpg" alt="" />
            <p>react nedir</p>
        </div>
    </div>`;
  const outgoingChatDiv = createElement(html, "outgoing");
  defaultText.remove();
  outgoingChatDiv.querySelector("p").textContent = userText;
  chatContainer.appendChild(outgoingChatDiv);
  setTimeout(showTypingAnimation, 500);
};

//! Olay İzleyicileri

sendButton.addEventListener("click", handleOutGoingChat);

//* Klavyeden "enter" tuşuna basıldığı anda handleOutGoingChat fonksiyonu çalışır.
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleOutGoingChat();
  }
});

//* themeButton'a her tıkladığımızda light-mode classını ekle ve çıkar.
themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  //* body light-mode class'ını içeriyorsa themeButton içerisindeki yazıyı dark_mode yap içermiyorsa light_mode yap.
  themeButton.innerText = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light_mode";
});

deleteButton.addEventListener("click", () => {
  /*
   * Confirm ile ekrana bir mesaj bastırdık. Confirm bize true ve false değerleri dönderir.
   * Tamam tuşuna basıldığında true iptal tuşuna basıldığında false dönderir.
   */
  if (confirm("Tüm sohbeti silmek istediğinizden emin misiniz?")) {
    chatContainer.remove();
    localStorage.removeItem("chatHistory");
  }

  const defaultText = `
    <div class="default-text">
      <h1>ChatGPT Clone</h1>
    </div>
    <div class="chat-container"></div>
     <div class="typing-container">
      <div class="typing-content">
        <div class="typing-textarea">
          <textarea
            id="chat-input"
            placeholder="Ne aratmak istersiniz..."
          ></textarea>
          <span class="material-symbols-outlined" id="send-btn"> send </span>
        </div>
        <div class="typing-controls">
          <span class="material-symbols-outlined" id="theme-btn">
            light_mode
          </span>
          <span class="material-symbols-outlined" id="delete-btn">
            delete
          </span>
        </div>
      </div>
    </div>
    `;
  document.body.innerHTML = defaultText;
});

//* Local Storage'a veriyi ekleme
const savaChatHistory = () => {
  localStorage.setItem("chatHistory", chatContainer.innerHTML);
};

const loadChatContainer = () => {
  const chatHistory = localStorage.getItem("chatHistory");
  if (chatHistory) {
    chatContainer.innerHTML = chatHistory;
    defaultText.remove();
  }
};

document.addEventListener("DOMContentLoaded", loadChatContainer);
