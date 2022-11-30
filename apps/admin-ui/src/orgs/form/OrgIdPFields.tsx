import { useFormContext } from "react-hook-form";
import { FormGroup, TextInput } from "@patternfly/react-core";

export const OrgIdPFields = () => {
  const { register } = useFormContext();

  return (
    <>
      <FormGroup label="Display name" fieldId="displayName">
        <TextInput
          ref={register()}
          type="text"
          id="idp-display-name"
          name="displayName"
        />
      </FormGroup>

      <FormGroup label="Alias" fieldId="alias">
        <TextInput ref={register()} type="text" id="idp-alias" name="alias" />
      </FormGroup>
    </>
  );
};
