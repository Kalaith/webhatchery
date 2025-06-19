# Echo of the Many - Quick Start Guide

## 🚀 Getting Started

This guide will help you set up and run Echo of the Many locally for development.

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- Modern web browser with PWA support
- Git for version control

### 📦 Installation

1. **Clone the repository** (when created):
```bash
git clone https://github.com/your-username/echo-of-the-many.git
cd echo-of-the-many
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start development server**:
```bash
npm run dev
```

4. **Open your browser** to `http://localhost:3000`

### 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run test:ui` | Run tests with UI |
| `npm run lint` | Check code quality |
| `npm run format` | Format code |
| `npm run type-check` | TypeScript type checking |

### 🏗️ Project Creation Steps

If you're starting from scratch, follow these steps:

#### 1. Create Vite Project
```bash
npm create vite@latest echo-of-the-many -- --template react-ts
cd echo-of-the-many
```

#### 2. Install Core Dependencies
```bash
# State management and utilities
npm install zustand immer clsx date-fns uuid

# Animation libraries
npm install react-spring @use-gesture/react framer-motion

# PWA support
npm install @vitejs/plugin-pwa workbox-window

# Performance optimization
npm install react-window
```

#### 3. Install Development Dependencies
```bash
# Build tools
npm install -D @types/node @types/uuid @types/react-window

# CSS framework
npm install -D tailwindcss autoprefixer postcss

# Code quality
npm install -D eslint prettier eslint-config-prettier
npm install -D @typescript-eslint/eslint-plugin
npm install -D eslint-plugin-react eslint-plugin-react-hooks

# Testing
npm install -D vitest jsdom @testing-library/react
npm install -D @testing-library/jest-dom @vitest/ui

# Performance monitoring
npm install -D @lhci/cli vite-bundle-analyzer
```

#### 4. Initialize Tailwind CSS
```bash
npx tailwindcss init -p
```

#### 5. Set up project structure
```bash
# Create directory structure
mkdir -p src/{components/{game,ui,layout,tutorial},hooks,store,utils,types,styles,assets,data}
mkdir -p src/components/game/{GameMap,CloneManager,FactionPanel,SpellBook,GameHUD}
mkdir -p public/{icons,screenshots}

# Create initial files
touch src/components/index.ts
touch src/hooks/index.ts
touch src/store/index.ts
touch src/utils/index.ts
touch src/types/index.ts
```

### 📱 Mobile Development Setup

#### Testing on Mobile Devices

1. **Find your local IP address**:
```bash
# Windows
ipconfig | findstr IPv4

# macOS/Linux
ifconfig | grep inet
```

2. **Start dev server with host flag**:
```bash
npm run dev -- --host
```

3. **Access from mobile device**:
   - Connect mobile device to same WiFi network
   - Navigate to `http://YOUR_IP:3000`

#### PWA Testing

1. **Build the project**:
```bash
npm run build
```

2. **Serve with HTTPS** (required for PWA):
```bash
# Install serve globally
npm install -g serve

# Serve with HTTPS
serve -s dist -l 3000 --ssl-cert localhost.pem --ssl-key localhost-key.pem
```

3. **Test PWA features**:
   - Open Chrome DevTools
   - Go to Application > Service Workers
   - Check "Install app" prompt appears

### 🧪 Testing Strategy

#### Unit Tests
```bash
# Run all tests
npm run test

# Run specific test file
npm run test CloneManager.test.tsx

# Run with coverage
npm run test:coverage
```

#### Integration Tests
```bash
# Test game mechanics
npm run test -- --run src/utils/__tests__/

# Test components
npm run test -- --run src/components/__tests__/
```

#### Performance Testing
```bash
# Analyze bundle size
npm run analyze

# Run Lighthouse CI
npm run lighthouse
```

### 🎮 Game Content Creation

#### Adding New Districts
1. Update `src/data/districts.json`
2. Add district component in `src/components/game/GameMap/`
3. Update types in `src/types/game.ts`
4. Add tests for new functionality

#### Adding New Spells
1. Update `src/data/spells.json`
2. Implement spell logic in `src/utils/gameLogic.ts`
3. Add spell component in `src/components/game/SpellBook/`
4. Update spell state management

#### Adding New Clone Types
1. Update `src/types/clone.ts`
2. Add clone creation logic in `src/store/cloneSlice.ts`
3. Update UI components for new clone types
4. Add appropriate tests

### 🚀 Deployment Options

#### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Set environment variables if needed
4. Deploy automatically on push to main

#### Netlify
1. Connect repository to Netlify
2. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. Configure redirects for SPA in `public/_redirects`

#### Manual Deployment
```bash
# Build the project
npm run build

# Upload dist/ folder to your web server
```

### 🔧 Configuration Files

Key configuration files to customize:

- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS customization
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.json` - ESLint rules
- `vitest.config.ts` - Test configuration
- `.lighthouserc.json` - Performance budgets

### 🐛 Troubleshooting

#### Common Issues

**Build fails with TypeScript errors:**
```bash
# Check types
npm run type-check

# Fix auto-fixable issues
npm run lint:fix
```

**PWA not installing:**
- Ensure HTTPS is enabled
- Check service worker registration
- Verify manifest.json is valid

**Poor performance on mobile:**
- Check bundle size with `npm run analyze`
- Review lazy loading implementation
- Test on actual devices, not just desktop

**Touch gestures not working:**
- Verify `touch-action: none` is set
- Check gesture library configuration
- Test on physical devices

#### Getting Help

1. Check the [interactive GDD](./interactive-gdd.html) for detailed specifications
2. Review the [implementation plan](./react-implementation-plan.md)
3. Look at component examples in the documentation
4. Test on multiple devices and browsers

### 📚 Resources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Spring Documentation](https://react-spring.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [PWA Builder](https://www.pwabuilder.com/)

### 🎯 Next Steps

1. **Set up the basic project structure**
2. **Implement core game state management**
3. **Create basic UI components**
4. **Add touch gesture support**
5. **Implement clone management system**
6. **Add faction influence mechanics**
7. **Create the game map interface**
8. **Add PWA features**
9. **Optimize for mobile performance**
10. **Deploy and test on real devices**

Happy coding! 🚀
