import {HomeIcon,UserCircleIcon,ServerStackIcon,CogIcon, CircleStackIcon, PresentationChartBarIcon, MapPinIcon} from "@heroicons/react/24/solid";
import { Company, Product } from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";
import { HiBuildingOffice } from "react-icons/hi2";
import Home from "./pages/dashboard/Home";
import Technician from "./pages/dashboard/Technician";
import TechnicianLog from "./pages/dashboard/TechnicianLog";
import ProductDesign from "./pages/dashboard/ProductDesign";
import WareHouse from "./pages/dashboard/WareHouse";
import ProductLog from "./pages/dashboard/ProductLog";
import Map from "./pages/dashboard/Map";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Customers",
        path: "/home",
        element: <Home />,
      },
      // {
      //   icon: <UserCircleIcon {...icon} />,
      //   name: "Products",
      //   path: "/products",
      //   element: <Product />,
      // },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Products",
        path: "/products",
        element: <ProductDesign />,
      },
      {
        icon: <HiBuildingOffice {...icon} />,
        name: "Warehouse",
        path: "/warehouse",
        element: <WareHouse />,
      },
      {
        icon: <CogIcon {...icon} />,
        name: "Technician",
        path: "/technician",
        element: <Technician />,
      },
      // {
      //   icon: <MapPinIcon {...icon} />,
      //   name: "Location",
      //   path: "/location",
      //   element: <Map />,
      // },
      // {
      //   icon: <CircleStackIcon {...icon} />,
      //   name: "Technician Log",
      //   path: "/technicianLog",
      //   element: <TechnicianLog />,
      // },
      {
        icon: <PresentationChartBarIcon {...icon} />,
        name: "Product Log",
        path: "/product-log",
        element: <ProductLog />,
      },
    ],
  },
  {
    // title: "Logout",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign out",
        path: "/sign-in",
        element: <SignIn />,
      },
    ],
  },

];

export default routes;
