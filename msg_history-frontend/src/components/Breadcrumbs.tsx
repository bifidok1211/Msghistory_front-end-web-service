import React from 'react';
import { Link } from 'react-router-dom';
import type { ICrumb } from '../types';
import './styles/Breadcrumbs.css';

interface BreadcrumbsProps {
  crumbs: ICrumb[];
}

export const CustomBreadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs }) => {
  const allCrumbs = [{ label: 'Главная', path: '/' }, ...crumbs];

  return (
    <nav className="modern-breadcrumbs">
      {allCrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          <div className="breadcrumb-item">
            {crumb.active || index === allCrumbs.length - 1 ? (
              <span className="breadcrumb-active">{crumb.label}</span>
            ) : (
              <Link to={crumb.path || '#'} className="breadcrumb-link">
                {crumb.label}
              </Link>
            )}
          </div>
          {index < allCrumbs.length - 1 && (
            <span className="breadcrumb-separator">›</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
