import type { LocationDescriptorObject } from "history";
import { lazy } from "react";
import { generatePath } from "react-router-dom";
import type { RouteDef } from "../../route-config";

export type StylesParams = {
  realm: string;
};

export const StylesRoute: RouteDef = {
  path: "/:realm/styles",
  component: lazy(() => import("../StylesSection")),
  breadcrumb: (t) => t("styles"),
  // breadcrumb: (t) => "Styles",
  access: "query-clients",
};

export const toOrgs = (params: StylesParams): LocationDescriptorObject => ({
  pathname: generatePath(StylesRoute.path, params),
});
