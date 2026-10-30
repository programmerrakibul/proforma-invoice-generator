import { redirect } from "next/navigation";

const Home = () => {
  return redirect("/dashboard/invoices");
};

export default Home;
