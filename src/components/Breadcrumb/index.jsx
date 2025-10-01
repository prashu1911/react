import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb as BsBreadcrumb } from 'react-bootstrap';

export default function Breadcrumb({ breadcrumb }) {
  return (
    <>
      {breadcrumb && (
        <BsBreadcrumb>
            {breadcrumb.map((item, key) => {
              return item.path === "#!" ? (
                <li className="breadcrumb-item" key={key}>
                  {item.name}
                </li>
              ) : item.path !== "#" ? (
                <li className="breadcrumb-item" key={key}>
                  <Link to={item.path}>{item.name}</Link>
                </li>
              ) : (
                <li className="breadcrumb-item active" key={key}>
                  {item.name}
                </li>
              );
            })}
        </BsBreadcrumb>
      )}
    </>
  );
}
