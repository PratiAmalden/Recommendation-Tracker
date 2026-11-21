import { jest } from "@jest/globals";
import { act, renderHook, waitFor } from "@testing-library/react";

const mockUseAuth = jest.fn();
const mockUseLocation = jest.fn();

jest.unstable_mockModule("../hooks/AuthContext.jsx", () => ({
  useAuth: () => mockUseAuth(),
}));

jest.unstable_mockModule("react-router-dom", () => ({
  useLocation: () => mockUseLocation(),
}));

const { useRecommendations } = await import("../hooks/useRecommendations.jsx");

describe("useRecommendations", () => {
  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (url === "/api/moods") {
        return Promise.resolve({
          json: async () => ({ success: true, data: [{ id: 1, name: "Thoughtful" }] }),
        });
      }

      if (url.includes("/completion")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: { id: 9, status: "completed", rating: 4, review: "Loved it" } }),
        });
      }

      return Promise.resolve({
        ok: true,
        json: async () => ({ data: [{ id: 9, item_name: "Past Lives", image_url: "/uploads/past.jpg" }] }),
      });
    });
    mockUseAuth.mockReturnValue({ user: { userId: 7 }, token: "token" });
    mockUseLocation.mockReturnValue({ key: "recommendations" });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("loads moods and recommendations with normalized image URLs", async () => {
    const { result } = renderHook(() => useRecommendations());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.moodOptions).toEqual([{ id: 1, label: "Thoughtful" }]);
    expect(result.current.items[0].image_url).toBe("/uploads/past.jpg");
    expect(fetch).toHaveBeenCalledWith(
      "/api/recommendations?",
      { headers: { Authorization: "Bearer token" } }
    );
  });

  test("completes an item and updates it in local state", async () => {
    const { result } = renderHook(() => useRecommendations());
    await waitFor(() => expect(result.current.items).toHaveLength(1));

    await act(async () => {
      await result.current.completeRecommendation(9, { rating: 4, review: "Loved it" });
    });

    expect(result.current.items[0]).toMatchObject({
      status: "completed",
      rating: 4,
      review: "Loved it",
    });
    expect(fetch).toHaveBeenLastCalledWith(
      "/api/recommendations/9/completion",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ rating: 4, review: "Loved it" }),
      })
    );
  });

  test("clears items when signed out", async () => {
    mockUseAuth.mockReturnValue({ user: null, token: "" });
    const { result } = renderHook(() => useRecommendations());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items).toEqual([]);
    expect(fetch).toHaveBeenCalledWith("/api/moods");
  });
});
