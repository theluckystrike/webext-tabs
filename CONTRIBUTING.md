# Contributing to webext-tabs

Thank you for your interest in contributing! This document outlines the process for contributing to this project.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/webext-tabs.git`
3. **Install** dependencies: `npm install`

## Development

```bash
# Run tests
npm test

# Build the TypeScript
npm run build
```

## Project Structure

```
webext-tabs/
├── src/
│   └── index.ts      # Main source code
├── dist/             # Compiled output
├── package.json
└── tsconfig.json
```

## Adding New Functions

When adding new tab utility functions:

1. Add the function to `src/index.ts`
2. Export the TypeScript interface types used
3. Ensure proper error handling (e.g., handle invalid tab IDs)
4. Add tests for the new function
5. Update the README.md API Reference table

## Code Style

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Add JSDoc comments for exported functions
- Ensure full type coverage

## Testing

Tests are run with [Vitest](https://vitest.dev/). Add tests in `src/index.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { myNewFunction } from "./index";

describe("myNewFunction", () => {
  it("should do something", async () => {
    const result = await myNewFunction();
    expect(result).toBeDefined();
  });
});
```

## Submitting Changes

1. Create a new branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Run tests: `npm test`
4. Commit with a clear message: `git commit -m "Add feature name"`
5. Push to your fork: `git push origin feature/my-feature`
6. Open a Pull Request

## Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists
2. If not, open a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
