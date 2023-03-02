import { useEffect } from "react";
import {
  PageSection,
  Tab,
  TabTitleText,
  DropdownItem,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useRealm } from "../context/realm-context/RealmContext";
import { useAlerts } from "../components/alert/Alerts";
import useOrgFetcher from "./useOrgFetcher";
import type { OrgParams } from "./routes/Org";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { KeycloakTabs } from "../components/keycloak-tabs/KeycloakTabs";
import OrgMembers from "./OrgMembers";
import OrgInvitations from "./OrgInvitations";
import OrgRoles from "./OrgRoles";
import { PortalLink } from "../components/portal-link/PortalLink";
import useToggle from "../utils/useToggle";
import OrgIdentityProviders from "./OrgIdentityProviders";
import OrgSettings from "./OrgSettings";
import OrgAttributes from "./OrgAttributes";

export default function OrgDetails() {
  const { orgId } = useParams<OrgParams>();
  const { t } = useTranslation("orgs");
  const { addError } = useAlerts();
  const [portalLinkOpen, togglePortalLinkOpen] = useToggle(false);

  const { realm } = useRealm();
  const { getOrg, org } = useOrgFetcher(realm);

  useEffect(() => {
    getOrg(orgId).catch((e) => addError(t("errorFetching"), e));
  }, []);

  if (!org) return <div></div>;

  const dropdownItems = [
    <DropdownItem key="download" onClick={togglePortalLinkOpen}>
      {t("generatePortalLink")}
    </DropdownItem>,
  ];

  return (
    <>
      <ViewHeader
        titleKey={org.displayName}
        divider={false}
        dropdownItems={dropdownItems}
      />
      <PortalLink
        id="id"
        open={portalLinkOpen}
        toggleDialog={togglePortalLinkOpen}
      />
      <PageSection variant="light" className="pf-u p-0">
        <KeycloakTabs data-testid="orgs-tabs" isBox mountOnEnter>
          <Tab
            id="details"
            eventKey="details"
            title={<TabTitleText>{t("common:settings")}</TabTitleText>}
          >
            <OrgSettings org={org} />
          </Tab>
          <Tab
            id="attributes"
            eventKey="attributes"
            title={<TabTitleText>Attributes</TabTitleText>}
          >
            <OrgAttributes org={org} />
          </Tab>
          <Tab
            id="members"
            eventKey="members"
            title={<TabTitleText>Members</TabTitleText>}
          >
            <OrgMembers org={org} />
          </Tab>
          <Tab
            id="invitations"
            eventKey="invitations"
            title={<TabTitleText>Invitations</TabTitleText>}
          >
            <OrgInvitations org={org} />
          </Tab>
          <Tab
            id="roles"
            eventKey="roles"
            title={<TabTitleText>Roles</TabTitleText>}
          >
            <OrgRoles org={org} />
          </Tab>
          <Tab
            id="identityproviders"
            eventKey="identityproviders"
            title={<TabTitleText>Identity Providers</TabTitleText>}
          >
            <OrgIdentityProviders org={org} />
          </Tab>
        </KeycloakTabs>
      </PageSection>
    </>
  );
}
