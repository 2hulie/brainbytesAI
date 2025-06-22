import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../pages/index";

// Mock dependencies
jest.mock("next/router", () => ({
  useRouter: () => ({
    pathname: "/",
    query: {},
    replace: jest.fn(),
    push: jest.fn(),
    asPath: "",
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}));

jest.mock("../utils/api", () => {
  const get = jest.fn((url) => {
    if (url && url.includes("/api/messages")) {
      // Start with an empty chat for the test
      return Promise.resolve({ data: [] });
    }
    // Default: return an empty array
    return Promise.resolve({ data: [] });
  });
  return {
    __esModule: true,
    default: {
      post: jest.fn(() => {
        const now = Date.now().toString();
        return Promise.resolve({
          data: {
            userMessage: {
              _id: now + "-user",
              text: "Test message",
              isUser: true,
              createdAt: new Date().toISOString(),
            },
            aiMessage: {
              _id: now + "-ai",
              text: "AI response",
              isUser: false,
              createdAt: new Date().toISOString(),
            },
            category: "General",
            questionType: "Open",
            sentiment: "Neutral",
          },
        });
      }),
      get,
    },
    setAuthToken: jest.fn(),
  };
});

// Mock localStorage
beforeAll(() => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn(() => "mock-token"),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    },
    writable: true,
  });
  // Mock scrollIntoView for JSDOM
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

// Mock react-markdown to prevent ESM errors in tests
jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="markdown">{children}</div>,
}));

describe("Home Page Chat Interaction", () => {
  test("submits message when user clicks send", async () => {
    render(<Home />);
    const input = screen.getByPlaceholderText(/ask a question/i);
    fireEvent.change(input, { target: { value: "Test message" } });

    const button = screen.getByRole("button", { name: /send/i });
    fireEvent.click(button);

    // Wait for the input to be cleared
    await waitFor(() => expect(input.value).toBe(""));

    // Check that the user's message appears in the chat
    expect(screen.getByText("Test message")).toBeInTheDocument();
    // Check that the AI response appears
    expect(screen.getByText("AI response")).toBeInTheDocument();
  });

  test("does not submit empty messages", () => {
    render(<Home />);
    const button = screen.getByRole("button", { name: /send/i });
    fireEvent.click(button);

    // There should be no user message in the chat
    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
