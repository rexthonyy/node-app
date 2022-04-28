import type { NextPage } from "next";
import Layout from "../../components/layouts/Layout";

const GroupPage: NextPage = () => {
  return <Layout baseUrl={{ link: `/text-modules`, label: "Text Modules" }}></Layout>;
};

export default GroupPage;
