import { cleanup } from "@testing-library/react";

afterEach(cleanup);

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(query => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    };
  })
});

global.ResizeObserver = vi.fn().mockImplementation(() => {
  return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
});
