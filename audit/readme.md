# Audit System

This systems allow the components of the datatrust to save the activity registry that is needed to keep in time (what we usually call 'logs').

In this case (and as a general definition), a log is an object that stores the metadata of an action, that was made in the system. When the admin creates a policy, a log stores the information of when, who, and what did he do. This is just one case, of many. It is desirable that ALL the actions that were made, have a register, a log, to persist.

All the logs are stored in a file. There is a server, in charge of manage all of the tasks related with the store, search, validation and query of each of logs. This is how it works in this implementation:

## Log structure

In our datatrust, a log contains the following information:

    