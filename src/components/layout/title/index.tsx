import React from "react";
import { useRouterContext, TitleProps } from "@pankod/refine-core";
import { Button } from "@pankod/refine-mui";

import {
  logo, 
  vckit, 
  vckitHolder, 
  vckitIssuer, 
  vckitVerifier 
} from 'assets';

const logos = {
  'Holder': vckitHolder,
  'Issuer': vckitIssuer,
  'Verifier': vckitVerifier
}

type logoKey = keyof typeof logos;

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const { Link } = useRouterContext();
  const demoAgent = process.env.REACT_APP_DEMO;
  const demoLogo = logos[demoAgent as logoKey]
  return (
    <Button fullWidth variant="text" disableRipple>
      <Link to="/">
        {collapsed ? (
          <img src={logo} alt="VCKit" width="35px" />
        ) : (
          <img src={vckit} alt="VCKit" width="140px" />
        )}
      </Link>
    </Button>
  );
};
