node-authorizator [![Build Status](https://travis-ci.org/ivpusic/node-authorizator.png?branch=master)](https://travis-ci.org/ivpusic/node-authorizator)
=================

Node module for user authorization based on different authorization policies.

### Installation

To install authorizator use following command:

```Shell
npm install authorizator
```

### How to use authorizator?

First you need to ``require`` authorizator module:

```JavaScript
var authorizator = require('authorizator');
```

Next you need to say your node app to use and init authorizator module.

```JavaScript
app.use(passport.initialize({'role': 'user.role'}));
```

Above function inits main parts of authorizator module. You can also pass some options to authorizator module.
Note that in this case we are passing ``role`` option to authorizator module. What does it mean?


Authorizator module must somehow know where to find information about user role. Default is to search for ``role.user``
variable from ``request`` argument, but you can also provide some other location of user role. Note that role info
must be available from ``request`` argument. 


Next, you need to call authorizator ``use`` function, to say authorizator to use some authorization policy.
You can use multiple policies to authorize users. 
Let's we say that we want use ``ActionBasedPolicy`` (will be described soon), you can use following:
```JavaScript
authorizator.use(ActionBasedPolicy); 
```
If you don't provide any policies, authorizator will throw ``Error``.

You can also remove policy from authorizator with ``unuse`` function:
```Javascript
authorizator.unuse(ActionBasedPolicy);
```

Authorizator core uses ``Strategy`` design pattern, and in this case strategies represents policies, 
and each policy represents way on which you want to authorize user.


You can add your own policies, or use some of authorizator default policies. 
Currently ``ActionBasedPolicy`` and ``RoleBasedPolicy`` are implemented.

#### ActionBasedPolicy

Hm, action based what? 

Imagine that you know which roles you will have in your node app. Each role has binded actions which role can execute.
Also imagine that you have ability to inherit actions from some other role, in order to make action definition (which some role has) easier.

That is ``ActionBasedPolicy``. So let's see how it works in practice.

First let's include ``ActionBasedPolicy`` in our node app:

```JavaScript
var ActionBasedPolicy = require('authorizator').ActionBasedPolicy;
```
Then you need to call ``use`` function with new ``ActionBasedPolicy`` instance as parameter:
```JavaScript
authorizator.use(ActionBasedPolicy); 
```

Then you need to define your roles and their actions. Let's define admin and moderator roles.

```JavaScript
var moderator = authorizator.addRole('moderator').can('edit users', 'remove users');
var admin = authorizator.addRole('admin').can('remove moderator', 'add moderator').inherits('moderator');
```

We can see that we use ``can`` function to pass list of actions (action names or action instances) which role can execute, and optionally call 
``inherits`` method to inherit actions from some other role (we pass role instance or role name).

Now if you want see all actions which some role can execute, you can use:
```JavaScript
admin.actions();
```
If you want to see all registeres roles, use:
```JavaScript
authorizator.roles();
```
At the end, when you want to authorize role use following:

```JavaScript
app.post('/some/restricted/path', authorizator.wants('add moderator'), function (req, res) { 
  // only authorized users can execute this code 
}
```
Here we see ``wants`` function, which is actually main function of authorizator module, and function which passes user role
into chain of authentication policies, and if all policies say that user can execute action, request will be approved,
otherwise user will get ``Error 401``

#### RoleBasedPolicy

Earlier we saw one policy for authorizing users. Authorizator provide another one, so let's explain what is ``RoleBasedPolicy``.

Let we say that we have defined two roles. Admin and moderator. Now we need to define some action. Let we define action with name ``edit profile``.
I previous policy we have binded actions directly to users with ``can`` function, but in this case we won't do that.

Instead of that, we say which minimum roles, or which roles in general are needed to execute some action.

So let's see hot it look in practice.

Define two new roles.
```Javascript
var admin = authorizator.addRole('admin');
var moderator = authorizator.addRole('moderator');
```

After that define some action.
```Javascript
var editUsersAction = authorizator.addAction('edit users');
```

For that action define specify roles which can execute action.
```JavaScript
editUsersAction.requires(admin, moderator);
// note that we can also specify actual names of actions if we don't have their references
// editUsersAction.requires('admin', 'moderator');
```

And that is it. Now you can call ``wants`` method on some of your router to authorize user.
```JavaScript
app.post('/some/restricted/path', authorizator.wants('edit profile'), function (req, res) { 
  // only authorized users can execute this code 
}
```

But wait. ``RoleBasedPolicy`` offer also another way to specify users which can execute action. 

Let's we say that we have defined ``admin``, ``moderator`` and ``editUsersAction`` variables as previous ones.

You can also do something like this:

```JavaScript
editUsersAction.minRole(admin);
editUsersAction.rolePriority(admin, moderator);
```

What happened here? So with first line we say that minimum role required for this action is administrator.
But ``authorizator`` doesn't know anything about priority order of role, to because of that with second line
we tell ``authorizator`` how role priority looks like.

Priority is specified from highest to lowest. So in this case, if user has role moderator, he will be rejected from 
executing action, because minimum role for this action is admin. After specifing this, we call ``wants`` method
on standard way:
```JavaScript
app.post('/some/restricted/path', authorizator.wants('edit profile'), function (req, res) { 
  // only authorized users can execute this code 
}
```

### Auxiliry functions

#### getRole

Function for getting some role by name:
```JavaScript
var role = authorizator.getRole('roleName');
```

#### getAction

Function for getting some action by name:
```JavaScript
var action = authorizator.getAction('actionName');
```

#### roles

Function for getting all defined roles:

```JavaScript
var roles = authorizator.roles();
```

#### use

Function for adding new authorization policy to ``authorizator``:
```JavaScript
authorizator.use(SomeAuthorizationPolicy);
```

#### unuse

Function for removing some authorization policy from ``authorizator``:
```JavaScript
authorizator.unuse(SomeAuthorizationPolicy)'
```

### TODO
- Example app
- Tests

## Contact

If you have any questions or issues, you can open new issue, or contact me directly on pusic007@gmail.com
