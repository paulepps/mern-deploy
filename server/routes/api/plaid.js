const express = require("express");
const router = express.Router();
const passport = require("passport");
const { addAccounts, getAccounts, getTransactions, deleteAccounts } = require("../../controllers/plaid-controller");

// Routes will go here

router.post(
  "/accounts/add",
  passport.authenticate("jwt", { session: false }),
  addAccounts
);

router.get(
  "/accounts",
  passport.authenticate("jwt", { session: false }),
  getAccounts
);

router.post(
  "/accounts/transactions",
  passport.authenticate("jwt", { session: false }),
  getTransactions
);

router.delete(
  "/accounts/:id",
  passport.authenticate("jwt", { session: false }),
  deleteAccounts
);

module.exports = router;
