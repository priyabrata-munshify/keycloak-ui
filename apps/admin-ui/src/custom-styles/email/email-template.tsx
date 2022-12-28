import RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import { Alert, Form, PageSection } from "@patternfly/react-core";

type EmailTemplateTabProps = {
  realm: RealmRepresentation;
  // refresh: () => void;
};

export const EmailTemplate = ({ realm }: EmailTemplateTabProps) => {
  console.log(
    "🚀 ~ file: email-template.tsx:13 ~ EmailTemplate ~ realm",
    realm
  );

  const hasEmailThemeSettingsEnabled = realm.emailTheme === "attributes";

  return (
    <PageSection variant="light" className="keycloak__form">
      {!hasEmailThemeSettingsEnabled && (
        <Alert variant="warning" title="Realm setting change is required">
          <p>
            Your email theme must be set to <code>attributes</code> for these
            changes to take effect.{" "}
            <a
              href="https://phasetwo.io/docs/getting-started/email"
              target="_blank"
              rel="noreferrer"
            >
              Learn how.
            </a>
          </p>
        </Alert>
      )}
      <p className="pf-u-mt-lg">
        Use these templates to override the default content of your emails.
      </p>
      <Form isHorizontal></Form>
    </PageSection>
  );
};
