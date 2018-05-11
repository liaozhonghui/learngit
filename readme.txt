设计表
用户表，用户登陆信息表，用户信息表，
角色表，角色权限表
模块权限表，模块表，权限表 
user
usercheckin
useraddress
role
中间表：userroles

表关系
user--usercheckin为一对一关系
user-userrole-role为多对多关系
role-rolePrivilege-moduleprivilege是一对多关系

module-moduleprivilege-privilege是多对多关系
一对一关系的增改删查，多对多关系的增改删查，一对多关系的增改删查

用户新增，角色新增
ip修改，角色修改，用户名修改，用户密码修改

角色查询，用户查询，登陆Ip查询

用户信息查询，角色权限查询

用户信息删除，角色信息删除，登陆ip信息删除，权限删除



方式1：建立一对一，一对多，多对多的模型方式进行开发
