You are helping me implement a UX redesign for a case study for VOUND, a B2B SaaS platform used by German architecture and engineering firms to discover, evaluate, and manage public procurement tenders.

This redesign is focused on the "Saved Tenders" workspace, where teams collaboratively review and decide which tenders to pursue. This is a shared workspace used by architects, engineers, and firm leadership, most of whom are 40+ years old and value clarity, efficiency, and information density over visually flashy interfaces.

The goal is not to redesign for aesthetics alone, but to improve decision-making, collaboration, and workflow efficiency.

## Design Goals

The redesign should:

- Reduce cognitive load while preserving information density.
- Eliminate unnecessary horizontal scrolling.
- Improve scanability and visual hierarchy.
- Surface the information users need to make decisions without opening every tender.
- Support collaboration between multiple stakeholders.
- Keep interactions fast with inline actions wherever appropriate.
- Feel professional, trustworthy, and purpose-built for technical users.

## UX Principles

Prioritize workflow over metadata.

The interface should answer questions like:

- Which tenders need attention?
- Which opportunities should we pursue?
- Who owns each tender?
- What changed recently?
- What action should happen next?

Rather than simply displaying procurement data.

Use progressive disclosure whenever possible:
- The table should contain only high-value information.
- Secondary metadata belongs in the side preview panel.
- Avoid overwhelming users with unnecessary columns.

## Visual Style

The design system has already been created and should be treated as the source of truth.

Use:
- Design tokens in `docs/design-tokens/global.json` for colors, typography, spacing, radii, and shadows.
- IBM Plex Sans for headings.
- Source Sans 3 for UI and body text.
- Lucide icons.
- A 4px spacing system.
- Thin borders instead of heavy shadows.
- Neutral backgrounds with restrained use of color.

The interface should feel closer to professional software like Autodesk, Linear, or Notion than consumer productivity tools like Monday.com or ClickUp.

Avoid decorative UI elements, oversized spacing, excessive animations, or unnecessary visual effects.

## Tables

This project is table-heavy.

Optimize tables for:
- Dense but readable layouts
- 14px body text
- Clear alignment
- Strong hierarchy
- Easy comparison across rows

Never introduce horizontal scrolling unless absolutely unavoidable.

## Components

Favor reusable components throughout the project.

Examples include:
- Status chips
- Data tables
- Side preview panel
- Filters
- Search
- Saved views
- Buttons
- Dropdowns
- Form controls
- Comments
- Update indicators

Keep components modular and reusable.

## Code Quality

Write clean, maintainable React components.

Prefer composition over duplication.

Keep styling consistent with the design system.

Use semantic HTML and accessible components whenever possible.

If an implementation decision is unclear, prioritize usability, readability, consistency, and maintainability over visual complexity.

Whenever implementing a screen, focus on recreating the design accurately while also respecting good frontend architecture and component reuse.