import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SharedRecommendationPage from "../pages/SharedRecommendationPage";

function renderSharedPage() {
  return render(
    <MemoryRouter initialEntries={["/share/public-token"]}>
      <Routes>
        <Route path="/share/:shareToken" element={<SharedRecommendationPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("SharedRecommendationPage", () => {
  test("shows public pending recommendations without completion details", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          item_name: "Past Lives",
          category: "Movie",
          recommender: "Bree",
          moods: ["Thoughtful", "Emotional"],
          status: "pending",
          rating: null,
          review: null,
        },
      }),
    });

    renderSharedPage();

    expect(await screen.findByRole("heading", { name: "Past Lives" })).toBeInTheDocument();
    expect(screen.getByText("Bree")).toBeInTheDocument();
    expect(screen.getByText("Thoughtful")).toBeInTheDocument();
    expect(screen.queryByText(/Not rated|Absolutely beautiful/)).not.toBeInTheDocument();
  });

  test("shows rating and review for completed recommendations", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          item_name: "Past Lives",
          category: "Movie",
          recommender: "Bree",
          moods: [],
          status: "completed",
          rating: 5,
          review: "Absolutely beautiful.",
        },
      }),
    });

    renderSharedPage();

    await waitFor(() => expect(screen.getByText(/Absolutely beautiful\./)).toBeInTheDocument());
    expect(screen.getByLabelText("5 out of 5 stars")).toBeInTheDocument();
  });

  test("shows an error for an invalid share token", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Shared recommendation not found" }),
    });

    renderSharedPage();

    expect(await screen.findByText("Shared recommendation not found")).toBeInTheDocument();
  });
});