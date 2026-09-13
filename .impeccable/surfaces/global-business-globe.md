# Global Business Globe surface brief

Mode: Experience

Audience: company website visitors and the frontend engineers integrating the component.

Job: understand the organisation's geographic presence at a glance, inspect highlighted countries, and maintain those locations from one data module.

Constraints: Vue 3 + TypeScript + Vite; COBE renderer; user-supplied globe and bilingual-card references; sample countries must be identifiable; debug controls are development-only by default.

## Direction contract

THESIS: A quiet operational planet made from precise grey signals, with only active business locations breaking the field. It refuses satellite textures, glowing sci-fi dashboards, and decorative GIS chrome.

OWN-WORLD: Paper-white space, cool graphite dots, nearly black bilingual country labels, and one restrained green signal color. Card Chinese uses Source Han Sans CN Bold; uppercase English uses Krona One. Geometry is circular, edges are crisp, shadows are soft and directional, and UI controls read as calibrated instruments rather than decorative cards.

STORY: The globe immediately establishes worldwide scope. Highlighted locations identify sample business presence; hovering or selecting a marker reveals its Chinese and English country names. A development-only control rail can add and remove real latitude/longitude locations, tune visuals, choose one-at-a-time or all-card display, and save without modifying renderer code.

FIRST VIEWPORT: The globe owns the canvas at large scale, biased slightly left of centre on desktop and centred on mobile. Country labels follow visible markers. A narrow debug rail sits at the far right in desktop development and starts collapsed on mobile, with the Save action fixed at its end.

FORM: User-pinned reference adapted as an interactive Vue component; seed key `user-pinned-cobe-globe`. The signature interaction is seamless momentum handoff: slow auto-rotation yields to direct drag, continues briefly with measured inertia, then calmly resumes.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
