const SECRET_PASSWORD = "love";
const UNLOCK_KEY = "forYouUnlocked";
let activeSongPlayer = null;

const songs = [
  {
    id: "1",
    title: "Mudhal Nee Mudivum Nee",
    file:  "assets/mudhal nee mudivum nee.mp3",
    note: ""
  },
  {
    id: "2",
    title: "Aariro Aarariro",
    file:  "assets/aariro aarariro.mp3",
    note: ""
  },
  {
    id: "3",
    title: "Neeyum Naanum",
    file:  "assets/NEEYUM NAANUM.mp3",
    note: ""
  },
  {
    id: "4",
    title: "Pathavaikkum Paarvaikkaara",
    file:  "assets/pathavaikkum paarvaikaara.mp3",
    note: ""
  },
  {
    id: "5",
    title: "Un Viligalil",
    file:  "assets/un viligalil.mp3",
    note: ""
  },
  {
    id: "6",
    title: "Un Viligalil Viluntha Naatkalil",
    file:  "assets/un vilingalil viluntha naatkal.mp3",
    note: ""
  },
  {
    id: "7",
    title: "kaadhal Aasai",
    file:  "assets/Kaadhal aasai.mp4",
    note: ""
  },
  
];

const notes = [
  {
    id: 1,
    text: "Yeno theriyavillai unnidam mattum meendum meendum tholaigiren ! Tholaiven endru arinthum unnul tholaiya yengugiren ! Unnal mattume ennai kandupidikka koodum ! Ennai kandupidithalum neeyae vaithukol ! ippadikku unnul tholaintha naan <3"
  },
  {
    id: 2,
    text: "Unnodu naan vaala oru nooru aandugal pothathae ! Oru aayiram yugangal thanthaalum en yaekkangal theerathae !"
  },
  {
    id: 3,
    text: "Idhu varaiyil un ninaivil ! Ippotho satru tholaivil ! Iniyo un arugil ! Endrum unnudayathaaga ! Unakkaaga !"
  },
  {
    id: 4,
    text: "Naan paarthu rasitha kangal ! Ennai paartha kangal ! Enakkai alutha kangal ! Ennal alutha kangal ! Ennai thediya kangal ! Naan thedum Kangal ! En algiyin kangal ! En algiya kangal ! Avalathu kangal !"
  },
  {
    id: 5,
    text: "Unnudan kalitha naatkal ellam nodigaladi ! Nee illatha nodigal ellam varudamadi ! Eppothu servaen unnidam yengugirathu en nejamadi ! Un malalai pechin kural ennullae thonikuthadi ! Nee arugil illathapothellam en ullae noguthadi ! En vaalvin nodigalo nimidamo varudamo yugamo ! endrum en uyir moochu neeyadi !"
  },
  {
    id: 6,
    text: "Thediyum kidaikaathu endru ninaithathu ! kidaithum nadakkaathu endru ninaithathu ! Nadanthum urimaiyaagathu endru ninaithathu ! Ennudaiyathaaga ! En urimaiyaaga ! Oor ariya epothu maarum ! Kaalam kadanthum kaathiruppen unakaaga mattum <3 "
  },
  {
    id: 7,
    text: "Un netriyin oramaai aadiya otrai mudi ! Un kangalil varuda ! Un kanangalil thavala ! Un siriya malalai kaigalal un kaadhin oram nagatra ! Un otrai mudiyil en uyirai thulaithen ! Siru asaivil en idhayathai thirudinai ! En uyirai thulaitha unnidam ennai thulaithen ! Theda manathillai ! Thediyum kidaikaatha aalathil dhinamum thulaiya virumbugiren !"
  },
];

const getVisibleNotes = () => notes.filter((note) => note.text.trim());

const page = document.body.dataset.page || "";

const isUnlocked = () => sessionStorage.getItem(UNLOCK_KEY) === "true";

const protectPage = () => {
  if (page !== "gate" && !isUnlocked()) {
    window.location.href = "index.html";
  }
};

