import {
  Brand,
  Form,
  FormGroup,
  PageSection,
  Panel,
  PanelHeader,
  PanelMain,
  PanelMainBody,
  ValidatedOptions,
} from "@patternfly/react-core";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import { KeycloakTextInput } from "../../components/keycloak-text-input/KeycloakTextInput";
import { SaveReset } from "../components/SaveReset";
import { useState } from "react";

type GeneralStylesType = {
  logoUrl: string;
  faviconUrl: string;
};

// TODO: Add Validation
// TODO: Add Image Value Populate
export const GeneralStyles = () => {
  const { t } = useTranslation("styles");
  const {
    register,
    control,
    reset,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<GeneralStylesType>();

  const [logoUrlError, setLogoUrlError] = useState(false);

  const isValidLogoUrl = (isValid: boolean) => {
    if (isValid) {
      clearErrors("logoUrl");
      setLogoUrlError(false);
    } else {
      setLogoUrlError(true);
      setError("logoUrl", { type: "custom", message: "Invalid image URL." });
    }
  };

  useWatch({
    name: "logoUrl",
    control,
  });
  useWatch({
    name: "faviconUrl",
    control,
  });

  const save = () => {
    console.log("[save]");
  };

  console.log("errors", errors);
  const logoUrl = getValues("logoUrl");

  const LogoUrlBrand = (
    <Panel variant="bordered" className="pf-u-mt-lg">
      <PanelHeader>Logo Preview</PanelHeader>
      <PanelMain>
        <PanelMainBody>
          {logoUrl ? (
            logoUrlError ? (
              <div>Invalid image url. Please check the link above.</div>
            ) : (
              <Brand
                src={logoUrl}
                alt="Custom Logo"
                widths={{ default: "200px" }}
              ></Brand>
            )
          ) : (
            <div>Enter a custom URL for the Logo to preview the image.</div>
          )}
        </PanelMainBody>
      </PanelMain>
    </Panel>
  );

  return (
    <PageSection variant="light" className="keycloak__form">
      <Form isHorizontal>
        {/* Logo Url */}
        <FormGroup
          labelIcon={
            <HelpItem
              helpText="styles:formHelpLogoUrl"
              fieldLabelId="logoUrl"
            />
          }
          label={t("logoUrl")}
          fieldId="kc-styles-logo-url"
          helperTextInvalid={t("styles:formHelpLogoUrlInvalid")}
          validated={
            errors.logoUrl ? ValidatedOptions.error : ValidatedOptions.default
          }
        >
          <KeycloakTextInput
            ref={register({ required: true })}
            type="text"
            id="kc-styles-logo-url"
            data-testid="kc-styles-logo-url"
            name="logoUrl"
            validated={
              errors.logoUrl ? ValidatedOptions.error : ValidatedOptions.default
            }
          />
          {LogoUrlBrand}
          {logoUrl && (
            <img
              className="pf-u-display-none"
              src={logoUrl}
              onError={() => isValidLogoUrl(false)}
              onLoad={() => isValidLogoUrl(true)}
            ></img>
          )}
        </FormGroup>
        {/* Favicon Url */}
        <FormGroup
          labelIcon={
            <HelpItem
              helpText="styles:formHelpFaviconUrl"
              fieldLabelId="faviconUrl"
            />
          }
          label={t("faviconUrl")}
          fieldId="kc-styles-favicon-url"
          helperTextInvalid={t("styles:formHelpFaviconUrlInvalid")}
          validated={
            errors.faviconUrl
              ? ValidatedOptions.error
              : ValidatedOptions.default
          }
        >
          <KeycloakTextInput
            ref={register({ required: true })}
            type="text"
            id="kc-styles-favicon-url"
            data-testid="kc-styles-favicon-url"
            name="faviconUrl"
            validated={
              errors.faviconUrl
                ? ValidatedOptions.error
                : ValidatedOptions.default
            }
          />
        </FormGroup>
        <SaveReset name="generalStyles" save={save} reset={reset} isActive />
      </Form>
    </PageSection>
  );
};
