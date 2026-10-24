/* ScienceHub.io Phase 1 progressive enhancement.
   Existing framework and academic engine remain in place.
   Offline chat is explicitly a local fallback, not a claimed AI connection. */
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({
  "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
}[c]));
const ICON_FRONT = "./11_VISUAL-INTEGRATION__SCIENCEHUB-FRONTEND-APP-ICON.png";
const ICON_INTERNAL = "./11_VISUAL-INTEGRATION__SCIENCEHUB-INTERNAL-APP-ICON.png";
const ICON_SUkoon = "./12_SUKOON-BRAIN-REALTIME-ICON.png";
const UPMSP_URL = "https://upmsp.edu.in/Board_Syllabus.aspx";
const NCERT_URL = "https://ncert.nic.in/textbook.php";

const subjectsByClass = {
  "11": [
    ["phy","Physics"], ["chem","Chemistry"], ["bio","Biology"],
    ["eng","English"], ["hin","Hindi"]
  ],
  "12": [
    ["phy12","Physics"], ["chem12","Chemistry"], ["bio12","Biology"],
    ["eng12","English"], ["hin12","Hindi"]
  ]
};

function currentClass() {
  return $("#classSelect")?.value || localStorage.getItem("sciencehub.phase1.class") || "11";
}
function remember(key, value) {
  try { localStorage.setItem("sciencehub.phase1." + key, value); } catch {}
}
function read(key, fallback = "") {
  try { return localStorage.getItem("sciencehub.phase1." + key) || fallback; } catch { return fallback; }
}

function enhanceHeader() {
  const top = $(".top");
  if (!top || $("#phase1BoardSelect")) return;
  const brand = $(".brand", top);
  if (brand) {
    brand.innerHTML = `<img class="sh-brand-icon" src="${ICON_INTERNAL}" alt="ScienceHub.io logo"><span>ScienceHub.io</span>`;
    brand.setAttribute("aria-label", "ScienceHub.io");
  }
  const toolbar = $(".toolbar", top);
  if (!toolbar) return;

  const board = document.createElement("select");
  board.id = "phase1BoardSelect";
  board.setAttribute("aria-label", "Board");
  board.innerHTML = `<option value="UP Board">UP Board</option>`;
  board.value = "UP Board";
  board.title = "UP Board is the first supported board";
  board.addEventListener("change", () => {
    remember("board", board.value);
    const status = $("#phase1SelectionStatus");
    if (status) status.textContent = "Board saved: " + board.value;
  });

  const subject = document.createElement("select");
  subject.id = "phase1SubjectSelect";
  subject.setAttribute("aria-label", "Quick subject selection");
  subject.innerHTML = `<option value="">Choose subject…</option>` +
    subjectsByClass[currentClass()].map(([id, name]) => `<option value="${id}">${name}</option>`).join("");
  subject.addEventListener("change", () => {
    const id = subject.value;
    if (!id) return;
    remember("subject", id);
    const learningNav = $('[data-route="Learning"]');
    if (learningNav) learningNav.click();
    window.setTimeout(() => {
      const target = $(`[data-subject="${CSS.escape(id)}"]`);
      if (target) target.click();
      else {
        const status = $("#phase1SelectionStatus");
        if (status) status.textContent = "Open Learning to choose this subject.";
      }
    }, 120);
  });

  const classSelect = $("#classSelect", toolbar);
  if (classSelect) {
    classSelect.addEventListener("change", () => {
      const next = subjectsByClass[currentClass()] || subjectsByClass["11"];
      subject.innerHTML = `<option value="">Choose subject…</option>` +
        next.map(([id, name]) => `<option value="${id}">${name}</option>`).join("");
      subject.value = "";
      remember("class", currentClass());
    });
  }
  toolbar.insertBefore(board, toolbar.firstChild);
  toolbar.insertBefore(subject, board.nextSibling);
  if (!$("small.phase1-selection-status", top)) {
    const status = document.createElement("small");
    status.id = "phase1SelectionStatus";
    status.className = "phase1-selection-status";
    status.textContent = "Board: UP Board · Select class and subject";
    top.appendChild(status);
  }
}

