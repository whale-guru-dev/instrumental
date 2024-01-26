import { NextRouter } from "next/router";

export function createMockRouter(router: Partial<NextRouter>): NextRouter {
  return {
    pathname: "/",
    basePath: "",
    query: {},
    isFallback: false,
    back: jest.fn(),
    asPath: "/",
    route: "/",
    prefetch: jest.fn(() => Promise.reject()),
    push: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isLocaleDomain: false,
    isReady: true,
    defaultLocale: "en",
    domainLocales: [],
    isPreview: false,
    beforePopState: jest.fn(),
    ...router,
  };
}
