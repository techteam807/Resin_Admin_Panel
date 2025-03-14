import {
  HomeIcon,
  UserCircleIcon,
  ServerStackIcon,
} from "@heroicons/react/24/solid";
import { Company, Product } from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";
import { HiBuildingOffice } from "react-icons/hi2";
import Home from "./pages/dashboard/Home";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Users",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Products",
        path: "/products",
        element: <Product />,
      },
      {
        icon: <HiBuildingOffice {...icon} />,
        name: "Warehouse",
        path: "/warehouse",
        element: <Company />,
      },
      // {
      //   icon: <MdDiscount {...icon} />,
      //   name: "Discount",
      //   path: "/discount",
      //   element: <Discount />,
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
