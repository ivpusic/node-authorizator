node-authorizator [![Build Status](https://travis-ci.org/ivpusic/node-authorizator.png?branch=master)](https://travis-ci.org/ivpusic/node-authorizator)
=================

Node module for user authorization based on different authorization policies.

### Installation

To install authorizator use following command:

```
npm install authorizator
```

### How to use authorizator?

First you need to ``reqire`` authorizator module:

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
authorizator.use(new ActionBasedPolicy()); 
```

If you don't provide any policies, authorizator will throw ``Error``.

Authorizator core uses ``Strategy`` design pattern, and in this case strategies represents policies, 
and each policy represents way on which you want to authorize user.


You can add your own policies, or use some of authorizator default policies. 
Currently ``ActionBasedPolicy`` is implemented and ``RoleBasedPolicy`` will be available soon.

#### ActionBasedPolicy

Hm, action based what? 

Imagine that you know which roles you will have in your node app. Each role has binded actions which role can execute.
Also imagine that you have ability to inherit actions from some other role, in order to make action definition (which some role has) easier.

That is ``ActionBasedPolicy``. So let's see how it works in practice.

First let's include ``ActionBasedPolicy`` in our node app:

```JavaScript
var ActionBasedPolicy = require('authorizator').ActionBasedPolicy;
```
Next you need to define your roles and their actions. Let's define admin and moderator roles.

```JavaScript
var moderator = authorizator.addRole('moderator').can(['edit users', 'remove users']);
var admin = authorizator.addRole('admin').can(['remove moderator', 'add moderator']).inherits('moderator');
```

We can see that we use ``can`` function to pass list of actions which role can execute, and optionally call 
``inherits`` method to inherit actions from some other role.

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

soon....

### TODO
- RoleBasedPolicy
- Example app
- Tests
