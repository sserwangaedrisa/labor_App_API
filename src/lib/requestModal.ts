export function openRequestModal() {
  window.dispatchEvent(new CustomEvent("open-request-modal"));
}
