import {
  Form,
  FormGroup,
  PageSection,
  ValidatedOptions,
} from "@patternfly/react-core";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import { KeycloakTextInput } from "../../components/keycloak-text-input/KeycloakTextInput";
import { SaveReset } from "../components/SaveReset";

type GeneralStylesType = {
  logoUrl: string;
  faviconUrl: string;
};

export const GeneralStyles = () => {
  const { t } = useTranslation("styles");
  const {
    register,
    // control,
    reset,
    formState: { errors },
  } = useForm<GeneralStylesType>();

  const save = () => {
    console.log("[save]");
  };

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
