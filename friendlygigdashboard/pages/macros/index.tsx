import type { NextPage } from "next";
import Layout from "../../components/layouts/Layout";

const GroupPage: NextPage = () => {
  return <Layout baseUrl={{ link: `/macros`, label: "Macros" }}></Layout>;
};

export default GroupPage;
