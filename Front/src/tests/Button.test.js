import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "../components/ui/Button"; 

describe("Button Component", () => {
  it("should render with default styles", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByText("Click me");

    // Verifica que el botón tiene la clase predeterminada
    expect(button).toHaveClass("bg-green", "text-lightPink");
    expect(button).toHaveClass("hover:bg-lightPink/90", "hover:text-green");
  });
  });
