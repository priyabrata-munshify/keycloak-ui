import React from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { FormGroup, TextInput } from "@patternfly/react-core";
import { MultiLineInput } from "../../components/multi-line-input/MultiLineInput";
import { HelpItem } from "../../components/help-enabler/HelpItem";

export const OrgFields = () => {
  const { t } = useTranslation("orgs");
  const { register } = useFormContext();

  return (
    <>
      <FormGroup label="Name" fieldId="name">
        <TextInput
          ref={register()}
          type="text"
          id="org-name"
          name="name"
          isDisabled
        />
      </FormGroup>
      <FormGroup label="Display name" fieldId="displayName">
        <TextInput
          ref={register()}
          type="text"
          id="org-name"
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

      <FormGroup label="URL" fieldId="url">
        <TextInput ref={register()} type="text" id="org-url" name="url" />
      </FormGroup>
    </>
  );
};
