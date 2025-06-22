import { jest } from "@jest/globals";
import * as messageService from "../services/messageService.js";
import { Message } from "../server.js";

describe("Message Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("saveMessage calls Message.create with correct data", async () => {
    const createSpy = jest
      .spyOn(Message, "create")
      .mockResolvedValueOnce({ _id: "123", text: "Test message" });

    const message = { text: "Test message", isUser: true, userId: "user1" };
    await messageService.saveMessage(message);

    expect(createSpy).toHaveBeenCalledWith(message);
    expect(createSpy).toHaveBeenCalledTimes(1);
  });

  test("getMessagesByUser returns messages from Message.find", async () => {
    const mockMessages = [
      { text: "Hello", isUser: true },
      { text: "Hi there", isUser: false },
    ];
    // Mock the chainable sort method
    const sortMock = jest.fn().mockResolvedValueOnce(mockMessages);
    const findSpy = jest
      .spyOn(Message, "find")
      .mockReturnValue({ sort: sortMock });

    const result = await messageService.getMessagesByUser("user1");

    expect(findSpy).toHaveBeenCalledWith({ userId: "user1" });
    expect(sortMock).toHaveBeenCalledWith({ createdAt: 1 });
    expect(result).toEqual(mockMessages);
  });
});
