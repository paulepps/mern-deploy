import React, { useEffect, useState } from "react";
import PlaidLinkButton from "react-plaid-link-button";
import { useDispatch, useSelector } from "react-redux";
import { addAccount, getAccounts } from "../../actions/accountActions.js";
import { logoutUser } from "../../actions/authActions.js";

import Accounts from "./Accounts";
import Spinner from './Spinner'; 

const Dashboard = () => {
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const plaid = useSelector((state) => state.plaid);

  const [loaded, setLoaded] = useState(false);

  // useEffect
  useEffect(() => {
    dispatch(getAccounts());
  }, [dispatch]);

  // Logout
  const onLogoutClick = (e) => {
      e.preventDefault();
      dispatch(logoutUser());
  };

  // Add account
  const handleOnSuccess = (token, metadata) => {
    const plaidData = {
      public_token: token,
      metadata: metadata,
    };
    dispatch(addAccount(plaidData));
  };

  const { user } = auth;
  const { accounts, accountsLoading } = plaid;

  let dashboardContent;

  if (accounts === null || accountsLoading) {
    dashboardContent = <Spinner />;
  } else if (accounts.length > 0) {
    // User has accounts linked
    dashboardContent = <Accounts user={user} accounts={accounts} />;
  } else {
    // User has no accounts linked
    dashboardContent = (
      <div className="row">
        <div className="col s12 center-align">
          <h4>
            <b>Welcome,</b> {user.name.split(" ")[0]}
          </h4>
          <p className="flow-text grey-text text-darken-1">
            To get started, link your first bank account below
          </p>
          <div>
            <PlaidLinkButton
              buttonProps={{
                className:
                  "btn btn-large waves-effect waves-light hoverable blue accent-3 main-btn",
              }}
              plaidLinkProps={{
                clientName: "PAUL'S BANK",
                key: "557f9aa663c8330e7d6e22b6cf4d1b",
                env: "sandbox",
                product: ["transactions"],
                onSuccess: handleOnSuccess,
              }}
              onScriptLoad={() => setLoaded(true)}
            >
              {loaded ? "Link Account" : "Loading..."}
            </PlaidLinkButton>
          </div>
          <button
            onClick={onLogoutClick}
            className="btn btn-large waves-effect waves-light hoverable red accent-3 main-btn"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }
  return <div className="container">{dashboardContent}</div>;
};

export default Dashboard;
