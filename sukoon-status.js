/** UI status helper only; it does not connect an AI provider. */
const VALID_STATES = new Set(["offline", "connecting", "connected", "error"]);

export function setSukoonStatus(root, state, message) {
  if (!root || !VALID_STATES.has(state)) {
    throw new TypeError("A root element and valid Sukoon status are required.");
  }
  root.dataset.state = state;
  root.setAttribute("role", "status");
  root.setAttribute("aria-live", "polite");
  const defaults = {
    offline: "Offline fallback · AI not connected",
    connecting: "Connecting to assistant…",
    connected: "Assistant connected",
    error: "Assistant unavailable · using local fallback",
  };
  root.textContent = message || defaults[state];
}
