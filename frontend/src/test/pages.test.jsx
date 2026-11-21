import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddRecommendationPage from "../pages/AddRecommendationPage";
import RecommendationPage from "../pages/RecommendationPage";

const mockNavigate = jest.fn();
const mockUseRecommendations = jest.fn();

jest.mock("../hooks/useRecommendations", () => ({
  useRecommendations: () => mockUseRecommendations(),
}));

jest.mock("../components/forms/RecommendForm", () => function MockRecommendationForm() {
  return <div data-testid="recommendation-form">Recommendation form</div>;
});

jest.mock("../components/ui/FilterDropdown", () => function MockFilter() {
  return <div data-testid="recommendation-filter">Recommendation filter</div>;
});

jest.mock("../components/ui/RecommendationCard", () => function MockRecommendationList({ rec }) {
  return <div data-testid="recommendation-card">{rec.item_name}</div>;
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

function renderPage(page) {
  return render(<MemoryRouter>{page}</MemoryRouter>);
}

describe("frontend pages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("AddRecommendationPage blocks signed-out users", () => {
    mockUseRecommendations.mockReturnValue({
      user: null,
      error: null,
      moodOptions: [],
      categories: [],
      addRecommendation: jest.fn(),
    });

    renderPage(<AddRecommendationPage />);

    expect(screen.getByText("You must be logged in to view your recommendations.")).toBeInTheDocument();
    expect(screen.queryByTestId("recommendation-form")).not.toBeInTheDocument();
  });

  test("AddRecommendationPage renders the form for signed-in users", () => {
    mockUseRecommendations.mockReturnValue({
      user: { userId: 7 },
      error: null,
      moodOptions: [],
      categories: ["Movie"],
      addRecommendation: jest.fn(),
    });

    renderPage(<AddRecommendationPage />);

    expect(screen.getByTestId("recommendation-form")).toBeInTheDocument();
  });

  test("RecommendationPage displays loading and API error states", () => {
    mockUseRecommendations.mockReturnValue({
      user: { userId: 7 },
      loading: true,
      error: null,
      items: [],
      moodOptions: [],
      categories: [],
      filters: {},
      setFilters: jest.fn(),
    });

    const { rerender } = renderPage(<RecommendationPage />);
    expect(document.querySelector(".loading-spinner")).toBeInTheDocument();

    mockUseRecommendations.mockReturnValue({
      user: { userId: 7 },
      loading: false,
      error: "Failed to load recommendations",
      items: [],
      moodOptions: [],
      categories: [],
      filters: {},
      setFilters: jest.fn(),
    });
    rerender(<MemoryRouter><RecommendationPage /></MemoryRouter>);

    expect(screen.getByText("Failed to load recommendations")).toBeInTheDocument();
  });

  test("RecommendationPage renders loaded recommendations", () => {
    mockUseRecommendations.mockReturnValue({
      user: { userId: 7 },
      loading: false,
      error: null,
      items: [{ id: 1, item_name: "Past Lives", status: "pending" }],
      moodOptions: [],
      categories: [],
      filters: {},
      setFilters: jest.fn(),
      editRecommendation: jest.fn(),
      completeRecommendation: jest.fn(),
      deleteRecommendation: jest.fn(),
    });

    renderPage(<RecommendationPage />);

    expect(screen.getByText("Past Lives")).toBeInTheDocument();
    expect(screen.getByTestId("recommendation-filter")).toBeInTheDocument();
  });
});
