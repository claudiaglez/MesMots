import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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

  it("should render as a 'Slot' when 'asChild' is true", () => {
    render(
      <Button asChild={true}>
        <a href="#">As a link</a>
      </Button>
    );

    const link = screen.getByText("As a link");

    expect(link.tagName).toBe("A");
  });

  it("should render with a circle size", () => {
    render(<Button size="circle">Circle Button</Button>);

    const button = screen.getByText("Circle Button");

    expect(button).toHaveClass("h-12", "w-12", "rounded-full");
  });

  it("should apply the 'filter' variant", () => {
    render(<Button variant="filter">Filter Button</Button>);
  
    const button = screen.getByText("Filter Button");
  
    expect(button).toHaveClass("border-2", "border-darkPink", "text-darkPink", "bg-cream");
    expect(button).toHaveClass("hover:bg-darkPink", "hover:text-cream");
  });
  
  it("should be disabled when 'disabled' is true", () => {
    render(<Button disabled>Disabled Button</Button>);
  
    const button = screen.getByText("Disabled Button");
  
    expect(button).toHaveClass("disabled:pointer-events-none", "disabled:opacity-50");
    expect(button).toBeDisabled(); 
  });

  it("should trigger onClick event when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
  
    const button = screen.getByText("Click me");
    fireEvent.click(button);
  
    expect(handleClick).toHaveBeenCalledTimes(1); 
  });
  
  

  });
