/* LifeCome Health practitioners: loaded live from the admin console (/api/practitioners).
   Admins add staff by role in /admin; activated, visible staff appear here automatically. */
(function () {
  const base = ((window.LIFECOME_CONFIG && window.LIFECOME_CONFIG.professionalOrigin) || location.origin).replace(/\/$/, '');
  LC.team = { loaded: false, error: false, list: [], roles: [] };

  window.teamOf = role => LC.team.list.filter(p => p.role === role);
  window.practitionerById = id => LC.team.list.find(p => p.id === id);
  window.initialsOf = name => String(name || '').replace(/^(dr|mr|mrs|ms|mx|prof)\.?\s+/i, '').split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'LC';

  window.doctorName = () => S().booking.doctor || (teamOf('doctor')[0] || {}).name || 'Your GP';
  window.wellbeingName = () => S().wellbeing.practitioner || (teamOf('wellbeing')[0] || {}).name || 'Your practitioner';
  window.coordinatorName = () => (teamOf('manager')[0] || teamOf('care')[0] || {}).name || 'Your care coordinator';
  window.carerName = () => (teamOf('care')[0] || {}).name || 'Your care professional';

  const plural = { doctor: 'GPs', nurse: 'nurses', care: 'care professionals', wellbeing: 'wellbeing practitioners', manager: 'clinical managers', admin: 'reception team members' };

  /** Loading / unavailable / empty states shared by every practitioner list. */
  window.teamState = role => {
    if (!LC.team.loaded) return `<div class="team-loading">${icon('people')}<span>Loading our team…</span></div>`;
    if (LC.team.error) return note('We couldn’t load our team just now. Check your connection and try again.', 'amber');
    if (!teamOf(role).length) return `<div class="team-empty">${icon('people')}<strong>No ${plural[role] || 'practitioners'} available yet</strong><p>New team members appear here as soon as they join LifeCome Health.</p></div>`;
    return '';
  };

  /** Practitioner cards for a role. With a route they link to that profile screen. */
  window.teamCards = (role, route) => teamState(role) || teamOf(role).map(p => {
    const inner = `${avatar(esc(p.initials))}<span><strong>${esc(p.name)}</strong><p>${esc(p.title)}${p.languages ? ' · ' + esc(p.languages) : ''}</p></span>`;
    return route
      ? `<a class="person-card" href="#${route}" data-go="${route}" data-practitioner="${esc(p.id)}">${inner}${icon('chevron')}</a>`
      : `<div class="person-card">${inner}</div>`;
  }).join('');

  window.doctorProfile = () => {
    const p = practitionerById(S().viewDoctor) || teamOf('doctor')[0];
    if (!p) return back('gp-doctors') + title('Meet your GP', '') + teamState('doctor');
    return doctorPage(p.name, p.initials, p.bio || `${p.title} at LifeCome Health.`, p.languages || 'English');
  };

  window.wellbeingProfile = () => {
    const list = teamOf('wellbeing');
    const p = list.find(x => x.name === S().wellbeing.practitioner) || list[0];
    if (!p) return teamState('wellbeing');
    const others = list.filter(x => x !== p);
    return `<div class="profile-banner">${avatar(esc(p.initials), true)}<h2>${esc(p.name)}</h2><p>${esc(p.title)}</p></div>`
      + panel(`About ${esc(p.name.split(' ')[0])}`, esc(p.bio || 'Supportive, practical sessions at your pace.'))
      + (others.length ? `<h2 class="section-title">Other practitioners</h2>` + others.map(o => `<button class="person-card" data-action="pick-wellbeing" data-value="${esc(o.name)}">${avatar(esc(o.initials))}<span><strong>${esc(o.name)}</strong><p>${esc(o.title)}</p></span>${icon('chevron')}</button>`).join('') : '');
  };

  /** Everyone, grouped by role. */
  window.teamDirectory = () => (LC.team.roles.length ? LC.team.roles : Object.keys(plural).map(key => ({ key, label: key })))
    .map(r => `<h2 class="section-title">${esc(r.label)}</h2>` + teamCards(r.key, r.key === 'doctor' ? 'gp-doctor' : ''))
    .join('');

  // Remember which practitioner was tapped before the app navigates.
  document.addEventListener('click', e => {
    const card = e.target.closest('[data-practitioner]');
    if (card) {
      const p = practitionerById(card.dataset.practitioner);
      if (p && p.role === 'doctor') S().viewDoctor = p.id;
    }
    const pick = e.target.closest('[data-action="pick-wellbeing"]');
    if (pick) {
      S().wellbeing.practitioner = pick.dataset.value;
      e.stopPropagation();
      if (typeof save === 'function') save();
      if (typeof render === 'function') { LC.skipTrail = true; render(LC.current); }
    }
  }, true);

  let last = '';
  async function load() {
    try {
      const res = await fetch(base + '/api/practitioners', { cache: 'no-store', credentials: 'omit' });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      LC.team.list = Array.isArray(data.practitioners) ? data.practitioners : [];
      LC.team.roles = Array.isArray(data.roles) ? data.roles : [];
      LC.team.error = false;
    } catch (_) {
      LC.team.error = true;
    }
    LC.team.loaded = true;
    const snapshot = JSON.stringify([LC.team.error, LC.team.list]);
    if (snapshot !== last && typeof render === 'function' && LC.current) {
      last = snapshot;
      LC.skipTrail = true;
      render(LC.current);
    }
    last = snapshot;
  }
  // Stay in step with the admin console: refresh on open, on every screen change, when the
  // app comes back into view, and every 30 seconds while it is visible (at most once per 3s).
  let lastFetch = 0;
  const refresh = (force) => {
    if (!force && Date.now() - lastFetch < 3000) return;
    lastFetch = Date.now();
    load();
  };
  window.refreshTeam = () => refresh(true);
  if (!window.LC_TEST_MODE) {
    window.addEventListener('load', () => refresh(true));
    window.addEventListener('hashchange', () => refresh(false));
    window.addEventListener('focus', () => refresh(false));
    document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(false); });
    setInterval(() => { if (!document.hidden) refresh(false); }, 30000);
  }
})();
