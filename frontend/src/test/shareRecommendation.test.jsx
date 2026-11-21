import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShareRecommendation from "../components/ui/ShareRecommendation";

describe("ShareRecommendation", () => {
  let writeText;
  let nativeShare;

  beforeEach(() => {
    writeText = jest.fn().mockResolvedValue(undefined);
    nativeShare = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    Object.defineProperty(window.navigator, "share", {
      configurable: true,
      value: nativeShare,
    });
  });

  test("creates a link only after opening and supports copy, X, email, and native share", async () => {
    const user = userEvent.setup();
    const onCreateShare = jest.fn().mockResolvedValue("http://localhost:5173/share/abc123");

    render(
      <ShareRecommendation
        itemName="Past Lives"
        onCreateShare={onCreateShare}
        onClose={jest.fn()}
      />
    );

    expect(await screen.findByText("http://localhost:5173/share/abc123")).toBeInTheDocument();
    expect(onCreateShare).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("link", { name: "Post on X" })).toHaveAttribute("href", expect.stringContaining("x.com/intent/post"));
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute("href", expect.stringContaining("mailto:"));

    await user.click(screen.getByRole("button", { name: "Copy link" }));
    expect(screen.getByRole("status")).toHaveTextContent("Link copied!");

    await user.click(screen.getByRole("button", { name: "Share" }));
    expect(nativeShare).toHaveBeenCalledWith({
      title: "Past Lives",
      url: "http://localhost:5173/share/abc123",
    });
  });

  test("shows link creation errors", async () => {
    const onCreateShare = jest.fn().mockRejectedValue(new Error("Could not create link"));

    render(
      <ShareRecommendation
        itemName="Past Lives"
        onCreateShare={onCreateShare}
        onClose={jest.fn()}
      />
    );

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Could not create link"));
  });
});