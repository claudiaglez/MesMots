import React from 'react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '../../app/ui/breadcrumb'; 

const PageLayout = ({ children, breadcrumbItems }) => {
  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.isCurrent ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Contenido principal de la página */}
      {children}
    </div>
  );
};

export default PageLayout;