const emojiCache = {};
const emojisList = ['🎈', '🎂', '🎁', '🎉', '💖', '✨', '⭐'];

const initEmojiCache = () => {
  const size = 64; // Reference high-res size
  emojisList.forEach((emoji) => {
    const offscreen = document.createElement("canvas");
    offscreen.width = size;
    offscreen.height = size;
    const oCtx = offscreen.getContext("2d");
    oCtx.font = `${size - 16}px sans-serif`;
    oCtx.textAlign = "center";
    oCtx.textBaseline = "middle";
    oCtx.fillText(emoji, size / 2, size / 2);
    emojiCache[emoji] = offscreen;
  });
};

// Initialize cache immediately on script execution
initEmojiCache();

class Particle {
  constructor(x, y, type, color, emoji) {
    this.x = x;
    this.y = y;
    this.type = type; // 'emoji' or 'shape'
    this.color = color;
    this.emoji = emoji;
    this.size = type === 'emoji' ? Math.random() * 12 + 10 : Math.random() * 8 + 4;
    
    // Spread in all directions
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 10 + 4;
    this.speedX = Math.cos(angle) * velocity;
    this.speedY = Math.sin(angle) * velocity - 3; // slight upward force
    
    this.gravity = 0.15;
    this.opacity = 1;
    this.decay = Math.random() * 0.012 + 0.008;
    this.rotation = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.15;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += this.gravity;
    this.opacity -= this.decay;
    this.rotation += this.spin;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.type === 'emoji') {
      const cachedCanvas = emojiCache[this.emoji];
      if (cachedCanvas) {
        const renderSize = this.size * 2;
        ctx.drawImage(cachedCanvas, -renderSize / 2, -renderSize / 2, renderSize, renderSize);
      } else {
        ctx.font = `${this.size * 2}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.emoji, 0, 0);
      }
    } else {
      ctx.fillStyle = this.color;
      const shapeType = this.emoji; // reuse emoji slot for shape name
      if (shapeType === 'heart') {
        ctx.beginPath();
        const d = this.size;
        ctx.moveTo(0, d / 4);
        ctx.quadraticCurveTo(-d / 2, -d / 2, -d, d / 4);
        ctx.quadraticCurveTo(-d, d, 0, d * 1.3);
        ctx.quadraticCurveTo(d, d, d, d / 4);
        ctx.quadraticCurveTo(d / 2, -d / 2, 0, d / 4);
        ctx.closePath();
        ctx.fill();
      } else if (shapeType === 'star') {
        ctx.beginPath();
        const spikes = 5;
        const outerRadius = this.size;
        const innerRadius = this.size / 2;
        let rot = Math.PI / 2 * 3;
        let sx = 0;
        let sy = 0;
        const step = Math.PI / spikes;

        ctx.moveTo(0, -outerRadius);
        for (let i = 0; i < spikes; i++) {
          sx = Math.cos(rot) * outerRadius;
          sy = Math.sin(rot) * outerRadius;
          ctx.lineTo(sx, sy);
          rot += step;

          sx = Math.cos(rot) * innerRadius;
          sy = Math.sin(rot) * innerRadius;
          ctx.lineTo(sx, sy);
          rot += step;
        }
        ctx.lineTo(0, -outerRadius);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.restore();
  }
}

const triggerBlast = () => {
  const overlay = document.getElementById("unlock-overlay");
  const canvas = document.getElementById("blast-canvas");
  if (!overlay || !canvas) return;

  overlay.style.display = "flex";
  // Force browser reflow to allow opacity transition
  overlay.offsetHeight;
  overlay.classList.add("active");

  const ctx = canvas.getContext("2d");
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const particles = [];
  const emojisList = ['🎈', '🎂', '🎁', '🎉', '💖', '✨', '⭐'];
  const shapeColors = ["#d94f8a", "#f6aac8", "#cbb7ff", "#ffd4bd", "#bdebd6", "#e8b95b", "#ffffff"];
  const shapes = ['heart', 'star', 'dot'];

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Spawn 150 burst particles
  for (let i = 0; i < 150; i++) {
    const isEmoji = Math.random() > 0.45;
    if (isEmoji) {
      const emoji = emojisList[Math.floor(Math.random() * emojisList.length)];
      particles.push(new Particle(centerX, centerY, 'emoji', '', emoji));
    } else {
      const color = shapeColors[Math.floor(Math.random() * shapeColors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      particles.push(new Particle(centerX, centerY, 'shape', color, shape));
    }
  }

  let animationFrameId;
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);

      if (p.opacity <= 0) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationFrameId);
    }
  };

  animate();

  // Allow clicking anywhere to redirect after a short delay (prevent accidental double tap)
  let allowDismiss = false;
  setTimeout(() => {
    allowDismiss = true;
  }, 600);

  let keydownHandler;
  const dismissAndRedirect = () => {
    if (!allowDismiss) return;
    window.removeEventListener("resize", resizeCanvas);
    document.removeEventListener("keydown", keydownHandler);
    document.body.classList.add("page-exit-transition");
    setTimeout(() => {
      window.location.href = "songs.html";
    }, 500);
  };

  keydownHandler = (e) => {
    if (["Enter", " ", "Escape"].includes(e.key)) {
      dismissAndRedirect();
    }
  };

  overlay.addEventListener("click", dismissAndRedirect);
  document.addEventListener("keydown", keydownHandler);
};

const initGate = () => {
  const unlockBtn = document.getElementById("unlock-btn");
  const passwordInput = document.getElementById("password");
  const gateError = document.getElementById("gate-error");

  if (!unlockBtn || !passwordInput) return;

  if (isUnlocked()) {
    window.location.href = "songs.html";
    return;
  }

  const unlockGate = () => {
    const input = passwordInput.value.trim().toLowerCase();
    if (input === SECRET_PASSWORD) {
      sessionStorage.setItem(UNLOCK_KEY, "true");
      gateError.textContent = "";
      
      const gateCard = document.querySelector(".gate-card");
      if (gateCard) {
        gateCard.classList.add("fade-out");
        setTimeout(() => {
          triggerBlast();
        }, 300);
      } else {
        triggerBlast();
      }
    } else {
      gateError.textContent = "That word does not feel right. Try again.";
    }
  };

  unlockBtn.addEventListener("click", unlockGate);
  passwordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") unlockGate();
  });
};

const initMusic = () => {
  const music = document.getElementById("bg-music");
  const musicToggle = document.getElementById("music-toggle");
  if (!music || !musicToggle) return;

  musicToggle.addEventListener("click", () => {
    if (music.paused) {
      music
        .play()
        .then(() => {
          musicToggle.textContent = "Pause Music";
          musicToggle.setAttribute("aria-pressed", "true");
        })
        .catch(() => {
          musicToggle.textContent = "Tap to Play";
        });
    } else {
      music.pause();
      musicToggle.textContent = "Play Music";
      musicToggle.setAttribute("aria-pressed", "false");
    }
  });
};

const renderSongs = () => {
  const songsList = document.getElementById("songs-list");
  if (!songsList) return;

  const songSearch = document.getElementById("song-search");
  const searchTerm = songSearch ? songSearch.value.trim().toLowerCase() : "";
  const visibleSongs = songs.filter((song) => {
    const hasSong = song.title && song.file;
    const matchesSearch = song.title.toLowerCase().includes(searchTerm);
    return hasSong && matchesSearch;
  });

  songsList.innerHTML = "";

  if (visibleSongs.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = searchTerm
      ? "No songs found with that title."
      : "Songs will appear here once they are added.";
    songsList.appendChild(emptyState);
    return;
  }

  visibleSongs.forEach((song) => {
    const item = document.createElement("article");
    item.className = "song-item";
    item.id = song.id;
    item.innerHTML = `
      <h2>${song.title}</h2>
      <button class="btn small song-play" type="button" aria-pressed="false">Play song</button>
      <div class="song-player" aria-live="polite"></div>
      <p class="song-note">${song.note}</p>
    `;

    const playButton = item.querySelector(".song-play");
    const playerSlot = item.querySelector(".song-player");

    playButton.addEventListener("click", () => {
      if (activeSongPlayer?.item !== item) {
        if (activeSongPlayer) {
          activeSongPlayer.audio.pause();
          activeSongPlayer.button.textContent = "Play song";
          activeSongPlayer.button.setAttribute("aria-pressed", "false");
        }

        const audio = document.createElement("audio");
        audio.controls = true;
        audio.preload = "none";
        audio.src = song.file;
        playerSlot.replaceChildren(audio);
        activeSongPlayer = { item, audio, button: playButton };

        audio.addEventListener("pause", () => {
          if (!audio.ended) {
            playButton.textContent = "Play song";
            playButton.setAttribute("aria-pressed", "false");
          }
        });
        audio.addEventListener("ended", () => {
          playButton.textContent = "Play song";
          playButton.setAttribute("aria-pressed", "false");
        });
        audio.addEventListener("error", () => {
          playButton.textContent = "Unable to play";
          playButton.setAttribute("aria-pressed", "false");
          playerSlot.textContent = "This track could not be loaded.";
          activeSongPlayer = null;
        });
      }

      const { audio } = activeSongPlayer;
      if (audio.paused) {
        audio.play().then(() => {
          playButton.textContent = "Pause song";
          playButton.setAttribute("aria-pressed", "true");
        }).catch(() => {
          playButton.textContent = "Tap to play";
        });
      } else {
        audio.pause();
      }
    });
    songsList.appendChild(item);
  });
};

const initSongSearch = () => {
  const songSearch = document.getElementById("song-search");
  if (!songSearch) return;

  songSearch.addEventListener("input", renderSongs);
};

const renderNotes = () => {
  const notesList = document.getElementById("notes-list");
  if (!notesList) return;

  const visibleNotes = getVisibleNotes();

  notesList.innerHTML = "";

  if (visibleNotes.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "Notes will appear here once they are added.";
    notesList.appendChild(emptyState);
    return;
  }

  visibleNotes.forEach((note, index) => {
    const item = document.createElement("article");
    item.className = "message-card typewriter";
    item.id = String(note.id);
    item.dataset.noteId = String(note.id);
    item.dataset.noteNumber = String(index + 1).padStart(2, "0");
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");
    item.setAttribute("aria-label", "Open this note");

    const text = document.createElement("p");
    text.dataset.text = note.text;
    item.appendChild(text);

    notesList.appendChild(item);
  });
};

const initNoteFocus = () => {
  const notesList = document.getElementById("notes-list");
  if (!notesList) return;

  const focusOverlay = document.createElement("div");
  focusOverlay.className = "note-focus-overlay";
  focusOverlay.setAttribute("aria-hidden", "true");
  focusOverlay.innerHTML = `
    <div class="crystal-heart-field" aria-hidden="true"></div>
    <button class="note-focus-nav previous" type="button" aria-label="Previous note">&lsaquo;</button>
    <article class="note-focus-card" role="dialog" aria-modal="true" aria-label="Opened note">
      <button class="note-focus-close" type="button" aria-label="Close note">&times;</button>
      <p></p>
    </article>
    <button class="note-focus-nav next" type="button" aria-label="Next note">&rsaquo;</button>
  `;
  document.body.appendChild(focusOverlay);

  const heartField = focusOverlay.querySelector(".crystal-heart-field");
  const focusCard = focusOverlay.querySelector(".note-focus-card");
  const focusText = focusCard.querySelector("p");
  const closeBtn = focusOverlay.querySelector(".note-focus-close");
  const previousBtn = focusOverlay.querySelector(".previous");
  const nextBtn = focusOverlay.querySelector(".next");
  let activeIndex = -1;
  let lastFocusedElement = null;
  let touchStartX = 0;
  let touchStartY = 0;

  for (let index = 0; index < 18; index += 1) {
    const heart = document.createElement("span");
    heart.className = "crystal-heart";
    heart.style.setProperty("--x", `${8 + ((index * 19) % 84)}%`);
    heart.style.setProperty("--delay", `${index * -0.45}s`);
    heart.style.setProperty("--duration", `${13 + (index % 6)}s`);
    heart.style.setProperty("--size", `${10 + (index % 4) * 3}px`);
    heartField.appendChild(heart);
  }

  const showNote = (index) => {
    const visibleNotes = getVisibleNotes();
    if (!visibleNotes.length) return;

    if (activeIndex === -1) lastFocusedElement = document.activeElement;
    activeIndex = (index + visibleNotes.length) % visibleNotes.length;
    const activeNoteText = visibleNotes[activeIndex].text;
    focusCard.dataset.noteNumber = String(activeIndex + 1).padStart(2, "0");
    focusCard.classList.toggle("is-long-note", activeNoteText.length > 180);
    focusCard.classList.toggle("is-medium-note", activeNoteText.length > 95 && activeNoteText.length <= 180);
    focusText.textContent = activeNoteText;
    focusOverlay.classList.add("is-visible");
    focusOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("note-focus-open");
    closeBtn.focus();
  };

  const closeNote = () => {
    activeIndex = -1;
    focusOverlay.classList.remove("is-visible");
    focusOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("note-focus-open");
    if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
    lastFocusedElement = null;
  };

  const moveNote = (direction) => {
    if (activeIndex === -1) return;
    showNote(activeIndex + direction);
  };

  notesList.addEventListener("click", (event) => {
    const card = event.target.closest(".message-card");
    if (!card) return;

    const visibleNotes = getVisibleNotes();
    const nextIndex = visibleNotes.findIndex((note) => String(note.id) === card.dataset.noteId);
    if (nextIndex !== -1) showNote(nextIndex);
  });

  notesList.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const card = event.target.closest(".message-card");
    if (!card) return;

    event.preventDefault();
    const visibleNotes = getVisibleNotes();
    const nextIndex = visibleNotes.findIndex((note) => String(note.id) === card.dataset.noteId);
    if (nextIndex !== -1) showNote(nextIndex);
  });

  focusOverlay.addEventListener("click", (event) => {
    if (event.target === focusOverlay || event.target === heartField) closeNote();
  });

  focusCard.addEventListener("click", (event) => event.stopPropagation());
  closeBtn.addEventListener("click", closeNote);
  previousBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    moveNote(-1);
  });
  nextBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    moveNote(1);
  });

  focusOverlay.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
  });

  focusOverlay.addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) < 48 || Math.abs(diffX) < Math.abs(diffY)) return;
    moveNote(diffX < 0 ? 1 : -1);
  });

  document.addEventListener("keydown", (event) => {
    if (activeIndex === -1) return;

    if (event.key === "Escape") closeNote();
    if (event.key === "ArrowLeft") moveNote(-1);
    if (event.key === "ArrowRight") moveNote(1);
  });
};

const initTypewriter = () => {
  const typewriterCards = document.querySelectorAll(".typewriter p");
  typewriterCards.forEach((node) => {
    const text = node.dataset.text || "";
    node.textContent = "";
    let index = 0;

    const type = () => {
      if (index < text.length) {
        node.textContent += text.charAt(index);
        index += 1;
        setTimeout(type, 25);
      }
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            type();
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
  });
};

const initHearts = () => {
  document.addEventListener("click", (event) => {
    if (event.target.closest("button, a, input, audio, .note-focus-overlay")) return;

    const heart = document.createElement("span");
    heart.className = "heart";
    heart.style.left = `${event.clientX - 6}px`;
    heart.style.top = `${event.clientY - 6}px`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2000);
  });
};

protectPage();
initGate();
initMusic();
renderSongs();
initSongSearch();
renderNotes();
initNoteFocus();
initTypewriter();
initHearts();
