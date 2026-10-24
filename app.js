(() => {
  const cad = (v) =>
    "C$" + Number(v).toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  let slots = [];
  let visible = [];
  let filter = "all";
  let type = "all";
  let query = "";
  let lbIndex = -1;
  let lastFocus = null;

  const grid = document.getElementById("grid");
  const progress = document.getElementById("progress");
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbTitle = document.getElementById("lb-title");
  const lbMeta = document.getElementById("lb-meta");
  const q = document.getElementById("q");

  function matches(s) {
    if (filter === "have" && !s.owned) return false;
    if (filter === "missing" && s.owned) return false;
    if (type === "base" && s.rh) return false;
    if (type === "rh" && !s.rh) return false;
    if (query) {
      const qq = query.toLowerCase();
      const hay = (s.no + " " + s.name + (s.rh ? " reverse rh" : "")).toLowerCase();
      if (!hay.includes(qq)) return false;
    }
    return true;
  }

  function render() {
    visible = slots.filter(matches);
    const have = slots.filter((s) => s.owned).length;
    const shownHave = visible.filter((s) => s.owned).length;
    progress.textContent = `${have} of ${slots.length} master set slots collected · showing ${visible.length} (${shownHave} owned)`;

    const frag = document.createDocumentFragment();
    visible.forEach((s, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "card" + (s.owned ? "" : " missing");
      btn.dataset.index = String(i);
      const label = s.rh ? `${s.no} ${s.name} reverse holo` : `${s.no} ${s.name}`;
      btn.setAttribute("aria-label", `${label}, ${s.owned ? "owned" : "missing"}, market ${cad(s.market)}`);
      btn.innerHTML = `
        <img class="art" src="${s.img}" alt="" loading="lazy" width="490" height="683" />
        ${s.rh ? '<span class="badge" aria-hidden="true">RH</span>' : ""}
        ${s.owned ? "" : '<span class="miss-tag" aria-hidden="true">MISSING</span>'}
        <span class="meta">
          <span class="no">${s.no}${s.rh ? " RH" : ""}</span>
          <span class="name">${s.name}</span>
          <span class="price">${cad(s.market)}</span>
        </span>`;
      btn.addEventListener("click", () => openLb(i));
      frag.appendChild(btn);
    });
    grid.replaceChildren(frag);
  }

  function openLb(i) {
    if (i < 0 || i >= visible.length) return;
    lastFocus = document.activeElement;
    lbIndex = i;
    const s = visible[i];
    lbImg.src = s.img;
    lbImg.alt = s.rh ? `${s.name} reverse holo` : s.name;
    lbTitle.textContent = `${s.no}${s.rh ? " RH" : ""} · ${s.name}`;
    lbMeta.textContent = `${s.owned ? "Collected" : "Not collected"} · market ${cad(s.market)}`;
    lightbox.hidden = false;
    lightbox.querySelector(".lb-close").focus();
  }

  function closeLb() {
    lightbox.hidden = true;
    lbIndex = -1;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function shiftLb(d) {
    if (lbIndex < 0 || !visible.length) return;
    openLb((lbIndex + d + visible.length) % visible.length);
  }

  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((b) => b.classList.toggle("active", b === btn));
      render();
    });
  });
  document.querySelectorAll("[data-type]").forEach((btn) => {
    btn.addEventListener("click", () => {
      type = btn.dataset.type;
      document.querySelectorAll("[data-type]").forEach((b) => b.classList.toggle("active", b === btn));
      render();
    });
  });
  q.addEventListener("input", () => {
    query = q.value.trim();
    render();
  });

  lightbox.querySelector(".lb-close").addEventListener("click", closeLb);
  lightbox.querySelector(".prev").addEventListener("click", () => shiftLb(-1));
  lightbox.querySelector(".next").addEventListener("click", () => shiftLb(1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLb();
  });
  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") shiftLb(-1);
    if (e.key === "ArrowRight") shiftLb(1);
  });

  fetch("data.json")
    .then((r) => r.json())
    .then((data) => {
      slots = data.slots;
      render();
    })
    .catch((err) => {
      progress.textContent = "Failed to load card data.";
      console.error(err);
    });
})();
