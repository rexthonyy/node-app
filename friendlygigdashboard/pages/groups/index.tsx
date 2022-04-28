import type { NextPage } from "next";
import Layout from "../../components/layouts/Layout";
import GroupsTable from "../../components/tables/GroupTable";

const GroupPage: NextPage = () => {
  return (
    <Layout baseUrl={{ link: `/groups`, label: "Group" }}>
      <GroupsTable />
    </Layout>
  );
};

export default GroupPage;
