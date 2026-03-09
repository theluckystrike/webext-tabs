# Contributing to webext-tabs

Thank you for your interest in contributing to `webext-tabs`! This document outlines the process for contributing to this project.

## Development Setup

1. **Fork the repository**

   Click the "Fork" button on the repository page, then clone your fork:

   ```bash
   git clone https://github.com/YOUR_USERNAME/webext-tabs.git
   cd webext-tabs
   ```

2. **Install dependencies**

   This project uses pnpm for package management:

   ```bash
   pnpm install
   ```

3. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-fix-name
   ```

## Development Workflow

1. **Make your changes**

   - Follow the existing code style and conventions
   - Add TypeScript types for any new functionality
   - Write tests for new functions

2. **Run tests**

   ```bash
   pnpm test
   ```

3. **Build the project**

   ```bash
   pnpm build
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Follow conventional commit format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `test:` for adding/updating tests
   - `refactor:` for code refactoring

5. **Push to your fork**

   ```bash
   git push origin your-branch-name
   ```

6. **Create a Pull Request**

   Go to the original repository and create a Pull Request from your fork.

## Code Standards

- **TypeScript**: All code must be written in TypeScript
- **Testing**: All new functions should have accompanying tests
- **Documentation**: Update the README.md with any new public APIs
- **Formatting**: The project uses default TypeScript formatting

## Reporting Issues

If you find a bug or have a feature request:

1. Check if the issue already exists
2. If not, create a new issue with:
   - Clear description
   - Steps to reproduce (for bugs)
   - Expected behavior
   - Environment details

## License

By contributing to `webext-tabs`, you agree that your contributions will be licensed under the MIT License.
