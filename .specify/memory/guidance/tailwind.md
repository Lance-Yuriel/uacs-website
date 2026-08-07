# Tailwind CSS & UI Guidelines

## Utility-First Principles
- **No Custom CSS Files:** Do not create separate `.css` or `.module.css` files for components. All styling must be achieved using Tailwind utility classes.
- **Design Tokens:** Use the colors, spacing, and typography defined in `tailwind.config.ts`. 
- **No Arbitrary Values:** Avoid arbitrary values like `w-[43px]` or `text-[#123456]`. If a value is used repeatedly, add it to the Tailwind config theme.

## Component Styling
- **Class Merging (`cn`):** Always use the `cn()` utility function (from `src/lib/utils.ts` utilizing `clsx` and `tailwind-merge`) when applying conditional classes or accepting `className` props.
  > Why: Standard string concatenation (`"base-class " + className`) leads to specificity conflicts. `tailwind-merge` safely resolves conflicts (e.g., overriding `p-4` with `p-8`).

## Responsive Design
- **Mobile-First:** Write the base classes for the mobile layout first, then use Tailwind's responsive modifiers (`sm:`, `md:`, `lg:`, `xl:`) to adjust for larger screens.
  > Example: `w-full md:w-1/2 lg:w-1/3`

## Accessibility & States
- **Hover & Focus:** Always provide visual feedback for interactive elements using `hover:`, `focus:`, and `active:` variants.
- **Focus Rings:** Use `focus-visible:ring` to show focus rings only when navigating via keyboard (improves mouse user experience).
- **Dark Mode:** If dark mode is implemented, ensure all components have appropriate `dark:` variants for colors and borders.

## Animations
- **CSS vs. Framer Motion:** Use Tailwind's built-in `animate-` classes or `transition-` utilities for simple state changes (hover, fade in). Use `framer-motion` only for complex, sequenced, or scroll-driven animations.
