import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "../components/ui/Button"; 

describe("Button Component", () => {
  it("should render with default styles", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByText("Click me");

    expect(button).toHaveClass("bg-green", "text-lightPink");
    expect(button).toHaveClass("hover:bg-lightPink/90", "hover:text-green");
  });

  it("should render with custom size", () => {
    render(<Button size="lg">Large Button</Button>);

    const button = screen.getByText("Large Button");

    expect(button).toHaveClass("h-11", "px-8");
  });

  it("should apply the 'secondary' variant", () => {
    render(<Button variant="secondary">Secondary Button</Button>);

    const button = screen.getByText("Secondary Button");

    expect(button).toHaveClass("bg-blue", "text-lightPink");
    expect(button).toHaveClass("hover:bg-lightPink", "hover:text-blue");
  });


  });
