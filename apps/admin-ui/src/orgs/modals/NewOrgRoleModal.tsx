import React from "react";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import type RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import { useAlerts } from "../../components/alert/Alerts";
import useOrgFetcher from "../useOrgFetcher";
import { useRealm } from "../../context/realm-context/RealmContext";

type NewOrgRoleProps = {
  orgId: string;
  handleModalToggle: () => void;
  refresh: (role?: RoleRepresentation) => void;
};

export const NewOrgRoleModal = ({
  handleModalToggle,
  orgId,
  refresh,
}: NewOrgRoleProps) => {
  const { t } = useTranslation("orgs");
  const { realm } = useRealm();
  const { createRoleForOrg } = useOrgFetcher(realm);
  const { addAlert, addError } = useAlerts();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({});

  const submitForm = async (role: RoleRepresentation) => {
    try {
      const resp = await createRoleForOrg(orgId, role);
      if (resp.success) {
        refresh(role);
        handleModalToggle();
        addAlert("Role created for this organization", AlertVariant.success);
        return;
      }
      throw new Error(resp.message);
    } catch (e: any) {
      addError(
        `Could not create the role for this organization, ${e.message}`,
        e
      );
    }
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      title={t("createRole")}
      isOpen={true}
      onClose={handleModalToggle}
      actions={[
        <Button
          data-testid={`createRole`}
          key="confirm"
          variant="primary"
          type="submit"
          form="role-name-form"
          isDisabled={isSubmitting}
        >
          {t("common:create")}
        </Button>,
        <Button
          id="modal-cancel"
          data-testid="cancel"
          key="cancel"
          variant={ButtonVariant.link}
          onClick={() => {
            handleModalToggle();
          }}
          isDisabled={isSubmitting}
        >
          {t("common:cancel")}
        </Button>,
      ]}
    >
      <Form
        id="role-name-form"
        isHorizontal
        onSubmit={handleSubmit(submitForm)}
      >
        <FormGroup
          name="create-role-name"
          label={t("roleName")}
          fieldId="role-name"
          helperText="All lowercase, no spaces."
          helperTextInvalid={t("common:required")}
          validated={
            errors.name ? ValidatedOptions.error : ValidatedOptions.default
          }
          isRequired
        >
          <TextInput
            data-testid="roleNameInput"
            aria-label="role name input"
            ref={register({ required: true, pattern: /\b[a-z]+/ })}
            autoFocus
            type="text"
            id="create-role-name"
            name="name"
            validated={
              errors.name ? ValidatedOptions.error : ValidatedOptions.default
            }
          />
        </FormGroup>

        <FormGroup
          name="role-description"
          label={t("common:description")}
          fieldId="role-description"
          validated={
            errors.description
              ? ValidatedOptions.error
              : ValidatedOptions.default
          }
        >
          <TextInput
            data-testid="roleDescriptionInput"
            aria-label="role description input"
            ref={register({})}
            type="text"
            id="role-description"
            name="description"
            validated={
              errors.description
                ? ValidatedOptions.error
                : ValidatedOptions.default
            }
          />
        </FormGroup>
      </Form>
    </Modal>
  );
};
