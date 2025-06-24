# Modern Web Application Styling Guide

## Overview

This styling system uses **Tailwind CSS v4** with a clean, efficient, and mobile-first approach. The design system prioritizes consistency, accessibility, and maintainability while providing a modern dark-themed interface optimized for productivity applications.

## Design System

### Color Palette

The app uses a cohesive color system defined in CSS custom properties:

```css
:root {
  /* Brand colors */
  --color-primary: 33 128 141;           /* Teal brand color */
  --color-primary-foreground: 252 252 249; /* Light text on primary */
  
  /* Semantic colors */
  --color-background: 252 252 249;       /* Main background */
  --color-foreground: 19 52 59;          /* Main text */
  --color-muted: 244 244 241;            /* Subtle background */
  --color-muted-foreground: 98 108 113;  /* Secondary text */
  --color-border: 94 82 64;              /* Border color */
  --color-input: 255 255 253;            /* Input background */
}
```

### Component Classes

#### Buttons
- `.btn` - Base button styles
- `.btn-primary` - Primary action button (teal background)
- `.btn-secondary` - Secondary button (muted background)
- `.btn-outline` - Outline button style
- `.btn-sm` - Small button variant
- `.btn-lg` - Large button variant

#### Form Elements
- `.input` - Standard input field with focus states

#### Cards
- `.card` - Base card container with subtle shadow
- `.card-header` - Card header with proper spacing
- `.card-content` - Card content area

#### Status Badges
- `.status-badge` - Base badge styles
- `.status-open` - Open status (blue)
- `.status-in-progress` - In progress status (yellow)
- `.status-under-review` - Under review status (purple)
- `.status-completed` - Completed status (green)
- `.status-rejected` - Rejected status (red)

#### Priority Badges
- `.priority-high` - High priority (red)
- `.priority-medium` - Medium priority (yellow)
- `.priority-low` - Low priority (green)

### Layout Utilities

#### Responsive Layout
- `.layout-main` - Main app container with responsive flex direction
- `.layout-sidebar` - Sidebar with responsive width
- `.layout-content` - Main content area that grows to fill space

#### Container & Grid
- `.container` - Responsive container with proper padding
- `.grid-responsive` - Responsive grid that adapts from 1 to 4 columns

#### Scrolling
- `.scrollbar-thin` - Custom thin scrollbar styling

## Mobile-First Approach

The design system follows a mobile-first methodology:

1. **Base styles** target mobile devices
2. **Breakpoints** progressively enhance for larger screens:
   - `sm:` (640px+) - Small tablets
   - `md:` (768px+) - Large tablets
   - `lg:` (1024px+) - Desktop
   - `xl:` (1280px+) - Large desktop

### Mobile Optimizations

- **Touch-friendly** button sizes (minimum 44px tap targets)
- **Stacked layouts** on small screens, side-by-side on larger screens
- **Responsive typography** that scales appropriately
- **Optimized spacing** for thumb navigation

## Dark Mode Support

All components automatically support dark mode using Tailwind's dark mode classes and CSS custom properties:

```css
.dark {
  --color-background: 31 33 33;
  --color-foreground: 245 245 245;
  /* ... other dark mode colors */
}
```

Components use conditional classes for dark mode:
```tsx
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
```

## Accessibility Features

### Focus Management
- Clear focus indicators using `focus-visible`
- Consistent focus ring styling
- Keyboard navigation support

### Screen Reader Support
- Semantic HTML structure
- `.sr-only` utility for screen reader only content
- Proper ARIA labels and roles

### Color Contrast
- All color combinations meet WCAG AA standards
- High contrast ratios for text readability

## Component Examples

### Button Usage
```tsx
// Primary action
<button className="btn btn-primary">Save Changes</button>

// Secondary action
<button className="btn btn-secondary">Cancel</button>

// Small outline button
<button className="btn btn-outline btn-sm">Edit</button>
```

### Card Layout
```tsx
<div className="card">
  <div className="card-header">
    <h3 className="font-semibold">Card Title</h3>
  </div>
  <div className="card-content">
    <p>Card content goes here.</p>
  </div>
</div>
```

### Status Indicators
```tsx
<span className="status-badge status-open">Open</span>
<span className="status-badge priority-high">High Priority</span>
```

### Responsive Grid
```tsx
<div className="grid-responsive">
  <div className="card">Item 1</div>
  <div className="card">Item 2</div>
  <div className="card">Item 3</div>
  <div className="card">Item 4</div>
</div>
```

## Migration from CSS Modules

The old CSS modules approach has been completely replaced:

### Before (CSS Modules)
```tsx
import styles from './Component.module.css';

<div className={styles['component-name']}>
  <button className={styles['primary-btn']}>Click me</button>
</div>
```

### After (Tailwind + Global Classes)
```tsx
<div className="card p-6">
  <button className="btn btn-primary">Click me</button>
</div>
```

## Performance Benefits

1. **Smaller bundle size** - No duplicate CSS across components
2. **Better caching** - Global styles cache better than component styles
3. **Reduced complexity** - No CSS module imports or class name mapping
4. **Faster development** - No context switching between CSS and JSX files

## Best Practices

### 1. Use Semantic Classes First
When available, prefer semantic classes over utility classes:
```tsx
// Good
<button className="btn btn-primary">Submit</button>

// Avoid (unless for one-off styling)
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Submit</button>
```

### 2. Maintain Consistency
Always use the defined design tokens rather than arbitrary values:
```tsx
// Good
<div className="text-[rgb(var(--color-primary))]">Brand text</div>

// Avoid
<div className="text-blue-600">Brand text</div>
```

### 3. Mobile-First Development
Always start with mobile styles and enhance for larger screens:
```tsx
// Good
<div className="flex flex-col lg:flex-row gap-4">

// Avoid
<div className="lg:flex lg:flex-row flex flex-col gap-4">
```

### 4. Leverage Spacing Scale
Use consistent spacing throughout:
```tsx
// Good - uses spacing scale
<div className="space-y-4 p-6">

// Avoid - arbitrary values
<div className="space-y-[17px] p-[23px]">
```

## Browser Support

The styling system supports:
- **Modern browsers** (Chrome 88+, Firefox 78+, Safari 14+, Edge 88+)
- **CSS Grid** and **Flexbox** layouts
- **CSS Custom Properties** for theming
- **CSS logical properties** for better internationalization

## Future Enhancements

Planned improvements:
1. **Animation utilities** for smooth transitions
2. **Additional component variants** as needed
3. **Print styles** for better printing experience
4. **High contrast mode** support
5. **Reduced motion** preferences
