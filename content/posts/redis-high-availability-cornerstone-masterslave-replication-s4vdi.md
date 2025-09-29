---
title: Redis 高可用基石：主从复制
slug: redis-high-availability-cornerstone-masterslave-replication-s4vdi
url: /post/redis-high-availability-cornerstone-masterslave-replication-s4vdi.html
date: '2025-09-29 15:28:14+08:00'
lastmod: '2025-09-29 15:52:11+08:00'
tags:
  - redis
categories:
  - Java八股文
keywords: redis
toc: true
isCJKLanguage: true
---





‍

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250929152816.png)

一句话就是主从复制，master以写为主，Slave以读为主  
当master数据变化的时候，自动将新的数据异步同步到其它slave数据库  
G

**配从(库)不配主(库)**   
权限细节，重要

master如果配置了requirepass参数，需要密码登陆  
那么slave就要配置masterauth来设置校验密码，  
否则的话master会拒绝slave的访问请求

‍

530 #If the master is password protected(using the"requirepass" configuration531#directive below)it is possible to tell thereplica to authenticate before  
533#refuse the replica request.532# starting the replication synchronization process,otherwise the master will  
534#  
535#masterauth<master-password>  
536masterauth 111111  
怎么玩基本操作命令  
info replication 可以查看复制节点的主从关系和配置信息  
replicao主库IP主库端口1

一般写入进redis.conf配置文件内  
slaveofF主库IP主库端口

每次与master断开之后，都需要重新连接，除非你配置进redis.conf文件  
在运行期间修改slave节点的信息，如果该数据库已经是某个主数据库的从数据库，  
那么会停止和原主数据库的同步关系转而和新的主数据库同步，重新拜码头  
slaveof no one 使当前数据库停止与其他数据库的同步，转成主数据库，自立为王

‍

‍

1.从机可以执行写命令吗？

不可

127.0.0.1:6380> set k2 slave6380  
[error）READONLYYou can't write against a read only replica.  
2.从机切入点问题

slave是从头开始复制还是从切入点开始复制？  
master启动，写到k3  
slave1跟着master同时启动，跟着写到k3  
slave2写到k3后才启动，那之前的是否也可以复制？  
Y，首次一锅端，后续跟随，master写，slave跟

3.主机shutdown后，从机会上位吗？

从机不动，原地待命，从机数据可以正常使用；等待主机重启动归来  
4.主机shutdown后，重启后主从关系还在吗？从机还能否顺利复制？

可以，可以  
5.某台从机down后，master继续，从机重启后它能跟上大部队吗？

可以

‍

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250929154754.png)

上一个slave可以是下一个slave的master，slave同样可以接收其他  
slaves的连接和同步请求，那么该slave作为了链条中下一个的master,  
可以有效减轻主master的写压力  
中途变更转向：会清除之前的数据，重新建立拷贝最新的  
slaveof新主库IP新主库端口

‍

反客为主

SLAVEOF no one使当前数据库

‍

slave启动成功连接到master后会发送一个sync命令  
slave首次全新连接master,一次完全同步（全量复制)将被自动执行，slave自身原有数据会被masave自身原有数据会被master数据覆盖清除

‍

master节点收到sync命令后会开始在后台保存快照（即RDB持久化，主从复制时会触发RDB)，  
同时收集所有接收到的用于修改数据集命令缓存起来，master节点执行RDB持久化完后，

全量复制  
master将rdb快照文件和所有缓存的命令发送到所有slave,以完成一次完全同步  
而slave服务在接收到数据库文件数据后，将其存盘并加载到内存中，从而完成复制初始化

‍

心跳持续，保持通信

master发出PING包的周期，默认是10秒  
657 #Master send PINGs to its replicas in a predefined interval. It' s possible to  
658 # change this interval with the repl_ping_replica_period option. The default  
659 # value is 10 seconds.  
660 #  
661 #epl- ping-replica-period 10

进入平稳，增量复制

Master继续将新的所有收集到的修改命令自动依次传给slave,完成同步  
从机下线，重连续传

master会检查backlog里面的offset，master和slave都会保存一个复制的offset还有一个masterId，  
**offset是保存在backlod中的。Master只会把已经复制的offset后面的数据复制给Slave**，类似断点续传

‍

缺点

复制延时，信号衰减  
由于所有的写操作都是先在Master上操作，然后同步更新到Slave上，所以从Master同步到Slave机器有一定的延迟，当系统很繁  
忙的时候，延迟问题会更加严重，Slave机器数量的增加也会使这个问题更加严重。

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/image-20250929153848-1cxvf6n.png)

master挂了怎么办

默认情况下，不会在slave节点中自动重选选一个master

**无人值守安装变成刚需**

‍

‍

好的，这是一份关于Redis主从复制非常详尽的笔记。内容涵盖了是什么、怎么玩、核心原理以及常见问题。我的任务是将其梳理、重构、润色，并用更生动、更有条理的方式，组织成一篇高质量的技术博客。

---

### 

随着业务量的增长，单台Redis实例很快会面临性能瓶颈和单点故障的风险。如何扩展Redis的读写能力？如何保证服务的高可用？答案就是**主从复制 (Master-Slave Replication)** 。

## **是什么：主从复制的核心思想**

一句话概括：**主从复制，就是让一台Redis服务器（我们称之为主库Master），自动地、异步地将数据同步到其他一台或多台Redis服务器（我们称之为从库Slave）。**

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250929152816.png)

这种架构带来了两大核心优势：

