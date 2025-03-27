import {HomeIcon,UserCircleIcon,ServerStackIcon,CogIcon, CircleStackIcon} from "@heroicons/react/24/solid";
import { Company, Product } from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";
import { HiBuildingOffice } from "react-icons/hi2";
import Home from "./pages/dashboard/Home";
import Technician from "./pages/dashboard/Technician";
import TechnicianLog from "./pages/dashboard/TechnicianLog";
import ProductDesign from "./pages/dashboard/ProductDesign";
import WareHouse from "./pages/dashboard/WareHouse";

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
      //   icon: <CircleStackIcon {...icon} />,
      //   name: "Technician Log",
      //   path: "/technicianLog",
      //   element: <TechnicianLog />,
      // },
      // {
      //   icon: <IoLogoFirebase {...icon} />,
      //   name: "Emergency",
      //   path: "/emergency",
      //   element: <Emergency />,
      // },
      // {
      //   icon: <BiSolidComponent {...icon} />,
      //   name: "Component",
      //   path: "/component",
      //   element: <Component />,
      // },
      // {
      //   icon: <PiFlagBannerFill {...icon} />,
      //   name: "Banner",
      //   path: "/banner",
      //   element: <Banner />,
      // },
      // {
      //   icon: <FaShoppingCart {...icon} />,
      //   name: "Supplier",
      //   path: "/supplier",
      //   element: <Supplier />,
      // },
      // {
      //   icon: <RiCustomerServiceFill {...icon} />,
      //   name: "Service",
      //   path: "/service",
      //   element: <Service />,
      // },
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
