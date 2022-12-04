import { useEffect, useState } from "react";
import type { OrgRepresentation } from "./routes";
import useOrgFetcher from "./useOrgFetcher";
import { useRealm } from "../context/realm-context/RealmContext";
import {
  ActionGroup,
  Button,
  Text,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Grid,
  GridItem,
  TextVariants,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
// import { first } from "lodash-es";
import { useAdminClient } from "../context/auth/AdminClient";
import IdentityProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/identityProviderRepresentation";

type OrgIdentityProvidersProps = {
  org: OrgRepresentation;
};

export default function OrgIdentityProviders({
  org,
}: OrgIdentityProvidersProps) {
  console.log("[OrgIdentityProviders org]", org);

  const { realm } = useRealm();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { updateIdentityProvider } = useOrgFetcher(realm);
  const { t } = useTranslation("orgs");
  const [idps, setIdps] = useState<IdentityProviderRepresentation[]>([]);
  const [selectedIdP, setSelectedIdP] =
    useState<IdentityProviderRepresentation>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [enabledIdP, setEnabledIdP] =
    useState<IdentityProviderRepresentation>();
  const { adminClient } = useAdminClient();

  console.log("[adminClient]", adminClient);

  async function getIDPs() {
    const identityProviders = await adminClient.identityProviders.find({
      realm,
    });
    console.log("[identityProviders]", identityProviders);
    setIdps(identityProviders);

    // at least one IdP?
    // find the enabled IdP applicable to this org
    // const enabledIdP = identityProviders.find(
    //   (idp) => idp.config.org === org.id && idp.enabled
    // );
    // if (enabledIdP) {
    //   setEnabledIdP(enabledIdP);
    // }
  }

  useEffect(() => {
    getIDPs();
  }, []);

  const onChange = (value: string) => {
    setSelectedIdP(value);
  };

  const save = async () => {
    console.log("Wire me up");
    //let idpUpdate = await updateIdentityProvider(org.id, selectedIdP);
  };

  const options = [
    { value: "please choose", label: "Select one", disabled: true },
    ...idps.map((idp) => ({
      value: idp.alias,
      label: idp.displayName,
      disabled: false,
    })),
  ];

  let body = (
    <Text component={TextVariants.h1}>No IdPs assigned to this Org.</Text>
  );

  const buttonsDisabled = !selectedIdP && selectedIdP === enabledIdP;

  // TODO: change this once dev is done, should be > 0
  if (idps.length >= 0) {
    body = (
      <div>
        <Text component={TextVariants.h1}>
          <strong>Active Identity Provider</strong>: DISPLAY_NAME (ALIAS).
        </Text>
        <Grid hasGutter className="pf-u-mt-xl">
          <GridItem span={4}>
            <FormGroup
              label="Select Identity Provider"
              type="string"
              fieldId="idpSelector"
            >
              <FormSelect
                value={selectedIdP}
                onChange={onChange}
                aria-label="Identity Providers"
                id="idpSelector"
              >
                {options.map((option, index) => (
                  <FormSelectOption
                    isDisabled={option.disabled}
                    key={index}
                    value={option.value}
                    label={option.label}
                  />
                ))}
              </FormSelect>
              <Text component={TextVariants.small}>
                Change the active IdP for this Organization.
              </Text>
            </FormGroup>
            <ActionGroup className="pf-u-mt-xl">
              <Button
                onClick={save}
                disabled={buttonsDisabled}
                isDisabled={buttonsDisabled}
              >
                {t("save")}
              </Button>
              <Button
                variant="link"
                onClick={() => setSelectedIdP(enabledIdP)}
                disabled={buttonsDisabled}
                isDisabled={buttonsDisabled}
              >
                {t("cancel")}
              </Button>
            </ActionGroup>
          </GridItem>
        </Grid>
      </div>
    );
  }

  return <div className="pf-u-p-lg">{body}</div>;
}
