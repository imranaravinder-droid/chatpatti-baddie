// CHATPATTI Pop-Under Traffic Script v1.0
// Embed this on your domain to generate pop-under traffic to chatpatti-baddie.vercel.app
// Works on all modern browsers

(function() {
  var targetUrl = "https://chatpatti-baddie.vercel.app/pop?src=" + encodeURIComponent(window.location.hostname);
  var popUnder = null;

  function openPopUnder() {
    try {
      popUnder = window.open(targetUrl, "chatpatti_pop_" + Date.now(), 
        "width=1,height=1,left=-9999,top=-9999,toolbar=no,scrollbars=no,resizable=no,status=no");
      if (popUnder) {
        popUnder.blur();
        window.focus();
      }
    } catch(e) {
      // fallback
    }
  }

  // Trigger on first user interaction
  document.addEventListener("click", function handler() {
    openPopUnder();
    document.removeEventListener("click", handler);
  }, { once: true });

  // Also try on page load (browsers may block)
  setTimeout(function() {
    try {
      var w = window.open(targetUrl, "_blank");
      if (w) {
        w.blur();
        window.focus();
      }
    } catch(e) {}
  }, 1000);

})();
