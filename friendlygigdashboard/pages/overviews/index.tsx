import type { NextPage } from "next";
import Layout from "../../components/layouts/Layout";

const GroupPage: NextPage = () => {
  return <Layout baseUrl={{ link: `/overviews`, label: "Overviews" }}></Layout>;
};

export default GroupPage;
