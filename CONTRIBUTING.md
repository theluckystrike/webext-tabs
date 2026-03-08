# Contributing to webext-tabs

Thank you for your interest in contributing! This guide will help you get started.

## Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

## Getting Started

### 1. Fork the Repository

Click the "Fork" button on the [GitHub page](https://github.com/theluckystrike/webext-tabs) to create your own copy.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/webext-tabs.git
cd webext-tabs
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 5. Make Your Changes

- Add new tab utilities to `src/index.ts`
- Include proper TypeScript types
- Add tests if applicable

### 6. Run Tests

```bash
pnpm test
```

### 7. Build the Package

```bash
pnpm build
```

### 8. Commit and Push

```bash
git add .
git commit -m "Add: your feature description"
git push origin feature/your-feature-name
```

### 9. Create a Pull Request

1. Go to the original repository
2. Click "New Pull Request"
3. Select your branch and submit

## Code Style

- Use TypeScript
- Follow existing code patterns
- Add JSDoc comments for new functions
- Ensure tests pass before submitting

## Questions?

Open an issue for questions about contributing.
