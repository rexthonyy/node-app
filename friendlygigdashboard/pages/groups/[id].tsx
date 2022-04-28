import type { NextPage } from "next";
import GroupForm from "../../components/forms/GroupForm";
import Layout from "../../components/layouts/Layout";
import { usePage } from "../../context/PageContext";

const AddUserPage: NextPage = () => {
  const { formData } = usePage();

  return (
    <Layout baseUrl={{ link: `/users`, label: "Users" }}>
      <GroupForm formData={formData} />
    </Layout>
  );
};

export default AddUserPage;
