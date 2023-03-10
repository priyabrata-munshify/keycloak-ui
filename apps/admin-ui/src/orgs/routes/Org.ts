import type { RouteDef } from "../../route-config";
import { lazy } from "react";
import { generatePath, Path } from "react-router-dom";

export type OrgTab =
  | "settings"
  | "attributes"
  | "members"
  | "invitations"
  | "roles"
  | "identityproviders";

export type OrgParams = {
  realm: string;
  orgId: string;
  tab: OrgTab;
};

export const OrgRoute: RouteDef = {
  path: "/:realm/organizations/:orgId/:tab",
  component: lazy(() => import("../OrgDetails")),
  breadcrumb: (t) => t("orgs:orgDetails"),
  access: "view-clients",
};

export const toOrg = (params: OrgParams): Partial<Path> => ({
  pathname: generatePath(OrgRoute.path, params),
});
