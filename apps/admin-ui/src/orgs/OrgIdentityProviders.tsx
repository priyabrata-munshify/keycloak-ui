import { useEffect, useState } from "react";
import type { OrgRepresentation } from "./routes";
import useOrgFetcher from "./useOrgFetcher";
import { useRealm } from "../context/realm-context/RealmContext";
import {
  ActionGroup,
  Button,
  Form,
  FormSelect,
  FormSelectOption,
  Grid,
  GridItem,
} from "@patternfly/react-core";
import { FormProvider, useForm } from "react-hook-form";
import { OrgIdPFields } from "./form/OrgIdPFields";
import { useTranslation } from "react-i18next";
import { first } from "lodash-es";

type OrgIdentityProvidersProps = {
  org: OrgRepresentation;
};

export default function OrgIdentityProviders({
  org,
}: OrgIdentityProvidersProps) {
  console.log("[OrgIdentityProviders]", org);

  const { realm } = useRealm();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { getIdentityProviders, updateIdentityProvider } = useOrgFetcher(realm);
  const { t } = useTranslation("orgs");
  const [idps, setIdps] = useState([]);
  const [selectedIdP, setSelectedIdP] = useState("");

  const idPForm = useForm({
    // defaultValues: defaultOrgState,
    // mode: "onChange",
    // shouldUnregister: false,
  });
  const {
    handleSubmit,
    reset,
    // getValues,
    formState: { isDirty },
  } = idPForm;

  async function getIDPs() {
    const identityProviders = await getIdentityProviders(org.id);

    if (identityProviders.success) {
      setIdps(identityProviders.data);

      // at least one IdP?
      const firstIdP = first(identityProviders.data);
      if (firstIdP) {
        idPForm.setValue("displayName", firstIdP.displayName);
        idPForm.setValue("alias", firstIdP.alias);
      }
    }
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

  let body = <div>No IdPs assigned to this Org.</div>;

  if (idps.length >= 0) {
    body = (
      <div>
        <Grid hasGutter className="pf-u-px-lg pf-u-mt-xl">
          <GridItem span={4}>
            <FormSelect
              value={selectedIdP}
              onChange={onChange}
              aria-label="Identity Providers"
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
          </GridItem>
        </Grid>
        <Grid hasGutter className="pf-u-px-lg pf-u-mt-xl">
          <GridItem span={8}>
            <FormProvider {...idPForm}>
              <Form
                isHorizontal
                onSubmit={handleSubmit(() => console.log("Submitted"))}
              >
                <OrgIdPFields />
                <ActionGroup className="">
                  <Button onClick={save} disabled={!isDirty}>
                    {t("save")}
                  </Button>
                  <Button variant="link" onClick={reset}>
                    {t("cancel")}
                  </Button>
                </ActionGroup>
              </Form>
            </FormProvider>
          </GridItem>
        </Grid>
      </div>
    );
  }

  return <div className="pf-u-p-lg">{body}</div>;
}