function enhanceHome() {
  const main = $(".panel");
  if (!main || $(" .phase1-hero", main)) return;
  const h1 = $("h1", main);
  if (!h1 || h1.textContent.trim() !== "Home") return;
  const hero = document.createElement("section");
  hero.className = "phase1-hero";
  hero.innerHTML = `
    <div class="phase1-hero-copy">
      <span class="phase1-eyebrow">YOUR PERSONAL STUDY SPACE</span>
      <h2>Learn clearly. Practise confidently.</h2>
      <p>Class 11–12 · UP Board first · PCM and PCB subjects · English and Hindi</p>
      <div class="phase1-hero-actions">
        <button type="button" class="action" data-phase1-go="Learning">Explore subjects</button>
        <button type="button" class="action secondary" data-phase1-go="Practice">Start practice</button>
      </div>
      <small>Chapter-level coverage is shown only where academic data has been mapped.</small>
    </div>
    <img class="phase1-hero-logo" src="${ICON_FRONT}" alt="ScienceHub.io science app icon">
  `;
  h1.insertAdjacentElement("afterend", hero);
  $$("[data-phase1-go]", hero).forEach(button => button.addEventListener("click", () => {
    const nav = $(`[data-route="${button.dataset.phase1Go}"]`);
    if (nav) nav.click();
  }));
}

function enhanceAssets() {
  const main = $(".panel");
  if (!main || $(" .phase1-books", main)) return;
  const h1 = $("h1", main);
  if (!h1 || h1.textContent.trim() !== "Assets") return;
  const grid = $(".grid", main);
  if (!grid) return;
  const section = document.createElement("section");
  section.className = "phase1-books card";
  section.innerHTML = `
    <h3>Books, PDFs & study notes</h3>
    <p class="muted">Use official portals for current UP Board syllabus and legally available NCERT textbooks. Availability and chapter mapping must be checked for the selected academic session.</p>
    <div class="phase1-resource-links">
      <a class="action" href="${UPMSP_URL}" target="_blank" rel="noopener noreferrer">UP Board official syllabus ↗</a>
      <a class="action" href="${NCERT_URL}" target="_blank" rel="noopener noreferrer">NCERT textbook portal ↗</a>
    </div>
    <label class="phase1-pdf-label" for="phase1PdfUrl">Open a legal PDF URL inside the reader</label>
    <input id="phase1PdfUrl" type="url" inputmode="url" placeholder="Paste an official PDF URL (https://…)" value="${esc(read("pdfUrl"))}">
    <div class="phase1-resource-links">
      <button class="action" id="phase1OpenPdf" type="button">Open in reader</button>
      <button class="action secondary" id="phase1ClearPdf" type="button">Clear reader</button>
    </div>
    <div id="phase1PdfStatus" class="muted" role="status">Only use PDFs you are allowed to access. Some websites block in-app embedding; if so, open the PDF in a new tab.</div>
    <iframe id="phase1PdfReader" title="Legal study PDF reader" class="phase1-pdf-reader" hidden loading="lazy" referrerpolicy="no-referrer"></iframe>
    <h3>My chapter notes</h3>
    <p class="muted">Notes are stored locally on this device/browser. They are not synced to a server.</p>
    <textarea id="phase1Notes" rows="5" placeholder="Write your own chapter notes…">${esc(read("notes"))}</textarea>
    <button class="action" id="phase1SaveNotes" type="button">Save notes on this device</button>
    <span id="phase1NotesStatus" class="muted" role="status"></span>
  `;
  grid.insertAdjacentElement("afterend", section);
  $("#phase1OpenPdf", section).addEventListener("click", () => {
    const raw = $("#phase1PdfUrl", section).value.trim();
    let url;
    try { url = new URL(raw); } catch {
      $("#phase1PdfStatus", section).textContent = "Enter a complete https:// PDF URL first.";
      return;
    }
    if (url.protocol !== "https:") {
      $("#phase1PdfStatus", section).textContent = "For safety, only https:// PDF URLs are accepted.";
      return;
    }
    remember("pdfUrl", url.href);
    const frame = $("#phase1PdfReader", section);
    frame.src = url.href;
    frame.hidden = false;
    $("#phase1PdfStatus", section).textContent = "Reader opened. If the source blocks embedding, use the link in a new browser tab.";
  });
  $("#phase1ClearPdf", section).addEventListener("click", () => {
    const frame = $("#phase1PdfReader", section);
    frame.removeAttribute("src");
    frame.hidden = true;
    $("#phase1PdfUrl", section).value = "";
    remember("pdfUrl", "");
    $("#phase1PdfStatus", section).textContent = "Reader cleared.";
  });
  $("#phase1SaveNotes", section).addEventListener("click", () => {
    remember("notes", $("#phase1Notes", section).value);
    $("#phase1NotesStatus", section).textContent = "Saved locally on this device.";
  });
}

