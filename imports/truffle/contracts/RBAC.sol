pragma solidity ^0.4.18;

contract RBAC {
    struct Access {
        string code;
        string endpoint;
        string description;
        bool isDeleted;
        uint[] menuIDs;
    }

    struct Role {
        string name;
        bool isDeleted;
        uint[] accessIDs;
    }

    struct Account {
        address addr;
        uint personID;
        uint managerID;
        bool isDeleted;
        uint[] roleIDs;
    }

    struct Person {
        string firstName;
        string lastName;
        bool isDeleted;
    }

    mapping (uint=>string) public menus;
    uint public menuCounter = 0;

    mapping (uint=>Account) public accounts;
    uint public accountCounter = 0;

    mapping (uint=>Access) public accesses;
    uint public accessCounter = 0;

    mapping (uint=>Role) public roles;
    uint public roleCounter = 0;

    mapping (uint=>Person) public people;
    uint public personCounter = 0;

    address[] public owners;

    function RBAC() public {
        owners.push(msg.sender);
        menus[0] = "All";
        menus[1] = "Home";
        menus[2] = "Access";
        menus[3] = "Role";
        menus[4] = "Account";
        menus[5] = "TempAccess";
        menus[6] = "Wiki";
        menus[7] = "Jira";
        menus[8] = "SharePoint";
        menuCounter = 8;
    }

    function totalOwners() view public returns (uint) {
        return owners.length;
    }

    modifier ownerOnly() {
        bool isOwner = false;
        for (uint i = 0; i < owners.length; i++) {
            if (owners[i] == msg.sender) {
                isOwner = true;
                break;
            }
        }
        require(isOwner);
        _;
    }

    function deleteOwner(uint _index) ownerOnly public {
        require(_index < owners.length);

        address[] memory newowners = new address[](owners.length - 1);
        for (uint i = 0; i < owners.length; i++) {
            if (i < _index) {
                newowners[i] = owners[i];
            } else if (i > _index) {
                newowners[i - 1] = owners[i];
            }
        }
        owners = newowners;
    }

    function addOwner(address _address) ownerOnly public {
        owners.push(_address);
    }

    function validIDs(uint[] _ids, uint counter) internal pure {
        for (uint i = 0; i < _ids.length; i++) {
            require(_ids[i] <= counter);
        }
    }

    function addAccess(string _code, string _endpoint, string _description, uint[] _menuIDs) ownerOnly public {
        validIDs(_menuIDs, menuCounter);

        accessCounter++;
        accesses[accessCounter] = Access(
            _code,
            _endpoint,
            _description,
            false,
            _menuIDs
        );
    }

    function modifyAccess(uint _id, string _code, string _endpint, string _description, uint[] _menuIDs) ownerOnly public {
        require(_id <= accessCounter);
        validIDs(_menuIDs, menuCounter);

        Access storage access = accesses[_id];
        access.code = _code;
        access.endpoint = _endpint;
        access.menuIDs = _menuIDs;
        access.description = _description;
    }

    function deleteAccess(uint _id) ownerOnly public {
        require(_id <= accessCounter);
        accesses[_id].isDeleted = true;
    }

    function accessMenuIDs(uint _id) view public returns (uint[]) {
        require(_id <= accessCounter);
        return accesses[_id].menuIDs;
    }

    function addRole(string _name, uint[] _accessIDs) ownerOnly public {
        validIDs(_accessIDs, accessCounter);

        roleCounter++;
        roles[roleCounter] = Role(
            _name,
            false,
            _accessIDs
        );
    }

    function modifyRole(uint _id, string _name, uint[] _accessIDs) ownerOnly public {
        require(_id <= roleCounter);
        validIDs(_accessIDs, accessCounter);
        
        Role storage role = roles[_id];
        role.name = _name;
        role.accessIDs = _accessIDs;
    }
    
    function deleteRole(uint _id) ownerOnly public {
        require(_id <= roleCounter);
        roles[_id].isDeleted = true;
    }

    function roleAccessIDs(uint _id) view public returns (uint[]) {
        require(_id <= roleCounter);

        return roles[_id].accessIDs;
    }

    function addAccountWithPerson(address _addr, uint _managerID, string _firstName, string _lastName, uint[] _roleIDs) ownerOnly public {
        require(_managerID <= accountCounter);
        validIDs(_roleIDs, roleCounter);

        personCounter++;
        people[personCounter] = Person(
            _firstName,
            _lastName,
            false
        );

        accountCounter++;
        accounts[accountCounter] = Account(
            _addr,
            personCounter,
            _managerID,
            false,
            _roleIDs
        );
    }

    function modifyAccount(uint _id, uint _managerID, uint[] _roleIDs) ownerOnly public {
        require(_id <= accountCounter);
        require(_managerID <= accountCounter);
        validIDs(_roleIDs, roleCounter);

        Account storage account = accounts[_id];
        account.managerID = _managerID;
        account.roleIDs = _roleIDs;
    }

    function modifyPerson(uint _id, string _firstName, string _lastName) ownerOnly public {
        require(_id <= personCounter);

        Person storage person = people[_id];
        person.firstName = _firstName;
        person.lastName = _lastName;
    }

    function deleteAccount(uint _id) ownerOnly public {
        require(_id <= accountCounter);

        accounts[_id].isDeleted = true;
        people[accounts[_id].personID].isDeleted = true;
    }

    function accountRoleIDs(uint _id) public view returns(uint[]) {
        require(_id <= accessCounter);

        return accounts[_id].roleIDs;
    }

    function register() public {
        personCounter++;
        people[personCounter] = Person("", "", false);

        accountCounter++;
        accounts[accountCounter] = Account(msg.sender, personCounter, 0, false, new uint[](0));
    }
}