# Phase 13 — Internationalization and Localization (if applicable)

28. **Design the i18n/l10n architecture (if required).** If the application must support multiple languages or locales:

    - **i18n library:** Recommend and justify (`next-intl`, `react-i18next`, `vue-i18n`, `svelte-i18n`, `FormatJS`).
    - **Message format:** ICU Message Format for complex pluralization, gender, and interpolation. Simple key-value JSON for basic translations.
    - **Translation file structure:** One JSON/YAML file per locale per feature (or per page) to enable code-split loading of translations.
    - **Key naming convention:** Hierarchical, dot-separated keys matching feature and component structure (e.g., `auth.login.emailLabel`, `auth.login.submitButton`, `auth.login.errors.invalidCredentials`).
    - **Locale detection and switching:** Define the priority order: URL path prefix (`/en/`, `/fr/`) → user preference (stored in profile or cookie) → browser `Accept-Language` header → default locale.
    - **RTL support:** If required, define the CSS logical properties strategy (`margin-inline-start` instead of `margin-left`), the `dir` attribute management, and component-level RTL adjustments.
    - **Number, date, and currency formatting:** Use `Intl.NumberFormat`, `Intl.DateTimeFormat`, `Intl.RelativeTimeFormat` — never hardcode format patterns.
    - **Translation workflow:** Define how translators receive and return translations (JSON export/import, translation management platform like Crowdin or Lokalise, or inline editing).