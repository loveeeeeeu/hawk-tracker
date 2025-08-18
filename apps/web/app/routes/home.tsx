// import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import DashboardPage from "@/views/dashboardPage/DashboardPage";
import { Route } from ".react-router/types/app/+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <DashboardPage/>
  
  // return <Welcome />;
}
