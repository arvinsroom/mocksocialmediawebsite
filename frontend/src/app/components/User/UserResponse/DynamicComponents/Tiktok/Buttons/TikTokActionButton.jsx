export const LikeIcon = ({ filled = false, width = 24, height = 24 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 90 90"
    fill={filled ? "#FE2C55" : "white"}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M49.086 86.014c63.144-36.408 45.619-102.836-1.374-77.497c-1.695 0.914-3.729 0.914-5.424 0c-46.992-25.339-64.518 41.088-1.374 77.497C43.436 87.468 46.564 87.468 49.086 86.014z" />
  </svg>
);

// Bookmark Icon
export const BookmarkIcon = ({ filled = false, width = 24, height = 24 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 90 90"
    fill={filled ? "#FFC83C" : "white"}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M45 0H13.097C9.941 0 7.383 2.558 7.383 5.714v80.779c0 2.759 3.043 4.434 5.374 2.959l28.155-17.82c2.497-1.58 5.68-1.58 8.177 0l28.155 17.82c2.331 1.475 5.374-0.2 5.374-2.959V5.714C82.617 2.558 80.059 0 76.903 0H45z" />
  </svg>
);

// Comment Icon
export const CommentIcon = ({ filled = false, width = 24, height = 24 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 90 90"
    fill={filled ? "#fff" : "white"}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M45 4.261c-24.853 0-45 15.715-45 35.1c0 18.992 19.338 34.461 43.493 35.081C44.328 74.463 45 75.132 45 75.968v8.088c0 0.973 0.822 1.74 1.793 1.68C64.906 84.619 90 66.921 90 39.361C90 19.976 69.853 4.261 45 4.261zM27.086 42.229c0 0.874-0.709 1.583-1.583 1.583h-4.835c-0.874 0-1.583-0.709-1.583-1.583v-4.835c0-0.874 0.709-1.583 1.583-1.583h4.835c0.874 0 1.583 0.709 1.583 1.583V42.229zM49 42.229c0 0.874-0.709 1.583-1.583 1.583h-4.835c-0.874 0-1.583-0.709-1.583-1.583v-4.835c0-0.874 0.709-1.583 1.583-1.583h4.835c0.874 0 1.583 0.709 1.583 1.583V42.229zM70.914 42.229c0 0.874-0.709 1.583-1.583 1.583h-4.835c-0.874 0-1.583-0.709-1.583-1.583v-4.835c0-0.874 0.709-1.583 1.583-1.583h4.835c0.874 0 1.583 0.709 1.583 1.583V42.229z" />
  </svg>
);

// Share Icon
export const ShareIcon = ({ filled = false, width = 24, height = 24 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 90 90"
    fill={filled ? "#fff" : "white"}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M89.411 43.577L53.66 7.826c-0.782-0.782-2.119-0.228-2.119 0.878v18.205C24.39 26.909 5.901 45.02 0.03 73.894c-0.262 1.287 1.268 2.236 2.298 1.421c16.266-12.872 31.546-12.3 49.214-12.3v18.281c0 1.106 1.337 1.66 2.119 0.878l35.75-35.75C90.196 45.637 90.196 44.363 89.411 43.577z" />
  </svg>
);

export const LoadingPlaceholder = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 540 960"
    style={{ width: "100%", height: "100%" }}
  >
    <rect width="100%" height="100%" fill="#f8f9fa" />
    <circle cx="270" cy="480" r="80" fill="#e9ecef" />
    <path d="M250,440 L310,480 L250,520 Z" fill="#adb5bd" />
    <text
      x="270"
      y="600"
      fontFamily="Arial, sans-serif"
      fontSize="24"
      textAnchor="middle"
      fill="#6c757d"
    >
      Loading video...
    </text>
  </svg>
);

export const ErrorPlaceholder = ({ errorMessage = "Video unavailable" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 540 960"
    style={{ width: "100%", height: "100%" }}
  >
    <rect width="100%" height="100%" fill="#f8f9fa" />
    <circle cx="270" cy="450" r="80" fill="#e9ecef" />
    <path
      d="M230,410 L310,490 M310,410 L230,490"
      stroke="#adb5bd"
      strokeWidth="12"
      strokeLinecap="round"
    />
    <text
      x="270"
      y="580"
      fontFamily="Arial, sans-serif"
      fontSize="24"
      textAnchor="middle"
      fill="#6c757d"
    >
      {errorMessage}
    </text>
    <text
      x="270"
      y="620"
      fontFamily="Arial, sans-serif"
      fontSize="18"
      textAnchor="middle"
      fill="#adb5bd"
    >
      Please try again later
    </text>
  </svg>
);

export const VerifiedIcon = () => (
  <svg
    font-size="14px"
    viewBox="0 0 48 48"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
  >
    <g clip-path="url(#Icon_Color-Verified_Badge_svg__a)">
      <path d="M0 24a24 24 0 1 1 48 0 24 24 0 0 1-48 0Z" fill="#20D5EC"></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M37.12 15.88a3 3 0 0 1 0 4.24l-13.5 13.5a3 3 0 0 1-4.24 0l-8.5-8.5a3 3 0 1 1 4.24-4.24l6.38 6.38 11.38-11.38a3 3 0 0 1 4.24 0Z"
        fill="#fff"
      ></path>
    </g>
    <defs>
      <clipPath id="Icon_Color-Verified_Badge_svg__a">
        <path fill="#fff" d="M0 0h48v48H0z"></path>
      </clipPath>
    </defs>
  </svg>
);
