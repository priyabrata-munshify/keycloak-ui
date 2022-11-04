import type { RouteDef } from "../route-config";
import { OrgsRoute } from "./routes/Orgs";
import { OrgRoute } from "./routes/Org";

export type OrgRepresentation = {
  id: string;
  name: string;
  displayName: string;
  url: string;
  domains: string[];
  attributes: any;
};

const routes: RouteDef[] = [OrgsRoute, OrgRoute];

export default routes;
