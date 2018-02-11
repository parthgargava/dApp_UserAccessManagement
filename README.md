The objective of this assignments is to have the ability to build end to end meteor based web application and understand the identity management, user access model and able to create/implement use cases to address the issue.

## Tasks:

1. Define and implement javascript classes/componenets of the user access model as discussed in class. Add the necessary attributes to the classes in the model to support the use cases (functions).
2. Install meteor development environment. These will include using node.js, chocolatey and meteor javascript and mongodb for persistence.
3. Create login feature using the account-ui, account-password package in meteor
4. Create landing page (work area) using css stylesheets. The landing page should have a left menu for the use cases, such as authorize access, remove access, create accounts and etc.

## Development 
```
git clone https://github.com/eric6356/SCAED.git
cd SCAED/meteor-rbac
meteor npm install
rm -rf meteor-rbac/node-modules/crypto

npm run truffle migrate
npm start
```
