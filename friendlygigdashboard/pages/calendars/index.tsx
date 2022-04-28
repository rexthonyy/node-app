import type { NextPage } from "next";
import Layout from "../../components/layouts/Layout";

const GroupPage: NextPage = () => {
  return <Layout baseUrl={{ link: `/calendars`, label: "Calendars" }}></Layout>;
};

export default GroupPage;
