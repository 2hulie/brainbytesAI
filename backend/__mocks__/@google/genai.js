/* eslint-env jest */
/* eslint-env jest */
// __mocks__/@google/genai.js
// Jest mock for Gemini API to silence errors and allow tests to pass in CI

module.exports = {
  Models: jest.fn().mockImplementation(() => ({
    generateContent: jest.fn().mockResolvedValue({
      candidates: [
        { content: { parts: [{ text: "Mocked Gemini response" }] } },
      ],
    }),
  })),
};
