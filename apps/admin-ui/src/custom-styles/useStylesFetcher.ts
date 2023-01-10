import { useAdminClient } from "../context/auth/AdminClient";
import { useRealm } from "../context/realm-context/RealmContext";
import environment from "../environment";

export interface EmailTemplateMap {
  [key: string]: string;
}

interface Errors {
  error: boolean;
  message: string;
}

export default function useStylesFetcher() {
  const { adminClient } = useAdminClient();
  const { realm: realmName } = useRealm();

  const authUrl = environment.authServerUrl;
  const baseUrl = `${authUrl}/realms/${realmName}`;

  async function fetchG(url: string, headers = {}) {
    const token = await adminClient.getAccessToken();
    return await fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...headers,
      },
      redirect: "follow",
    });
  }

  async function fetchM(
    url: string,
    body: any,
    verb: "POST" | "PUT",
    headers: RequestInit["headers"] = {}
  ) {
    const token = await adminClient.getAccessToken();
    return await fetch(url, {
      method: verb,
      mode: "cors",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
      body: JSON.stringify(body),
      redirect: "follow",
    });
  }

  // GET /auth/realms/{realm}/emails/templates
  async function getEmailTemplates(): Promise<EmailTemplateMap> {
    const resp = await fetchG(`${baseUrl}/emails/templates`)
      .then((r) => r.json())
      .catch(() => ({
        error: "Error pulling email templates.",
      }));
    return resp;
  }

  // GET /auth/realms/{realm}/emails/templates/{html|text}/{templateName}
  async function getEmailTemplateValue({
    templateType,
    templateName,
  }: {
    templateType: "html" | "text";
    templateName: string;
  }): Promise<string | Error> {
    const resp = await fetchG(
      `${baseUrl}/emails/templates/${templateType}/${templateName}`,
      { Accept: "text/plain" }
    )
      .then((r) => {
        if (r.ok) return r.text();
        throw new Error();
      })
      .catch(() => new Error("Error pulling email template value."));

    return resp;
  }

  // PUT /auth/realms/{realm}/emails/templates/html/{templateName}
  async function updateEmailTemplateValue({
    templateType,
    templateName,
    templateBody,
  }: {
    templateType: "html" | "text";
    templateName: string;
    templateBody: string;
  }): Promise<Errors> {
    const resp = await fetchM(
      `${baseUrl}/emails/templates/${templateType}/${templateName}`,
      templateBody,
      "PUT"
    )
      .then((r) => {
        if (r.ok) return { error: false, message: "Email template updated." };
        throw new Error();
      })
      .catch(() => ({
        error: true,
        message: `Error updating email template for ${templateName}.`,
      }));

    return resp;
  }

  return { getEmailTemplates, getEmailTemplateValue, updateEmailTemplateValue };
}
