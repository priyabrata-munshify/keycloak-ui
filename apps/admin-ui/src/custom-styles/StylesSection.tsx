import { PageSection, Tab, TabTitleText } from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { ViewHeader } from "../components/view-header/ViewHeader";
import helpUrls from "../help-urls";
import { useHistory } from "react-router-dom";
import {
  routableTab,
  RoutableTabs,
} from "../components/routable-tabs/RoutableTabs";
import { StylesTab, toStyles } from "./routes/Styles";
import { useRealm } from "../context/realm-context/RealmContext";
import { LoginStyles } from "./login/login-styles";
import { GeneralStyles } from "./general/general-styles";

export default function StylesSection() {
  const { t } = useTranslation("styles");
  const { realm } = useRealm();
  const history = useHistory();

  // Put "save" function here for various forms

  const route = (tab: StylesTab) =>
    routableTab({
      to: toStyles({ realm, tab }),
      history,
    });

  return (
    <>
      <ViewHeader
        titleKey="styles:styles"
        subKey="styles:explain"
        helpUrl={helpUrls.stylesUrl}
        divider={false}
      />
      <PageSection variant="light" className="pf-u-p-0">
        <RoutableTabs
          mountOnEnter
          isBox
          defaultLocation={toStyles({
            realm,
            tab: "general",
          })}
        >
          <Tab
            data-testid="general"
            title={<TabTitleText>{t("general")}</TabTitleText>}
            {...route("general")}
          >
            <GeneralStyles />
          </Tab>
          <Tab
            data-testid="login"
            title={<TabTitleText>{t("login")}</TabTitleText>}
            {...route("login")}
          >
            <LoginStyles />
          </Tab>
        </RoutableTabs>
      </PageSection>
    </>
  );
}
