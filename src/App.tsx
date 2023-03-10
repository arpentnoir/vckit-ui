import React from "react";

import { Refine, AuthProvider } from "@pankod/refine-core";
import {
  notificationProvider,
  RefineSnackbarProvider,
  CssBaseline,
  GlobalStyles,
  ReadyPage,
  ErrorComponent,
} from "@pankod/refine-mui";
import { 
  AccountCircleOutlined, 
  ChatBubbleOutline, 
  PeopleAltOutlined, 
  StarOutlineRounded, 
  VillaOutlined,
  VerifiedUserOutlined,
  ListOutlined,
  AllInboxOutlined
} from "@mui/icons-material";

import dataProvider from "@pankod/refine-simple-rest";
import { MuiInferencer } from "@pankod/refine-inferencer/mui";
import routerProvider from "@pankod/refine-react-router-v6";
import axios, { AxiosRequestConfig } from "axios";
import { useTranslation } from "react-i18next";
import { ColorModeContextProvider } from "contexts";
import { Title, Sider, Layout, Header } from "components/layout";
import { dataProvider as veramoDataProvider } from "veramoDataProvider";
import { CredentialList, CredentialShow } from "pages/credentials";
import { IdentifierList, IdentifierCreate } from "pages/identifiers";

import { 
  Login, 
  Home, 
  Agent, 
  MyProfile, 
  PropertyDetailsPage, 
  AllProperties,
  CreateProperties,
  AgentProfile, 
  EditProperties
} from "pages";

import { CredentialResponse } from "interfaces/google";
import { parseJwt } from "utils/parse-jwt";

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (request.headers) {
    request.headers["Authorization"] = `Bearer ${token}`;
  } else {
    request.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return request;
});

function App() {
  const { t, i18n } = useTranslation();

  const authProvider: AuthProvider = {
    login: ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null;

      if (profileObj) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...profileObj,
            avatar: profileObj.picture,
          })
        );
      }

      localStorage.setItem("token", `${credential}`);

      return Promise.resolve();
    },
    logout: () => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common = {};
        window.google?.accounts.id.revoke(token, () => {
          return Promise.resolve();
        });
      }

      return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return Promise.resolve();
      }
      return Promise.reject();
    },

    getPermissions: () => Promise.resolve(),
    getUserIdentity: async () => {
      const user = localStorage.getItem("user");
      if (user) {
        return Promise.resolve(JSON.parse(user));
      }
    },
  };

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <ColorModeContextProvider>
      <CssBaseline />
      <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
      <RefineSnackbarProvider>
        <Refine
          dataProvider={{
            default: dataProvider("https://api.fake-rest.refine.dev"),
            agent: veramoDataProvider(),
          }}
          notificationProvider={notificationProvider}
          ReadyPage={ReadyPage}
          catchAll={<ErrorComponent />}
          resources={[
            // {
            //   name: "property",
            //   list: MuiInferencer,
            //   icon: <VillaOutlined/>
            // },
            // {
            //   name: "agent",
            //   list: MuiInferencer,
            //   icon: <PeopleAltOutlined/>
            // },
            // {
            //   name: "review",
            //   list: MuiInferencer,
            //   icon: <StarOutlineRounded/>

            // },
            {
              name: "identifiers",
              list: IdentifierList,
              // show: MuiInferencer,
              // create: IdentifierCreate,
              // edit: MuiInferencer,
              icon: <PeopleAltOutlined />,
              options: {
                dataProviderName: "agent"
            }

            },
            {
              name: "credentials",
              list: CredentialList,
              show: CredentialShow,
              icon: <VerifiedUserOutlined/>,
              options: {
                dataProviderName: "agent"
            }

            },
            {
              name: "activity",
              options: {
                label: 'Activity',
                dataProviderName: "agent"
              
              },
              list: MuiInferencer,
              icon: <ListOutlined/>,
              
            },
            {
              name: "requests",
              list: MuiInferencer,
              icon: <AllInboxOutlined/>,
              options: {
                dataProviderName: "agent"
            }

            },
            {
              name: "messages",
              list: MuiInferencer,
              icon: <ChatBubbleOutline/>,
              options: {
                dataProviderName: "agent"
            }

            },
            {
              name: "my-profile",
              options: {
                label: 'My Profile'
              },
              list: MuiInferencer,
              icon: <AccountCircleOutlined/>
            },
          ]}
          Title={Title}
          Sider={Sider}
          Layout={Layout}
          Header={Header}
          routerProvider={routerProvider}
          authProvider={authProvider}
          LoginPage={Login}
          i18nProvider={i18nProvider}
          DashboardPage={Home}
        />
      </RefineSnackbarProvider>
    </ColorModeContextProvider>
  );
}

export default App;
