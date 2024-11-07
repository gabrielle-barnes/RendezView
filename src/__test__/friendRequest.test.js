// src/__tests__/friendRequest.test.js
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from "../components/FriendRequest";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

// Mock Firestore functions
jest.mock("firebase/firestore", () => {
  const originalModule = jest.requireActual("firebase/firestore");
  return {
    ...originalModule,
    getDoc: jest.fn(),
    updateDoc: jest.fn(),
  };
});

describe("Friend request functionality", () => {
  const userId = "testUserId";
  const friendId = "testFriendId";

  beforeEach(() => {
    jest.clearAllMocks();  // Clear mocks before each test to ensure clean state
  });

  it("sends a friend request", async () => {
    // Mock getDoc to simulate the friend user exists
    getDoc.mockResolvedValueOnce({ exists: () => true });

    await sendFriendRequest(friendId);

    expect(updateDoc).toHaveBeenCalledWith(
      doc(getFirestore(), "users", friendId),
      { friendRequests: arrayUnion(userId) }
    );
  });

  it("accepts a friend request", async () => {
    await acceptFriendRequest(friendId);

    expect(updateDoc).toHaveBeenCalledWith(
      doc(getFirestore(), "users", userId),
      { friendRequests: arrayRemove(friendId), friends: arrayUnion(friendId) }
    );
    expect(updateDoc).toHaveBeenCalledWith(
      doc(getFirestore(), "users", friendId),
      { friends: arrayUnion(userId) }
    );
  });

  it("rejects a friend request", async () => {
    await rejectFriendRequest(friendId);

    expect(updateDoc).toHaveBeenCalledWith(
      doc(getFirestore(), "users", userId),
      { friendRequests: arrayRemove(friendId) }
    );
  });
});
