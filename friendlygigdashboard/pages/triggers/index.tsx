import type { NextPage } from "next";
import Layout from "../../components/layouts/Layout";

const GroupPage: NextPage = () => {
  return <Layout baseUrl={{ link: `/triggers`, label: "Triggers" }}></Layout>;
};

export default GroupPage;