const expressions = [
  {name:"Calm", face:"◡", color:"#36d9ff"},
  {name:"Happy", face:"⌣", color:"#86efac"},
  {name:"Thinking", face:"…", color:"#fbbf24"},
  {name:"Focused", face:"•", color:"#a78bfa"},
  {name:"Surprised", face:"o", color:"#f472d0"},
  {name:"Concerned", face:"︵", color:"#fb7185"}
];

function localReply(message) {
  const m = message.toLowerCase();
  if (/(hello|hi|hey|namaste|नमस्ते)/i.test(m))
    return "Hi! Main Sukoon.Brain hoon. Abhi offline fallback mode mein hoon. Subject choose karo, aur main tumhe study steps plan karne mein help kar sakta hoon.";
  if (/(physics|भौतिक|chemistry|रसायन|biology|जीव|math|गणित|english|hindi)/i.test(m))
    return "Achha, is subject ko chhote steps mein padho: (1) chapter overview, (2) key definitions/formulas, (3) worked example, (4) practice questions, (5) mistakes ka revision. Yeh local study guidance hai, connected AI answer nahi.";
  if (/(stress|tension|overwhelmed|थक|परेशान)/i.test(m))
    return "Thoda pause lena theek hai. Ek chhota, realistic study task choose karo—jaise ek concept ya 10 minute revision. Agar pareshani zyada lag rahi ho, kisi trusted adult se baat karna bhi helpful ho sakta hai.";
  return "Main abhi connected AI nahi hoon, isliye is message ka AI-generated answer nahi de sakta. Main offline study planning mein help kar sakta hoon: apna class, subject aur chapter choose karo.";
}

