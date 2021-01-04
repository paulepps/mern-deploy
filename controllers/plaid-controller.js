const plaid = require("plaid");
const moment = require("moment");

// Load Account and User models
const Account = require("../models/Account");

const client = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments.sandbox,
  options: {
    version: "2019-05-29",
  },
});

var PUBLIC_TOKEN = null;
var ACCESS_TOKEN = null;
var ITEM_ID = null;

const getAccounts = (req, res) => {
  Account.find({ userId: req.user.id })
    .then((accounts) => res.json(accounts))
    .catch((err) => console.log(err));
};

const getTransactions = (req, res) => {
  const now = moment();
  const today = now.format("YYYY-MM-DD");
  const thirtyDaysAgo = now.subtract(30, "days").format("YYYY-MM-DD"); // Change this if you want more transactions

  let transactions = [];
  const accounts = req.body;
  if (accounts) {
    accounts.forEach(function (account) {
      ACCESS_TOKEN = account.accessToken;
      const institutionName = account.institutionName;
      client
        .getTransactions(ACCESS_TOKEN, thirtyDaysAgo, today)
        .then((response) => {
          transactions.push({
            accountName: institutionName,
            transactions: response.transactions,
          });
          // Don't send back response till all transactions have been added
          if (transactions.length === accounts.length) {
            res.json(transactions);
          }
        })
        .catch((err) => console.log(err));
    });
  }
};

const addAccounts = (req, res) => {
  PUBLIC_TOKEN = req.body.public_token;
  const userId = req.user.id;
  const institution = req.body.metadata.institution;
  const { name, institution_id } = institution;

  if (PUBLIC_TOKEN) {
    client
      .exchangePublicToken(PUBLIC_TOKEN)
      .then((exchangeResponse) => {
        ACCESS_TOKEN = exchangeResponse.access_token;
        ITEM_ID = exchangeResponse.item_id;

        // Check if account already exists for specific user
        Account.findOne({
          userId: req.user.id,
          institutionId: institution_id,
        })
          .then((account) => {
            if (account) {
              console.log("Account already exists");
            } else {
              const newAccount = new Account({
                userId: userId,
                accessToken: ACCESS_TOKEN,
                itemId: ITEM_ID,
                institutionId: institution_id,
                institutionName: name,
              });
              newAccount.save().then((account) => res.json(account));
            }
          })
          .catch((err) => console.log(err)); // Mongo Error
      })
      .catch((err) => console.log(err)); // Plaid Error
  }
};

const deleteAccounts = (req, res) => {
  Account.findById(req.params.id).then((account) => {
    // Delete account
    account.remove().then(() => res.json({ success: true }));
  });
};

module.exports = {
  getAccounts,
  getTransactions,
  addAccounts,
  deleteAccounts,
};
