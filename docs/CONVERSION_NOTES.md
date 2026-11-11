# Conversion notes

Source: supplied LifeCome Health Professional Portal and Patient Integration archive. The separate older corrected-demo archive was not used to overwrite its integrated patient app.

## Delivered

- Native Node.js HTTP application using ES modules; no external dependencies.
- Sixty professional page templates converted from HTML files to JavaScript view modules, retaining the 56-screen catalogue.
- Existing HTML URL compatibility and clean entry routes.
- Original professional workflow and full patient demo retained.
- Both bridge endpoints changed from fixed hosted-demo addresses to runtime configuration, with same-origin defaults.
- Public-files containment, escaped error messages, MIME types, HEAD support, explicit method handling and health checks.
- Environment example, lockfile, Dockerfile, regression tests and developer instructions.

## Boundaries

The retained OpenAPI file, integration narrative, authentication screens, role choices and audit screens are demonstration/design material. Node.js now serves the screens, but server-side clinical services have not been implemented. Existing proposed endpoints must not be mistaken for operational APIs. The package does not connect to real patient records or issue real prescriptions.

Browser scripts still execute in the browser. Converting their clinical state to durable backend storage would require a separate implementation and additional validation. The professional templates are readable JavaScript functions returning HTML; this is not a React or TypeScript rewrite.

Original external reference links may remain in narrative material. Executable bridge destinations use runtime configuration. No existing deployed Site was changed.
