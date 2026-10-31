const videoGrid = document.getElementById("videoGrid");
const emptyState = document.getElementById("emptyState");
const feedTitle = document.getElementById("feedTitle");

const uploadDialog = document.getElementById("uploadDialog");
const accountDialog = document.getElementById("accountDialog");
const playerDialog = document.getElementById("playerDialog");

const uploadOpen = document.getElementById("uploadOpen");
const accountOpen = document.getElementById("accountOpen");

const uploadForm = document.getElementById("uploadForm");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

let videos = [
  {
    title: "SHTBTube'a hoş geldin!",
    channel: "SHTBTube",
    category: "Eğlence",
    icon: "▶️",
    file: null
  },
  {
    title: "Yeni videolar burada!",
    channel: "SHTBTube",
    category: "Teknoloji",
    icon: "🚀",
    file: null
  },
  {
    title: "Kendi kanalını oluştur",
    channel: "SHTBTube",
    category: "Eğitim",
    icon: "🎬",
    file: null
  }
];

function renderVideos(list = videos) {
  videoGrid.innerHTML = "";

  emptyState.classList.toggle("hidden", list.length > 0);

  list.forEach((video, index) => {
    const card = document.createElement("div");
    card.className = "video-card";

    const thumb = document.createElement("div");
    thumb.className = "video-thumb";

    if (video.url) {
      const image = document.createElement("img");
      image.src = video.url;
      image.alt = video.title;
      thumb.appendChild(image);
    } else {
      thumb.textContent = video.icon || "▶️";
    }

    const info = document.createElement("div");
    info.className = "video-info";

    const avatar = document.createElement("div");
    avatar.className = "video-avatar";
    avatar.textContent = "S";

    const details = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = video.title;

    const channel = document.createElement("p");
    channel.textContent = video.channel;

    const category = document.createElement("p");
    category.textContent = video.category;

    details.append(title, channel, category);
    info.append(avatar, details);
    card.append(thumb, info);

    card.addEventListener("click", () => {
      openPlayer(video);
    });

    videoGrid.appendChild(card);
  });
}

function openPlayer(video) {
  const player = document.getElementById("player");
  const playerTitle = document.getElementById("playerTitle");
  const playerMeta = document.getElementById("playerMeta");

  player.pause();
  player.removeAttribute("src");

  if (video.file) {
    player.src = video.file;
    player.load();
  }

  playerTitle.textContent = video.title;
  playerMeta.textContent = video.channel + " • " + video.category;

  playerDialog.classList.remove("hidden");
}

uploadOpen.addEventListener("click", () => {
  uploadDialog.classList.remove("hidden");
});

accountOpen.addEventListener("click", () => {
  accountDialog.classList.remove("hidden");
});

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => {
    uploadDialog.classList.add("hidden");
    accountDialog.classList.add("hidden");
    playerDialog.classList.add("hidden");

    document.getElementById("player").pause();
  });
});

uploadForm.addEventListener("submit", event => {
  event.preventDefault();

  const title = document.getElementById("videoTitle").value.trim();
  const channel = document.getElementById("channelName").value.trim();
  const category = document.getElementById("videoCategory").value;
  const fileInput = document.getElementById("videoFile");

  if (!title || !channel || !fileInput.files.length) {
    alert("Lütfen tüm alanları doldur ve bir video seç.");
    return;
  }

  const file = fileInput.files[0];

  if (!file.type.startsWith("video/")) {
    alert("Lütfen geçerli bir video dosyası seç.");
    return;
  }

  const url = URL.createObjectURL(file);

  videos.unshift({
    title,
    channel,
    category,
    file: url,
    url
  });

  renderVideos();

  uploadForm.reset();
  uploadDialog.classList.add("hidden");

  alert("Video bu tarayıcıdaki önizleme listesine eklendi!");
});

searchForm.addEventListener("submit", event => {
  event.preventDefault();

  const query = searchInput.value.toLowerCase().trim();

  const filtered = videos.filter(video =>
    video.title.toLowerCase().includes(query) ||
    video.channel.toLowerCase().includes(query) ||
    video.category.toLowerCase().includes(query)
  );

  feedTitle.textContent = query ? "Arama sonuçları" : "Senin için";
  renderVideos(filtered);
});

document.querySelectorAll(".nav-item[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    const filter = button.dataset.filter;

    if (filter === "all") {
      feedTitle.textContent = "Senin için";
      renderVideos();
    } else {
      feedTitle.textContent = filter;
      renderVideos(videos.filter(video => video.category === filter));
    }
  });
});

renderVideos();
