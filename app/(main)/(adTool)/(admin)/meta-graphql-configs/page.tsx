import { getMetaGraphQLConfigs } from "@/actions/meta-graphql-config-actions";

import MetaGraphQLConfigForm from "@/components/adTool/meta-graphql-configs/MetaGraphQLConfigForm";
import MetaGraphQLConfigList from "@/components/adTool/meta-graphql-configs/MetaGraphQLConfigList";

export default async function MetaGraphQLConfigsPage() {
  const { data: configs = [] } = await getMetaGraphQLConfigs();

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Meta GraphQL Configurations</h1>
      <div className="grid grid-cols-1 gap-6">
        <MetaGraphQLConfigForm />
        <MetaGraphQLConfigList initialConfigs={configs} />
      </div>
    </div>
  );
}
