import React from "react";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "../components/ui/Card";

describe("Card Component", () => {
    it("renders Card with all subcomponents", () => {
      const { container } = render(
        <Card className="custom-card">
          <CardHeader className="custom-header">
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>Card Content</CardContent>
          <CardFooter className="custom-footer">Footer Content</CardFooter>
        </Card>
      );
  
      const cardContainer = container.querySelector(".custom-card");
      expect(cardContainer).toBeInTheDocument();
  
      const title = screen.getByText("Card Title");
      expect(title.parentElement).toHaveClass("custom-header");

      const footer = screen.getByText("Footer Content");
      const footerContainer = footer.closest("div");  
      expect(footerContainer).toHaveClass("custom-footer");
    });
  });