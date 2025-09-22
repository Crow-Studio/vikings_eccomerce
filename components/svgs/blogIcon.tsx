import React, { SVGProps } from "react";
export function BlogIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4 3C2.89543 3 2 3.89543 2 5V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V5C22 3.89543 21.1046 3 20 3H4ZM4 5H20V8H4V5ZM4 10H20V19H4V10ZM6 12C5.44772 12 5 12.4477 5 13C5 13.5523 5.44772 14 6 14H12C12.5523 14 13 13.5523 13 13C13 12.4477 12.5523 12 12 12H6ZM5 16C5 15.4477 5.44772 15 6 15H18C18.5523 15 19 15.4477 19 16C19 16.5523 18.5523 17 18 17H6C5.44772 17 5 16.5523 5 16ZM9 6.5C9 6.22386 9.22386 6 9.5 6H14.5C14.7761 6 15 6.22386 15 6.5C15 6.77614 14.7761 7 14.5 7H9.5C9.22386 7 9 6.77614 9 6.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
export default BlogIcon;