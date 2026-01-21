export function errorHandler() {
  window.onerror = function (message, source, lineno, colno, error) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
    overlay.style.color = 'white';
    overlay.style.padding = '20px';
    overlay.style.zIndex = '9999';
    overlay.style.fontSize = '14px';
    overlay.style.whiteSpace = 'pre-wrap';
    overlay.style.overflow = 'auto';
    overlay.innerHTML = `
      <h1>Runtime Error</h1>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>Source:</strong> ${source}:${lineno}:${colno}</p>
      <pre>${error?.stack || 'No stack trace'}</pre>
    `;
    document.body.appendChild(overlay);
  };

  window.onunhandledrejection = function (event) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '50%';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '50%';
    overlay.style.backgroundColor = 'rgba(128, 0, 0, 0.9)';
    overlay.style.color = 'white';
    overlay.style.padding = '20px';
    overlay.style.zIndex = '9999';
    overlay.style.fontSize = '14px';
    overlay.style.whiteSpace = 'pre-wrap';
    overlay.innerHTML = `
      <h1>Unhandled Rejection</h1>
      <p><strong>Reason:</strong> ${event.reason}</p>
    `;
    document.body.appendChild(overlay);
  };
}
