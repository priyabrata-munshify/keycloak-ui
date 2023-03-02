import React from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { FormGroup, TextInput, ValidatedOptions } from "@patternfly/react-core";
import { MultiLineInput } from "../../components/multi-line-input/MultiLineInput";
import { HelpItem } from "../../components/help-enabler/HelpItem";

export const NewOrg = () => {
  const { t } = useTranslation("orgs");
  const { register, errors } = useFormContext();

  return (
    <>
      {/*Name*/}
      <FormGroup
        name="create-modal-org"
        label={t("common:name")}
        fieldId="name"
        helperTextInvalid={t("common:required")}
        validated={
          errors.name ? ValidatedOptions.error : ValidatedOptions.default
        }
        isRequired
      >
        <TextInput
          data-testid="orgNameInput"
          aria-label="org name input"
          ref={register({ required: true })}
          autoFocus
          type="text"
          id="create-org-name"
          name="name"
          validated={
            errors.name ? ValidatedOptions.error : ValidatedOptions.default
          }
        />
      </FormGroup>

      {/*Display name*/}
      <FormGroup
        name="create-modal-org"
        label={t("displayName")}
        fieldId="displayName"
      >
        <TextInput
          data-testid="orgDisplayNameInput"
          aria-label="org display-name input"
          ref={register()}
          type="text"
          id="create-org-display-name"
          name="displayName"
        />
      </FormGroup>

      {/*Domains*/}
      <FormGroup
        label={t("domains")}
        fieldId="domains"
        labelIcon={
          <HelpItem helpText="orgs:domainHelp" fieldLabelId="orgs:domain" />
        }
      >
        <MultiLineInput
          name="domains"
          aria-label={t("domains")}
          addButtonLabel="orgs:addDomain"
        />
      </FormGroup>

      {/*Url*/}
      <FormGroup name="create-modal-org" label={t("url")} fieldId="url">
        <TextInput
          data-testid="orgUrlInput"
          aria-label="org url input"
          ref={register()}
          type="text"
          id="create-org-display-url"
          name="url"
        />
      </FormGroup>
    </>
  );
};
