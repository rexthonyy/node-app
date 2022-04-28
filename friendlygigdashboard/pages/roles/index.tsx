import type { NextPage } from "next";
import Layout from "../../components/layouts/Layout";
import RolesTable from "../../components/tables/RoleTable";

const GroupPage: NextPage = () => {
  return (
    <Layout baseUrl={{ link: `/roles`, label: "Roles" }}>
      <RolesTable />
    </Layout>
  );
};

export default GroupPage;
