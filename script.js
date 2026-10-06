const characters = [
  {
    name: "Animator",
    className: "THE STORYTELLER",
    color: "#a7baf7",
    description:
      "Give your imagination a life of its own. Create characters, build worlds, and tell stories one frame at a time.",
    skills: ["Animation", "Storyboarding", "3D creation"],
    details:
      "Explore character design, movement, and visual storytelling. Your next project could be a short animation, a game character, or an entire world of your own.",
  },
  {
    name: "Graphic designer",
    className: "THE VISIONARY",
    color: "#edb2cf",
    description:
      "Make ideas impossible to ignore. Bring colour, typography, and your unique point of view to everything you design.",
    skills: ["Visual design", "Typography", "Branding"],
    details:
      "Explore layouts, colour, and visual communication. Create a brand identity, design a poster series, or shape the look of your next big idea.",
  },
  {
    name: "Programmer",
    className: "THE BUILDER",
    color: "#8be5e7",
    description:
      "Turn a “what if” into something that works. Build apps, solve puzzles, and write the code behind your next big idea.",
    skills: ["Code", "Problem solving", "App development"],
    details:
      "Explore logic, creative coding, and interactive experiences. Build a website, prototype an app, or code a game that your friends can actually play.",
  },
  {
    name: "Roboticist",
    className: "THE INVENTOR",
    color: "#b8e5c1",
    description:
      "Bring your ideas into the real world. Connect code, circuits, and clever engineering to make things move.",
    skills: ["Robotics", "Electronics", "Engineering"],
    details:
      "Explore sensors, circuits, and automation. Design a robot, program its movements, and test how your invention responds to the world around it.",
  },
  {
    name: "Sound engineer",
    className: "THE SOUND MAKER",
    color: "#d3b5f5",
    description:
      "Find your frequency. Record, mix, and shape the sounds that make a story, a track, or a game unforgettable.",
    skills: ["Recording", "Mixing", "Sound design"],
    details:
      "Explore audio recording, production, and sound design. Produce a podcast, mix an original track, or create the soundtrack to a film or game.",
  },
  {
    name: "Video producer",
    className: "THE DIRECTOR",
    color: "#f1c393",
    description:
      "See the story nobody else sees. Get behind the camera and turn an everyday moment into something cinematic.",
    skills: ["Filmmaking", "Editing", "Storytelling"],
    details:
      "Explore camera work, editing, and production. Plan a short film, shoot a documentary, or bring a creative idea to life from the first storyboard to the final cut.",
  },
  {
    name: "UX designer",
    className: "THE CONNECTOR",
    color: "#efdb9a",
    description:
      "Make technology feel human. Design digital experiences that are intuitive, useful, and a joy to explore.",
    skills: ["User research", "Prototyping", "Interface design"],
    details:
      "Explore how people interact with technology. Sketch an interface, build a clickable prototype, and test your ideas to make everyday experiences better.",
  },
];
const imageNames = [
  "animator",
  "graphic-designer",
  "programmer",
  "roboticist",
  "sound-engineer",
  "video-producer",
  "ux-designer",
];
const roster = document.querySelector(".roster");
let selected = 0;
characters.forEach((character, index) => {
  const button = document.createElement("button");
  button.className = "character-card";
  button.id = `character-tab-${index}`;
  button.setAttribute("role", "tab");
  button.setAttribute("aria-controls", "pathway");
  button.style.setProperty(
    "--headshot-image",
    `url("assets/${imageNames[index]}-headshot.png")`,
  );
  button.style.setProperty("--card-accent", character.color);
  button.innerHTML = `<span class="portrait" aria-hidden="true"></span><span class="card-name">${character.name}</span>`;
  button.addEventListener("click", () => selectCharacter(index));
  button.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = (selected + 1) % characters.length;
    if (event.key === "ArrowLeft")
      next = (selected + characters.length - 1) % characters.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = characters.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectCharacter(next);
      roster.children[next].focus();
    }
  });
  roster.append(button);
});
function selectCharacter(index) {
  selected = index;
  const character = characters[index];
  document.documentElement.style.setProperty("--accent", character.color);
  const art = document.querySelector("#character-art");
  // Match each asset's canvas so wider characters retain the same display height.
  const artworkRatios = {
    programmer: "958 / 1642",
    roboticist: "897 / 1754",
  };
  art.style.aspectRatio = artworkRatios[imageNames[index]] || "296 / 759";
  art.style.backgroundImage = `url("assets/${imageNames[index]}.png")`;
  art.classList.remove("enter");
  void art.offsetWidth;
  art.classList.add("enter");
  const characterIndex = document.querySelector("#character-index");
  const classLabel = document.querySelector(".class-label");
  if (characterIndex) characterIndex.textContent = `0${index + 1}`;
  if (classLabel) classLabel.textContent = character.className;
  document.querySelector("#character-name").textContent = character.name;
  document.querySelector("#character-description").textContent =
    character.description;
  document.querySelector("#character-skills").replaceChildren(
    ...character.skills.map((skill) => {
      const li = document.createElement("li");
      li.textContent = skill;
      return li;
    }),
  );
  syncProjectSelection(index);
  document.querySelector("#pathway").setAttribute("role", "tabpanel");
  document
    .querySelector("#pathway")
    .setAttribute("aria-labelledby", `character-tab-${index}`);
  [...roster.children].forEach((button, i) => {
    button.setAttribute("aria-selected", String(i === index));
    button.tabIndex = i === index ? 0 : -1;
  });
}
selectCharacter(selected);
roster.children[selected].focus({ preventScroll: true });

