import React, { useEffect } from "react";
import {
  PageSection,
  Tab,
  Form,
  TabTitleText,
  Button,
  ActionGroup,
  Grid,
  GridItem,
  AlertVariant,
  DropdownItem,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import type { OrgRepresentation } from "./routes";
import { useRealm } from "../context/realm-context/RealmContext";
import { useAlerts } from "../components/alert/Alerts";
import useOrgFetcher from "./useOrgFetcher";
import type { OrgParams } from "./routes/Org";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { KeycloakTabs } from "../components/keycloak-tabs/KeycloakTabs";
import { FormProvider, useForm } from "react-hook-form";
import { defaultOrgState, OrgFormType } from "./modals/NewOrgModal";
import OrgMembers from "./OrgMembers";
import type { KeyValueType } from "../components/key-value-form/key-value-convert";
import { arrayToKeyValue } from "../components/key-value-form/key-value-convert";
import {
  AttributeForm,
  AttributesForm,
} from "../components/key-value-form/AttributeForm";
import OrgInvitations from "./OrgInvitations";
import OrgRoles from "./OrgRoles";
import { OrgFields } from "./form/OrgFields";
import { PortalLink } from "../components/portal-link/PortalLink";
import useToggle from "../utils/useToggle";

type AttributesForm = {
  attributes?: KeyValueType[];
};

export default function OrgDetails() {
  const { orgId } = useParams<OrgParams>();
  const { t } = useTranslation("orgs");
  const { addAlert, addError } = useAlerts();
  const [portalLinkOpen, togglePortalLinkOpen] = useToggle(false);

  const { realm } = useRealm();
  const organizationForm = useForm<OrgFormType>({
    defaultValues: defaultOrgState,
    mode: "onChange",
    shouldUnregister: false,
  });
  const {
    handleSubmit,
    reset,
    getValues,
    formState: { isDirty },
  } = organizationForm;
  const { getOrg, org, updateOrg } = useOrgFetcher(realm);

  useEffect(() => {
    getOrg(orgId).catch((e) => addError(t("errorFetching"), e));
  }, []);

  useEffect(() => {
    organizationForm.setValue("name", org?.name);
    organizationForm.setValue("displayName", org?.displayName);
    organizationForm.setValue("url", org?.url);
    organizationForm.setValue("domains", org?.domains);
    if (org?.attributes) {
      const attributes = convertAttributes();
      attributesForm.setValue("attributes", attributes);
    }
  }, [org]);

  const attributesForm = useForm<AttributeForm>({
    mode: "onChange",
    shouldUnregister: false,
  });

  const convertAttributes = (attr?: Record<string, any>) => {
    return arrayToKeyValue(attr || org?.attributes);
  };

  async function saveAttributes(data: any) {
    if (org) {
      const attributes: any = {};
      data.attributes.forEach((item: any) => {
        attributes[item.key] = [item.value];
      });
      const updatedData: OrgRepresentation = { ...org, attributes };
      await updateOrg(updatedData);
      addAlert("Attributes updated for organization");
    }
  }

  function resetAttributes() {
    console.log("Implement attributes reset");
  }

  const save = async () => {
    if (org) {
      const orgData: OrgFormType = getValues();
      const updatedData: OrgRepresentation = {
        ...org,
        ...orgData,
        // domains: orgData.domains.map((d) => d.value).filter((d) => d),
      };

      const res = await updateOrg(updatedData);
      if (res.success) {
        addAlert("Organization saved.");
      } else {
        addAlert(res.message, AlertVariant.danger);
      }
    }
  };

  function resetForm() {
    if (org) {
      reset({
        ...org,
      });
    }
  }

  // function resetAttributesForm() {
  //   if (org) {
  //     const data = {
  //       attributes: Object.keys(org.attributes).map((key) => {
  //         return { key: key, value: org.attributes[key][0] };
  //       }),
  //     };
  //     attributesForm.reset(data);
  //   }
  // }

  function revert() {
    resetForm();
  }

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
            <Grid hasGutter className="pf-u-px-lg pf-u-mt-xl">
              <GridItem span={8}>
                <FormProvider {...organizationForm}>
                  <Form
                    isHorizontal
                    onSubmit={handleSubmit(() => console.log("Submitted"))}
                  >
                    <OrgFields />
                    <ActionGroup className="">
                      <Button onClick={save} disabled={!isDirty}>
                        {t("save")}
                      </Button>
                      <Button variant="link" onClick={revert}>
                        {t("revert")}
                      </Button>
                    </ActionGroup>
                  </Form>
                </FormProvider>
              </GridItem>
            </Grid>
          </Tab>
          <Tab
            id="attributes"
            eventKey="attributes"
            title={<TabTitleText>Attributes</TabTitleText>}
          >
            <AttributesForm
              form={attributesForm}
              save={saveAttributes}
              reset={resetAttributes}
            />
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
        </KeycloakTabs>
      </PageSection>
    </>
  );
}
