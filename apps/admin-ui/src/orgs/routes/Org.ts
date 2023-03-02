import type { LocationDescriptorObject } from "history";
import type { RouteDef } from "../../route-config";
import { lazy } from "react";
import { generatePath } from "react-router-dom";

export type OrgTab = "details" | "membership";

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

export const toOrg = (params: OrgParams): LocationDescriptorObject => ({
  pathname: generatePath(OrgRoute.path, params),
});
