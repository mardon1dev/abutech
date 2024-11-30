import { Link } from "react-router-dom";

import LogoImage from "../assets/logo.svg";

const NotFound = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
            <img src={LogoImage} alt="Najot Ta;lim" width={200} height={40} />
        <h1 className="text-xl font-bold mb-5 mt-[30px]">Page Not Found</h1>
      <Link to={"/"}>Login Page</Link>
        </div>
    </div>
  );
};

export default NotFound;
