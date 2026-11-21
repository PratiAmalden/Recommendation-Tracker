import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CompletionForm from "../components/forms/completionForm";

describe("CompletionForm", () => {
  test("selects a rating and completes with the review", async () => {
    const user = userEvent.setup();
    const onComplete = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();

    render(
      <CompletionForm
        itemName="Past Lives"
        onComplete={onComplete}
        onClose={onClose}
      />
    );

    await user.click(screen.getByRole("button", { name: "Rate 4 out of 5 stars" }));
    await user.type(screen.getByLabelText("Review (optional)"), "Beautiful and quiet.");
    await user.click(screen.getByRole("button", { name: "Complete" }));

    expect(onComplete).toHaveBeenCalledWith({
      rating: 4,
      review: "Beautiful and quiet.",
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("skips the rating while still completing the recommendation", async () => {
    const user = userEvent.setup();
    const onComplete = jest.fn().mockResolvedValue(undefined);

    render(
      <CompletionForm
        itemName="Past Lives"
        onComplete={onComplete}
        onClose={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "Skip rating" }));

    expect(onComplete).toHaveBeenCalledWith({ rating: null, review: "" });
  });

  test("loads saved values and cancel does not overwrite them", async () => {
    const user = userEvent.setup();
    const onComplete = jest.fn();
    const onClose = jest.fn();

    render(
      <CompletionForm
        itemName="Past Lives"
        initialRating={4}
        initialReview="Already saved"
        onComplete={onComplete}
        onClose={onClose}
      />
    );

    expect(screen.getByLabelText("Review (optional)")).toHaveValue("Already saved");
    expect(screen.getByRole("button", { name: "Rate 4 out of 5 stars" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onComplete).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("shows a submission error and keeps the modal open", async () => {
    const user = userEvent.setup();
    const onComplete = jest.fn().mockRejectedValue(new Error("Request failed"));
    const onClose = jest.fn();

    render(
      <CompletionForm
        itemName="Past Lives"
        onComplete={onComplete}
        onClose={onClose}
      />
    );

    await user.click(screen.getByRole("button", { name: "Skip rating" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Request failed");
    expect(onClose).not.toHaveBeenCalled();
  });
});
