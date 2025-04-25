import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import logo from "../../../public/img/BetterwaterTM_White.png"

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType, openSidenav } = controller;
  const [openDropdowns, setOpenDropdowns] = useState({});
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  controller.sidenavColor = "dark";
  controller.sidenavType = "dark";

  const handleNavLinkClick = () => {
    if (openSidenav) {
      setOpenSidenav(dispatch, false);
    }
  };

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <aside
      className={`bg-gradient-to-br from-gray-800 to-gray-900 ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100 overflow-y-auto`}
      style={{ scrollbarWidth: "none", /* Firefox */ overflow: "-ms-autohide-scrollbar" /* Edge */ }}
    >
      <div className={`relative border-b`}>
        <Link to="/dashboard/home" className="py-6 px-8 text-center">
          <Typography
            variant="h6"
            color="white"
          >
            {/* {brandName} */}
            <img src={logo} className="w-40 mx-auto" alt="Better Water"></img>
          </Typography>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4">
        <div className="overflow-y-auto">
          {routes.map(({ layout, title, pages }, key) => (
            <ul key={key} className="mb-4 flex flex-col gap-1">
              {title && (
                <li className="mx-3.5 mt-4 mb-2">
                  <Typography
                    variant="small"
                    color="white"
                    className="font-black uppercase opacity-75"
                  >
                    {title}
                  </Typography>
                </li>
              )}
              {pages.map(({ icon, name, path, children }) => (
                <li key={name}>
                  {children ? (
                    <div className="group">
                      <Button
                        variant="text"
                        color="white"
                        onClick={() => toggleDropdown(name)}
                        className="flex items-center justify-between w-full gap-4 px-4 capitalize"
                        fullWidth
                      >
                        <div className="flex items-center gap-4">
                          {icon}
                          <Typography color="inherit" className="font-medium capitalize">
                            {name}
                          </Typography>
                        </div>
                        <span
                          className={`transition-transform ${
                            openDropdowns[name] ? "rotate-90" : ""
                          }`}
                        >
                          &#x25B6;
                        </span>
                      </Button>
                      {openDropdowns[name] && (
                        <ul className="ml-6 mt-1 flex flex-col gap-1">
                          {children.map(({ icon, name, path }) => (
                            <li key={name}>
                              <NavLink to={`/dashboard${path}`} onClick={handleNavLinkClick}>
                                {({ isActive }) => (
                                  <Button
                                    variant={isActive ? "gradient" : "text"}
                                    color="white"
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                  >
                                    {icon}
                                    <Typography
                                      color="inherit"
                                      className="font-medium capitalize"
                                    >
                                      {name}
                                    </Typography>
                                  </Button>
                                )}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <NavLink to={`/${layout}${path}`} onClick={handleNavLinkClick}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "gradient" : "text"}
                          color="white"
                          className="flex items-center gap-4 px-4 capitalize"
                          fullWidth
                        >
                          {icon}
                          <Typography color="inherit" className="font-medium capitalize">
                            {name}
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "BW Scan App",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
