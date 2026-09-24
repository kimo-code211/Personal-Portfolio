/* ==========================================================================
   HAKIM HAKIM — PORTFOLIO SCRIPT
   ==========================================================================
   Vanilla JavaScript only — no libraries. Everything the page needs is here:

     1. Theme toggle (dark / light) with the choice saved in localStorage
     2. Mobile hamburger menu
     3. Header shadow when the page is scrolled
     4. Scroll spy — highlights the nav link for the section on screen
     5. Scroll reveal animations
     6. Contact form validation
     7. Footer year + back-to-top button

   Each feature lives in its own init function and is called at the bottom.
   If one feature's HTML is missing, only that feature is skipped — the rest
   of the page keeps working. That is what all the `if (!el) return;` guards do.
   ========================================================================== */

/* An IIFE (immediately invoked function expression) keeps our variables out
   of the global scope, so nothing can accidentally clash with browser globals
   or a script you add later. */
(function () {
  'use strict';


  /* ----------------------------------------------------------------------
     1. THEME TOGGLE
     ----------------------------------------------------------------------
     The theme is just a data-theme attribute on <html>. CSS variables do the
     rest. We save the choice in localStorage so it survives a page reload.

     A tiny inline script in <head> already applied the saved theme BEFORE the
     page painted — that prevents a white flash for dark-mode users. This code
     only handles the button itself.
     -------------------------------------------------------------------- */
  function initThemeToggle() {
    var button = document.getElementById('theme-toggle');
    if (!button) return;

    var root = document.documentElement;

    // Sets the button's accessible name to describe what it will DO next.
    function syncLabel() {
      var isDark = root.dataset.theme === 'dark';
      button.setAttribute(
        'aria-label',
        isDark ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }

    syncLabel();

    button.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;

      try {
        localStorage.setItem('theme', next);
      } catch (err) {
        // Safari private browsing and some embedded browsers block storage.
        // The theme still switches for this visit, it just is not remembered.
      }

      syncLabel();
    });
  }


  /* ----------------------------------------------------------------------
     2. MOBILE MENU
     ----------------------------------------------------------------------
     Toggling a menu is not just about showing and hiding it. To be accessible
     we also have to:
       - keep aria-expanded in sync so screen readers announce the state
       - close it when the visitor presses Escape
       - close it after a link is clicked (otherwise it covers the section)
       - close it if the window grows past the desktop breakpoint
       - stop the page behind it from scrolling while it is open
     -------------------------------------------------------------------- */
  function initMobileMenu() {
    var toggle = document.getElementById('nav-toggle');
    var menu   = document.getElementById('nav-menu');
    var nav    = document.querySelector('.nav');
    if (!toggle || !menu || !nav) return;

    var DESKTOP_BREAKPOINT = 1024;   // must match the CSS media query

    function openMenu() {
      menu.classList.add('is-open');
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation menu');
      document.body.classList.add('no-scroll');
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      document.body.classList.remove('no-scroll');
    }

    toggle.addEventListener('click', function () {
      // aria-expanded is the source of truth for "is it open right now?"
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });

    // Close after clicking any link inside the menu.
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });

    // Escape is the standard key for dismissing an overlay.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();   // return focus to the button that opened it
      }
    });

    /*
      If the window is resized to desktop width while the menu is open, the
      panel would be left stuck open with body scroll locked. matchMedia
      listens for the breakpoint instead of checking on every resize event,
      which is cheaper.
    */
    var desktopQuery = window.matchMedia('(min-width: ' + DESKTOP_BREAKPOINT + 'px)');
    function handleBreakpointChange(e) {
      if (e.matches) closeMenu();
    }
    // addEventListener is modern; addListener is the older Safari fallback.
    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener('change', handleBreakpointChange);
    } else if (desktopQuery.addListener) {
      desktopQuery.addListener(handleBreakpointChange);
    }
  }


  /* ----------------------------------------------------------------------
     3. HEADER SHADOW ON SCROLL
     ----------------------------------------------------------------------
     Adds a border + shadow once you scroll past the very top, so the sticky
     header reads as a separate layer floating above the content.
     -------------------------------------------------------------------- */
  function initHeaderScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;

    function update() {
      header.classList.toggle('site-header--scrolled', window.scrollY > 8);
    }

    update();
    // `passive: true` tells the browser we will not call preventDefault(),
    // so it can scroll without waiting for us. This keeps scrolling smooth.
    window.addEventListener('scroll', update, { passive: true });
  }


  /* ----------------------------------------------------------------------
     4. SCROLL SPY
     ----------------------------------------------------------------------
     Highlights the nav link belonging to whichever section is on screen.

     IntersectionObserver is used instead of measuring scroll positions
     manually: the browser watches the sections for us and only calls back
     when something actually crosses the line, which is much cheaper than
     running calculations on every scroll event.
     -------------------------------------------------------------------- */
  function initScrollSpy() {
    var links = document.querySelectorAll('.nav__link');
    if (!links.length) return;

    // Map each section id to its nav link for fast lookup.
    var linkById = {};
    links.forEach(function (link) {
      var id = link.getAttribute('href');      // e.g. "#about"
      if (id && id.startsWith('#')) linkById[id.slice(1)] = link;
    });

    var sections = Object.keys(linkById)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);                        // drop ids with no matching element

    if (!sections.length) return;

    function setActive(id) {
      links.forEach(function (link) {
        var isActive = link === linkById[id];
        link.classList.toggle('is-active', isActive);

        /*
          aria-current="true" tells assistive technology which link points at
          the section you are reading. The CSS underline alone is not enough,
          because a screen reader user cannot see it.
        */
        if (isActive) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        // Pick the entry that covers the most of the viewport right now.
        var best = null;
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
          }
        });
        if (best) setActive(best.target.id);
      },
      {
        /*
          rootMargin shrinks the top of the observation area by the header
          height, so a section counts as "current" once it clears the sticky
          nav rather than when it peeks under it.
        */
        rootMargin: '-25% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );

    sections.forEach(function (section) { observer.observe(section); });

    // Start with Home highlighted.
    setActive('home');
  }


  /* ----------------------------------------------------------------------
     5. SCROLL REVEAL
     ----------------------------------------------------------------------
     Elements with class .reveal start invisible (see CSS). When one scrolls
     into view we add .is-visible, which transitions it up and fades it in.

     Each element is unobserved after it appears so we only animate it once —
     re-triggering on every scroll up and down would be distracting.
     -------------------------------------------------------------------- */
  function initScrollReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    /*
      FALLBACK: if IntersectionObserver is unavailable, or the user asked for
      reduced motion, just show everything immediately. Content must never
      stay invisible because an animation could not run.
    */
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      items.forEach(function (item) { item.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach(function (item) { observer.observe(item); });
  }


  /* ----------------------------------------------------------------------
     6. CONTACT FORM
     ----------------------------------------------------------------------
     IMPORTANT — there is no backend in this project.

     Instead of pretending the message was sent, we validate the fields and
     then hand the message to the visitor's own email client through a mailto:
     link. That is a real, working behaviour and it is honest.

     TO CONNECT A REAL FORM SERVICE LATER (Formspree, Getform, Basin, or your
     own API), do this:
       1. In index.html add to the <form> tag:
              action="https://formspree.io/f/YOUR_FORM_ID" method="POST"
       2. In this file, delete the body of initContactForm() — or simply
          remove the event listener — so the browser submits normally.
     The input names (name, email, message) already match what those services
     expect, so no other changes are needed.
     -------------------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var statusEl  = document.getElementById('form-status');
    var countEl   = document.getElementById('char-count');
    var messageEl = document.getElementById('message');
    var MAX_CHARS = 1000;

    if (messageEl) messageEl.setAttribute('maxlength', MAX_CHARS);

    /* --- character counter -------------------------------------------- */
    if (countEl && messageEl) {
      messageEl.addEventListener('input', function () {
        countEl.textContent = String(messageEl.value.length);
      });
    }

    /* --- validation helpers -------------------------------------------- */
    // A practical email pattern: something@something.something
    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    /*
      Shows or clears an error for one field.
      aria-invalid and aria-describedby link the input to its error message,
      so a screen reader announces the problem instead of just refusing to
      submit silently.
    */
    function setFieldError(input, message) {
      var errorEl = document.getElementById(input.id + '-error');

      if (message) {
        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
        if (errorEl) {
          errorEl.textContent = message;
          errorEl.hidden = false;
        }
      } else {
        input.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.hidden = true;
        }
      }
    }

    function validateField(input) {
      var value = input.value.trim();

      if (!value) {
        return input.id === 'message'
          ? 'Please write a message.'
          : 'Please enter your ' + (input.id === 'email' ? 'email address' : 'name') + '.';
      }

      if (input.id === 'email' && !EMAIL_PATTERN.test(value)) {
        return 'Please enter a valid email address, for example name@example.com.';
      }

      if (input.id === 'message' && value.length < 10) {
        return 'Please write at least 10 characters so I can understand your message.';
      }

      return '';   // empty string means "no error"
    }

    function showStatus(text, type) {
      if (!statusEl) return;
      statusEl.textContent = text;
      statusEl.className = 'form-status form-status--' + type;
      statusEl.hidden = false;
    }

    /*
      Validating on blur (when focus leaves a field) gives feedback at a
      natural moment. Validating on every keystroke would shout at people
      while they are still typing.
    */
    ['name', 'email', 'message'].forEach(function (id) {
      var input = document.getElementById(id);
      if (!input) return;

      input.addEventListener('blur', function () {
        setFieldError(input, validateField(input));
      });

      // Clear the error as soon as they start fixing it.
      input.addEventListener('input', function () {
        if (input.classList.contains('is-invalid') && !validateField(input)) {
          setFieldError(input, '');
        }
      });
    });

    /* --- submit ---------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
      event.preventDefault();   // we handle it ourselves, no page reload

      var fields = ['name', 'email', 'message']
        .map(function (id) { return document.getElementById(id); })
        .filter(Boolean);

      var firstInvalid = null;

      fields.forEach(function (input) {
        var error = validateField(input);
        setFieldError(input, error);
        if (error && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        showStatus('Please fix the highlighted fields and try again.', 'error');
        firstInvalid.focus();   // move the user to the first problem
        return;
      }

      /*
        Build a mailto: link with the message pre-filled.
        encodeURIComponent escapes spaces, newlines and characters like & and ?
        which would otherwise corrupt the URL — this is also what stops a
        message from injecting extra parameters.
      */
      var subject = 'Portfolio enquiry from ' + document.getElementById('name').value.trim();
      var body =
        document.getElementById('message').value.trim() +
        '\n\n---\nSent by: ' + document.getElementById('name').value.trim() +
        '\nReply to: ' + document.getElementById('email').value.trim();

      var mailto =
        'mailto:hakimelia3@gmail.com' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      window.location.href = mailto;

      showStatus(
        'Thanks! Your email app should have opened with the message ready to send. ' +
        'If nothing happened, email me directly at hakimelia3@gmail.com.',
        'success'
      );

      form.reset();
      if (countEl) countEl.textContent = '0';
    });
  }


  /* ----------------------------------------------------------------------
     7. SMALL UTILITIES — footer year and back-to-top
     -------------------------------------------------------------------- */
  function initFooter() {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  function initBackToTop() {
    var button = document.getElementById('back-to-top');
    if (!button) return;

    button.addEventListener('click', function () {
      var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }


  /* ----------------------------------------------------------------------
     START EVERYTHING
     ----------------------------------------------------------------------
     script.js is loaded with `defer`, so the DOM is already parsed by the
     time this runs — no need to wait for DOMContentLoaded.
     -------------------------------------------------------------------- */
  initThemeToggle();
  initMobileMenu();
  initHeaderScroll();
  initScrollSpy();
  initScrollReveal();
  initContactForm();
  initFooter();
  initBackToTop();

})();