function syncProjectSelection(index) {
  document.querySelectorAll("[data-project]").forEach((button) => {
    const active = Number(button.dataset.project) === index;
    button.setAttribute("aria-pressed", String(active));
    button.closest(".project-card").classList.toggle("is-selected", active);
    button.querySelector(".branch-status").textContent = active
      ? "Your branch"
      : "Explore ↗";
  });
  document.querySelector("#project-selection").textContent =
    `${characters[index].name}: your selected branch.`;
}
document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () =>
    selectCharacter(Number(button.dataset.project)),
  );
});
document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((filter) => {
      filter.setAttribute("aria-pressed", String(filter === button));
    });
    document.querySelectorAll("[data-work]").forEach((card) => {
      card.hidden =
        button.dataset.filter !== "all" &&
        card.dataset.work !== button.dataset.filter;
    });
  });
});
const story = document.querySelector(".program-story");
const miniLinks = [...document.querySelectorAll(".journey-nav a")];
const trackedStops = miniLinks.map((link) =>
  document.querySelector(link.getAttribute("href")),
);
let scrollQueued = false;
function updateJourneyProgress() {
  const rect = story.getBoundingClientRect();
  const progress = Math.max(
    0,
    Math.min(1, (window.innerHeight * 0.6 - rect.top) / rect.height),
  );
  story.style.setProperty("--journey-progress", progress);
  let active = trackedStops[0];
  for (const stop of trackedStops) {
    if (
      stop.getBoundingClientRect().top <= window.innerHeight * 0.45 &&
      stop.getBoundingClientRect().top > active.getBoundingClientRect().top
    )
      active = stop;
  }
  miniLinks.forEach((link, index) => {
    if (trackedStops[index] === active)
      link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  scrollQueued = false;
}
window.addEventListener(
  "scroll",
  () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(updateJourneyProgress);
    }
  },
  { passive: true },
);
window.addEventListener("resize", updateJourneyProgress);
updateJourneyProgress();

const scenes = [...document.querySelectorAll("[data-scene]")];
const sceneMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const sceneObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("reveal-pending");
        sceneObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);
scenes.forEach((scene) => {
  scene.classList.add("reveal-pending");
  sceneObserver.observe(scene);
});
function updateSceneDepth() {
  if (sceneMotion.matches) {
    scenes.forEach((scene) => scene.style.setProperty("--scene-shift", "0px"));
    return;
  }
  scenes.forEach((scene) => {
    const rect = scene.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const shift = Math.max(
        -12,
        Math.min(
          12,
          (rect.top + rect.height / 2 - window.innerHeight / 2) * 0.035,
        ),
      );
      scene.style.setProperty("--scene-shift", `${shift}px`);
    }
  });
}
let sceneFramePending = false;
window.addEventListener(
  "scroll",
  () => {
    if (!sceneFramePending) {
      sceneFramePending = true;
      requestAnimationFrame(() => {
        updateSceneDepth();
        sceneFramePending = false;
      });
    }
  },
  { passive: true },
);
window.addEventListener("resize", updateSceneDepth);
sceneMotion.addEventListener("change", updateSceneDepth);
updateSceneDepth();