1. **读写分离**：Master节点专注于处理**写操作**，而Slave节点则可以分担大量的**读操作**。这极大地提升了Redis的并发处理能力。
2. **高可用性**：当Master节点意外宕机时，可以将其中一个Slave节点提升为新的Master，从而保证服务的持续可用，实现了数据的热备份。

## **怎么玩：轻松搭建主从集群**

配置主从关系非常简单，核心原则是 **“配从不配主”** ，即所有的配置都在从库上进行。

**1. 配置文件方式（推荐）**   
在从库的 `redis.conf` 文件中，添加或修改以下配置：

```conf
# 指定主库的IP和端口
slaveof <master_ip> <master_port>

# 如果主库设置了密码 (requirepass)，从库必须配置此项
masterauth <master_password>
```

例如：

```conf
slaveof 192.168.1.100 6379
masterauth "your_strong_password"
```

配置完成后，重启从库即可自动建立主从关系。

**2. 命令行方式（临时生效）**   
也可以在Redis客户端中动态设置主从关系，但这只在当前运行期间有效，重启后会失效。

```redis
# 让当前实例成为指定主库的从库
127.0.0.1:6380> SLAVEOF 192.168.1.100 6379

# 让当前实例“自立为王”，断开主从关系，变回主库
127.0.0.1:6380> SLAVEOF no one
```

**常用命令**：

- ​`INFO replication`: 查看当前节点的主从状态、连接信息和复制进度。

## **主从复制的N个“灵魂拷问”**

1. **从库可以执行写命令吗？**

    - **不可以**。默认情况下，从库是只读的 (`read-only`)。尝试在从库上执行写命令会收到错误提示：`(error) READONLY You can't write against a read only replica.`。这是为了保证数据的一致性，所有写操作都必须源自Master。
2. **从库是从什么时候开始复制的？**

    - **首次全量，后续增量**。当一个从库首次连接上主库时，会进行一次“全量复制”，将主库当时所有的数据都复制过来。此后，主库上发生的任何写操作，都会被“增量”地同步到从库。即使一个从库在中途加入，它也能通过全量复制，赶上“大部队”。
3. **主库宕机了，从库会自动“上位”吗？**

    - **不会**。在单纯的主从复制模式下，如果主库宕机，所有从库会原地待命，继续提供读服务，但整个集群将失去写能力。它们会不断尝试重连主库，直到主库恢复。自动故障转移需要更高级的“哨兵模式”或“集群模式”来实现。
4. **主库重启后，主从关系还在吗？**

    - **在的**。只要配置写入了 `redis.conf`，主库重启后，从库会自动重连上来，并根据复制积压缓冲区的数据进行增量同步，恢复主从关系。
5. **从库宕机后重启，能跟上进度吗？**

    - **可以**。从库重启后，会重新连接主库。它会告诉主库自己宕机前的复制偏移量(offset)。主库会检查这个offset是否还在自己的“复制积压缓冲区”内，如果在，就直接发送这部分丢失的数据（类似断点续传）；如果不在（宕机时间太长），则会触发一次全量复制。

#### **更灵活的架构**

1. **薪火相传（Chaining）**   
    ​![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250929154754.png)  
    一个从库也可以成为另一个从库的主库。这样可以形成一个链式结构：`Master -> Slave1 -> Slave2`。这种架构可以有效减轻主Master的同步压力，因为Master只需要同步给Slave1即可。
2. **反客为主**  
    当主库永久性宕机，需要手动将一个从库提升为新主库时，只需在该从库上执行 `SLAVEOF no one` 命令即可。然后让其他从库转而复制这个新的主库。

## **核心原理：复制的三大阶段**

Redis主从复制的过程，主要分为三个阶段：

**第一阶段：全量复制 (Full Resynchronization)**   
当从库初次连接主库，或因断线时间过长导致数据差异巨大时，会触发全量复制。

1. **SYNC命令**：从库向主库发送 `SYNC` 命令。
2. **RDB快照**：主库收到 `SYNC` 后，会立即在后台执行 `BGSAVE`，生成一份当前内存数据的RDB快照文件。在生成RDB期间，所有新的写命令会被缓存起来。
3. **发送数据**：主库将生成的RDB文件发送给从库。发送完毕后，再将缓存的写命令也发送给从库。
4. **加载数据**：从库接收到RDB文件后，会** **清空自己的所有旧数据** **，然后加载RDB文件到内存。之后，再执行主库发来的缓存写命令。至此，主从数据达到一致。

**第二阶段：增量复制 (Continuous Replication)**   
全量复制完成后，主从进入平稳的增量复制阶段。

- 主库每执行一个写命令，都会异步地将这个命令发送给所有从库。
- 从库接收到命令后，在自己的数据库中执行，从而保持与主库的数据同步。

**第三阶段：心跳与断线重连**

- **心跳机制**：主从之间会周期性地（默认10秒）发送`PING`命令，以检测连接状态和维持通信。
- **断点续传**：如果从库短暂断线后重连，它会利用**复制偏移量(offset)** 和**复制积压缓冲区(replication backlog)** 来实现高效的增量同步，避免了昂贵的全量复制。主库只会把从库断线期间错过的命令重新发送给它。

## **主从复制的挑战**

- **复制延迟**：由于写操作是先在Master执行，再异步同步到Slave，所以存在一定的延迟。在高并发场景下，延迟可能会加剧。这可能导致在从库上读到的是旧数据。
- **Master的单点故障**：在没有哨兵或集群的情况下，Master宕机会导致整个系统无法写入，需要人工介入进行故障转移。

**结论**：主从复制是构建高可用、高性能Redis服务的基石。虽然它存在一些固有的挑战，但这为更高级的哨兵和集群模式铺平了道路，是理解Redis分布式架构不可或缺的一环。
