# Project Setup Guide (After Tailwind CSS)

## 1. Clean Up the Boilerplate

- Remove or simplify the default content in `src/App.tsx` and `src/main.tsx`.
- Delete any unused files (like `src/assets` or the default logo).

---

## 2. Plan Your Component Structure

Create a simple folder structure in `src/`:

```
src/
  components/
    TabPanel.tsx
    PeopleForm.tsx
    PlacesForm.tsx
    EventsForm.tsx
    TitlesForm.tsx
    BatchForm.tsx
    ResultsGrid.tsx
    NameCard.tsx
    StatsBar.tsx
    ThemeToggle.tsx
  types/
    index.ts
  utils/
    api.ts
    mockData.ts
  App.tsx
  main.tsx
  index.css
```

You can add files as you go, but this is a good starting point.

---

## 3. Set Up Routing or Tab Navigation

Since your original app uses tabs, you can implement a simple tab navigation in `App.tsx` (no need for React Router unless you want URL-based navigation).

---

## 4. Build the Main Layout

- Use Tailwind utility classes for layout and styling.
- Add a header, tab buttons, and a main content area.

---

## 5. Implement One Feature End-to-End

Start with the "People" generator as a pattern:
- Create `PeopleForm.tsx` for the form.
- Create `ResultsGrid.tsx` and `NameCard.tsx` for displaying results.
- Wire up the form to call your PHP API (or use mock data for now).
- Display results in the grid.

---

## 6. Add Utility Features

- Implement copy-to-clipboard, favorite, export, and clear features as simple functions or hooks.
- Add a statistics bar (`StatsBar.tsx`) and theme toggle (`ThemeToggle.tsx`).

---

## 7. Repeat for Other Generators

- Add forms and result displays for Places, Events, Titles, and Batch, following the same pattern.

---

## 8. Test and Refine

- Test each feature as you build.
- Keep components small and focused.
- Use TypeScript interfaces for props and data. **All interfaces/types should be defined in `/types` and imported from there, not defined in component or util files.**

---

**Reference:**
- [Tailwind CSS with Vite Official Guide](https://tailwindcss.com/docs/installation/using-vite) 