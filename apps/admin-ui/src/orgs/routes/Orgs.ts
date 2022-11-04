import type { LocationDescriptorObject } from "history";
import { lazy } from "react";
import { generatePath } from "react-router-dom";
import type { RouteDef } from "../../route-config";

export type OrgsParams = {
  realm: string;
};

export const OrgsRoute: RouteDef = {
  path: "/:realm/organizations",
  component: lazy(() => import("../OrgsSection")),
  breadcrumb: (t) => t("orgs:orgList"),
  access: "query-clients",
};

export const toOrgs = (params: OrgsParams): LocationDescriptorObject => ({
  pathname: generatePath(OrgsRoute.path, params),
});
