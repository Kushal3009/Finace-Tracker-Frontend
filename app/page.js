import Image from "next/image";
import { configDotenv } from "dotenv";
import Dashboard from "./components/Dashboard";

configDotenv();

export default function Home() {
  return (
    <>
      <Dashboard />
    </>
  );
}
