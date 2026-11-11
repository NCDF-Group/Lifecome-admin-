# Validation record

Validated on Node.js v24.22.1 with npm 11.9.0 on 10 November 2026.

`npm test` passed:

- Eight HTTP/configuration tests, including successful requests for all 60 professional views, clean entry routes, patient app, runtime configuration, assets and manifest.
- HEAD, health, missing-page handling, disallowed write methods, path traversal protection and escaped error output.
- All 56 interactive route renderers produce headings and valid internal route targets.
- Note signing and immutability, deliberate summary release, patient separation, role restrictions, prescription safety checks and cancellation, result review before release and note addenda.
- Private care and wellbeing details excluded from shared records.
- Patient bridge accepts the portal's release payload only for the matching origin and opener; released summary and prescription cancellation are received.

Tests exercise actual local HTTP requests and browser-script logic in Node's VM. They are not a full end-to-end browser, accessibility, load, penetration or clinical safety assessment. Docker and external deployment were not tested. Styling was retained from the supplied demo; no new visual redesign is claimed.
