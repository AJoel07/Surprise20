const SECRET_PASSWORD = "love";
const UNLOCK_KEY = "forYouUnlocked";

const songs = [
  {
    id: "1",
    title: "Perfect - Ed Sheeran",
    file:  "assets/Ed Sheeran - Perfect - Ringtone.mp3",
    note: ""
  },
  {
    id: "2",
    title: "Mudhal Nee Mudivum Nee",
    file:  "assets/mudhal nee mudivum nee.mp3",
    note: ""
  },
  {
    id: "3",
    title: "Aariro Aarariro",
    file:  "assets/aariro aarariro.mp3",
    note: ""
  },
  {
    id: "4",
    title: "Neeyum Naanum",
    file:  "assets/NEEYUM NAANUM.mp3",
    note: ""
  },
  {
    id: "5",
    title: "Pathavaikkum Paarvaikkaara",
    file:  "assets/pathavaikkum paarvaikaara.mp3",
    note: ""
  },
  {
    id: "6",
    title: "Un Viligalil",
    file:  "assets/un viligalil.mp3",
    note: ""
  },
  {
    id: "7",
    title: "Un Viligalil Viluntha Naatkalil",
    file:  "assets/un vilingalil viluntha naatkal.mp3",
    note: ""
  },
  {
    id: "8",
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
      window.location.href = "songs.html";
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
    const mediaType = song.file.toLowerCase().endsWith(".mp4")
      ? "audio/mp4"
      : "audio/mpeg";
    item.innerHTML = `
      <h2>${song.title}</h2>
      <audio controls preload="metadata">
        <source src="${song.file}" type="${mediaType}" />
        Your browser cannot play this track.
      </audio>
      <p class="song-note">${song.note}</p>
    `;
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
