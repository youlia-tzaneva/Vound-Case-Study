Always follow these rules when implementing new pages:

- Always use design tokens from `docs/design-tokens/global.json`; never hardcode colors, typography, spacing, radii, or shadows.
- Use existing components before creating new ones.
- Prefer composition over duplication.
- Use Tailwind utilities consistently (if using Tailwind).
- Keep components under ~200 lines where practical.
- Make components responsive.
- Use TypeScript strictly.
- Keep layouts accessible (ARIA labels, keyboard navigation, focus states).
- Use 4px spacing increments.
- Use Lucide icons only with 1px stroke width.
- Never introduce UI styles that aren't part of the design system.