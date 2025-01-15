import React from "react";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "../components/ui/Card";

describe("Card Component", () => {
    test("renders Card with all subcomponents", () => {
      // Renderiza el Card con todas sus subcomponentes
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
  
      // Verifica que el div principal tenga la clase "custom-card"
      const cardContainer = container.querySelector(".custom-card");
      expect(cardContainer).toBeInTheDocument();
  
      // Verifica el título del Card
      const title = screen.getByText("Card Title");
      expect(title.parentElement).toHaveClass("custom-header");
  
      // Verifica el footer
      const footer = screen.getByText("Footer Content");
      const footerContainer = footer.closest("div");  // Busca el contenedor más cercano
      expect(footerContainer).toHaveClass("custom-footer");
    });
  });