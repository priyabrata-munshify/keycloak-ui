import React from "react";
import {
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
import { useForm } from "react-hook-form";

import { useAlerts } from "../components/alert/Alerts";
import useOrgFetcher from "./useOrgFetcher";
import { useRealm } from "../context/realm-context/RealmContext";
import type { OrgRepresentation } from "./routes";

type AddInvitationProps = {
  toggleVisibility: () => void;
  org: OrgRepresentation;
  refresh: () => void;
};
export default function AddInvitation({
  toggleVisibility,
  org,
  refresh,
}: AddInvitationProps) {
  const { register, errors, handleSubmit } = useForm();
  const { realm } = useRealm();
  const { createInvitation } = useOrgFetcher(realm);
  const { addAlert } = useAlerts();

  const submitForm = async (invitation: { email: string }) => {
    await createInvitation(org.id, invitation.email);
    addAlert(`${invitation.email} has been invited`);
    refresh();
    toggleVisibility();
  };
  return (
    <Modal
      variant={ModalVariant.small}
      title="Invite a User"
      isOpen={true}
      onClose={toggleVisibility}
      actions={[
        <Button
          data-testid="createinvitation"
          key="confirm"
          variant="primary"
          type="submit"
          form="invitation-form"
        >
          Create
        </Button>,
        <Button
          id="modal-cancel"
          key="cancel"
          variant={ButtonVariant.link}
          onClick={() => {
            toggleVisibility();
          }}
        >
          Cancel
        </Button>,
      ]}
    >
      <Form
        id="invitation-form"
        isHorizontal
        onSubmit={handleSubmit(submitForm)}
      >
        <FormGroup
          name="create-modal-org-invitation"
          label="Email"
          fieldId="email"
          helperTextInvalid="Required"
          validated={
            errors.email ? ValidatedOptions.error : ValidatedOptions.default
          }
          isRequired
        >
          <TextInput
            data-testid="orgEmailInput"
            aria-label="org email input"
            ref={register({ required: true })}
            autoFocus
            type="text"
            id="create-invitation-email"
            name="email"
          />
        </FormGroup>
      </Form>
    </Modal>
  );
}
