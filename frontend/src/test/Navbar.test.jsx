import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/ui/Navbar";

const mockUseAuth = jest.fn();

jest.mock("../hooks/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("Navbar", () => {
  test("shows authentication links for signed-out users", () => {
    mockUseAuth.mockReturnValue({ user: null, logOut: jest.fn() });

    render(<MemoryRouter><Navbar /></MemoryRouter>);

    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute("href", "/signup");
  });

  test("logs out signed-in users", async () => {
    const user = userEvent.setup();
    const logOut = jest.fn();
    mockUseAuth.mockReturnValue({ user: { username: "Alex" }, logOut });

    render(<MemoryRouter><Navbar /></MemoryRouter>);
    await user.click(screen.getByRole("button", { name: "Log out" }));

    expect(logOut).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("link", { name: "My List" })).toHaveAttribute(
      "href",
      "/recommendations"
    );
  });
});
