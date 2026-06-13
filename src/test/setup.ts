import '@testing-library/jest-dom';

/**
 * Mock window.matchMedia for JSDOM (not implemented in jsdom).
 * Required by IonSplitPane which uses matchMedia to evaluate
 * responsive breakpoints (e.g. when="md").
 */
Object.defineProperty(window, 'matchMedia', {
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