function installMascot() {
  let trigger = $("#sukoon");
  if (trigger?.dataset.phase1Installed === "yes") return;
  if (!trigger) {
    trigger = document.createElement("button");
    trigger.id = "sukoon";
    trigger.type = "button";
    trigger.innerHTML = `<img src="${ICON_SUkoon}" alt=""><span>Sukoon</span>`;
    document.body.appendChild(trigger);
  } else {
    trigger.innerHTML = `<img src="${ICON_SUkoon}" alt=""><span>Sukoon</span>`;
  }
  trigger.setAttribute("aria-label", "Open movable Sukoon.Brain mascot and chat");
  trigger.dataset.phase1Installed = "yes";
  let panel = null;
  let expressionIndex = 0;

  const openPanel = () => {
    if (panel) { panel.remove(); panel = null; return; }
    panel = document.createElement("aside");
    panel.id = "phase1SukoonPanel";
    panel.className = "phase1-sukoon-panel";
    panel.innerHTML = `
      <header class="phase1-sukoon-head">
        <img src="${ICON_SUkoon}" alt="Sukoon.Brain mascot">
        <div><strong>Sukoon.Brain</strong><small>Calm · Learn · Grow</small></div>
        <button type="button" class="phase1-close" aria-label="Close chat">×</button>
      </header>
      <div class="phase1-sukoon-status"><span class="phase1-live-dot"></span> Offline fallback · AI not connected</div>
      <div class="phase1-expression-row" aria-label="Mascot expressions">
        ${expressions.map((x,i)=>`<button type="button" data-expression="${i}" aria-label="${x.name}" title="${x.name}">${x.name}</button>`).join("")}
      </div>
      <div class="phase1-chat-log" id="phase1ChatLog" aria-live="polite">
        <div class="phase1-chat-bubble bot">Namaste! Main study planning aur basic offline guidance de sakta hoon. Real AI abhi connected nahi hai.</div>
      </div>
      <form id="phase1ChatForm" class="phase1-chat-form">
        <input id="phase1ChatInput" autocomplete="off" maxlength="500" placeholder="Ask about your study plan…" aria-label="Message Sukoon.Brain" required>
        <button type="submit" class="action">Send</button>
      </form>
      <small class="phase1-disclaimer">No message is sent to an AI service in this mode.</small>
    `;
    document.body.appendChild(panel);
    $(".phase1-close", panel).addEventListener("click", () => { panel.remove(); panel = null; });
    $$("[data-expression]", panel).forEach(btn => btn.addEventListener("click", () => {
      expressionIndex = Number(btn.dataset.expression);
      trigger.dataset.expression = expressions[expressionIndex].name.toLowerCase();
      $$("[data-expression]", panel).forEach(x => x.classList.toggle("selected", x === btn));
    }));
    $("#phase1ChatForm", panel).addEventListener("submit", event => {
      event.preventDefault();
      const input = $("#phase1ChatInput", panel);
      const message = input.value.trim();
      if (!message) return;
      const log = $("#phase1ChatLog", panel);
      const user = document.createElement("div");
      user.className = "phase1-chat-bubble user";
      user.textContent = message;
      log.appendChild(user);
      const reply = document.createElement("div");
      reply.className = "phase1-chat-bubble bot";
      reply.textContent = localReply(message);
      log.appendChild(reply);
      input.value = "";
      log.scrollTop = log.scrollHeight;
      trigger.dataset.expression = /hello|hi|thanks|thank you|शुक्रिया/i.test(message) ? "happy" : "thinking";
    });
    $("#phase1ChatInput", panel).focus();
  };

  trigger.onclick = openPanel;

  // Drag on pointer devices; on touch, avoid hijacking normal page scrolling unless the user
  // drags the mascot's dedicated icon area.
  let drag = null;
  trigger.addEventListener("pointerdown", event => {
    if (event.target.closest("span")) return;
    const rect = trigger.getBoundingClientRect();
    drag = {x:event.clientX, y:event.clientY, left:rect.left, top:rect.top, moved:false};
    try { trigger.setPointerCapture(event.pointerId); } catch {}
  });
  trigger.addEventListener("pointermove", event => {
    if (!drag) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 8) drag.moved = true;
    if (!drag.moved) return;
    const left = Math.max(8, Math.min(window.innerWidth - trigger.offsetWidth - 8, drag.left + dx));
    const top = Math.max(8, Math.min(window.innerHeight - trigger.offsetHeight - 8, drag.top + dy));
    trigger.style.left = left + "px";
    trigger.style.top = top + "px";
    trigger.style.right = "auto";
    trigger.style.bottom = "auto";
  });
  trigger.addEventListener("pointerup", () => {
    if (drag?.moved) {
      const rect = trigger.getBoundingClientRect();
      try {
        localStorage.setItem("sciencehub.phase1.mascotPosition", JSON.stringify({left:rect.left,top:rect.top}));
      } catch {}
      // Prevent the pointer-up click from opening the chat after a drag.
      trigger.dataset.dragged = "yes";
      window.setTimeout(() => { delete trigger.dataset.dragged; }, 80);
    }
    drag = null;
  });
  const originalClick = trigger.onclick;
  trigger.onclick = event => {
    if (trigger.dataset.dragged === "yes") { event.preventDefault(); return; }
    originalClick(event);
  };
  try {
    const pos = JSON.parse(localStorage.getItem("sciencehub.phase1.mascotPosition") || "null");
    if (pos && Number.isFinite(pos.left) && Number.isFinite(pos.top)) {
      trigger.style.left = Math.max(8, Math.min(innerWidth-trigger.offsetWidth-8, pos.left)) + "px";
      trigger.style.top = Math.max(8, Math.min(innerHeight-trigger.offsetHeight-8, pos.top)) + "px";
      trigger.style.right = "auto";
      trigger.style.bottom = "auto";
    }
  } catch {}
}

function runEnhancements() {
  enhanceHeader();
  enhanceHome();
  enhanceAssets();
  installMascot();
}
const observer = new MutationObserver(() => {
  if (!$("#app")) return;
  runEnhancements();
});
observer.observe(document.body, {childList:true, subtree:true});
document.addEventListener("DOMContentLoaded", runEnhancements);
runEnhancements();
