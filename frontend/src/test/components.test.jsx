import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import CategorySelector from "../components/ui/CategoryDropdown";
import RecommendationFilter from "../components/ui/FilterDropdown";
import StarRating from "../components/ui/StarRating";

describe("frontend UI components", () => {
  test("StarRating reports the selected star", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<StarRating rating={2} onChange={onChange} />);

    expect(screen.getByRole("button", { name: "Rate 2 out of 5 stars" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await user.click(screen.getByRole("button", { name: "Rate 5 out of 5 stars" }));

    expect(onChange).toHaveBeenCalledWith(5);
  });

  test("CategorySelector renders options and reports changes", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    function CategoryWrapper() {
      const [value, setValue] = useState("");
      return (
        <CategorySelector
          label="Category"
          name="category"
          options={["Movie", "Book"]}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            onChange(event);
          }}
        />
      );
    }

    render(<CategoryWrapper />);

    expect(screen.getByRole("option", { name: "Movie" })).toBeInTheDocument();
    await user.selectOptions(screen.getByRole("combobox"), "Book");

    expect(onChange).toHaveBeenCalled();
    expect(screen.getByRole("combobox")).toHaveValue("Book");
  });

  test("RecommendationFilter applies the selected filters", async () => {
    const user = userEvent.setup();
    const onFilterChange = jest.fn();

    render(
      <RecommendationFilter
        filters={{ category: "", mood: "", recommender: "" }}
        moodOptions={[{ id: 3, label: "Thoughtful" }]}
        onFilterChange={onFilterChange}
      />
    );

    const selects = screen.getAllByRole("combobox");
    await user.selectOptions(selects[0], "Movie");
    await user.selectOptions(selects[1], "3");
    await user.type(screen.getByPlaceholderText("Name..."), "Alex");
    await user.click(screen.getByRole("button", { name: "Apply Filters" }));

    expect(onFilterChange).toHaveBeenCalledWith({
      category: "Movie",
      mood: "3",
      recommender: "Alex",
    });
  });
});
