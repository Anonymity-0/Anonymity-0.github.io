---
title: reids哨兵
slug: reids-sentry-2qlsyt
url: /post/reids-sentry-2qlsyt.html
date: '2025-09-29 15:54:48+08:00'
lastmod: '2025-09-29 16:13:37+08:00'
tags:
  - redis
categories:
  - Java八股文
keywords: redis
toc: true
isCJKLanguage: true
---





是什么

吹哨人巡查监控后台master主机是否故障，如果故障了根据投票数自动  
将某一个从库转换为新主库，继续对外服务B  
作用  

哨兵的作用：  
、监控redis运行状态，包括master和slave  
2、**当masterdown机，能自动将slave切换成新master**

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250929155559.png)

‍

作用俗称，无人值守运维

官网理论  
能干嘛

主从监控监控主从redis库运行是否正常  
消息通知哨兵可以将故障转移的结果发送给客户端  
如果Master异常，则会进行主从切换，  
故障转移将其中一个Slave作购新Master  
配置中心客户端通过连接哨兵来获得当前Redis服务的主节点地址

‍

怎么玩（案例演示实战步骤）82

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250929155718.png)

3个哨兵自动监控和维护集群，不存放数据，只是吹哨人  
1主2从用于数据读取和存放

‍

‍

哨兵一定要配集群，不然没什么用

guorum表示最少有几个哨兵认可客观下线，  
同意故障迁移的法定票数。  
行尾最后的quorum代表什么意思呢？quorum：确认客观下线的最少的哨兵数量  
sentinel monitor <master-name><ip> <redis-port> <quorum>  
#Tells Sentineltomonitonthis master.andtoconsider it  
#（Objectively Down）stateonlyif at least <quorum> sentinels agree.  
#Note that whatever is the ODowN quorum，a Sentinel will require to  
#start a failover, so no failover can be performed in minority.  
#beelected by the majority of the known Sentinels in order to  
​#any way.Sentinel itself will rewrite this configuration file adding#Replicas are auto-discovered, so you don't need to specify replicas in  
#the replicas usingadditional configuration options.  
#Alsonote that the configuration file isrewritten when a  
replica is promoted to master.  
Note:master name should not include special characters or spaces.  
#The valid charset isA-zO9 and the three characters  
我们知道，网络是不可靠的，有时候一个sentinel会因为网络堵塞而误以为一个masterredis已经死掉了，在  
Sentinel集群环境下需要多个sentinel互相沟通来确认某个master是否真的死了，quorum这个参数是进行客观  
下线的一个依据，意思是至少有quorum个sentinel认为这个master有故障，才会对这个master进行下线以及  
故障转移。因为有的时候，某个sentinel节点可能因为自身网络原因，导致无法连接master，而此时master并  
没有出现故障，所以，这就需要多个sentinel都一致认为该master有问题，才可以进行下一步操作，这就保证  
了公平性和高可用。

其它  
sentinel down-after-milliseconds<master-name><milliseconds>:  
指定多少毫秒之后，主节点没有应答哨兵，此时哨兵主观上认为主节点下线  
sentinel parallel-syncs<master-name><nums>:  
表示允许并行同步的slave个数，当Master挂了后，哨兵会选出新的Master，此时，剩余的slave会向新的master发起同步数据  
sentinel failover-timeout<master-name><milliseconds>:  
故障转移的超时时间，进行故障转移时，如果超过设置的毫秒，表示故障转移失败  
sentinel notification-script<master-name><script-path>：  
配置当某一事件发生时所需要执行的脚本  
sentinel client-reconfig-script<master-name><script-path>:  
客户端重新配置主节点参数脚本

哨兵运行流程和选举原理39

当一个主从配置中的master失效之后，sentinel可以选举出一个新的master  
用于自动接替原master的工作，主从配置中的其他redis服务器自动指向新的master同步数据。  
一般建议sentinel采取奇数台，防止某一台sentinel无法连接到master导致误切换  
运行流程，故障切换

‍

运行流程，故障切换

个哨兵监控一主二从，正常运行中  
SDown主观下线(SubjectivelyDown）

SDOWN（主观不可用）是单个sentinel自己主观上检测到的关于master的状态，从sentinel的角度来看，  
如果发送了PING心跳后，在一定时间内没有收到合法的回复，就达到了SDOWN的条件。  
sentinel配置文件中的down-after-milliseconds设置了判断主观下线的时间长度  
说明

所谓主观下线（SubjectivelyDown，简称SDoWN）指的是单个Sentinel实例对服务器做出的下线判断，即单个sentinel认为某个服务下线（有  
可能是接收不到订阅，之间的网络不通等等原因）J主观下线就是说如果服务器在[sentinel down-after-milliseconds]给定的毫秒数之内没有回应  
PING命令或者返回一个错误消息，那么这个Sentinel会主观的（单方面的）认为这个master不可以用了，o（T_T)o  
106#sentinel down-after-milliseconds&lt;master-name&gt;&lt;milliseconds&gt;108#Number of milliseconds the master (or any attached replica or sentinel) should107#  
109 #be unreachable（as in，not acceptable reply to PING，continuously.for the110 # specified period) in order to consider it in S_DowN state(Subjectively111 # Down).112#在配置文件sentinel.conf默认值  
113#Default is 30seconds.  
114 sentinel down-after-milliseconds mymaster 30000  
115  
sentinel down-after-milliseconds<masterName><timeout>  
表示master被当前sentinel实例认定为失效的间隔时间，这个配置其实就是进行主观下线的一个依据  
master在多长时间内一直没有给Sentine返回有效信息，则认定该master主观下线。也就是说如果多久没联系上redis-servevr，认为这个  
redis-server进入到失效（SDowN）状态。

‍

ODown客观下线(ObjectivelyDown)

ODOWN需要一定数量的sentinel多个哨兵达成一致意见才能认为一个master客观上已经岩掉  
wn)  
说明quorum这个参数是进行客观下线的一个依据，法定人数/法定票数  
意思是至少有quorum个sentinel认为这个master有故障才会对这个master进行下线以及故障转移。因为有的时候，某个sentinel节  
点可能因为自身网络原因导致无法连接master，而此时master并没有出现故障，所以这就需要多个sentinel都一致认为该master有问  
题，才可以进行下一步操作，这就保证了公平性和高可用。默认是？  
选举出领导者哨兵（哨兵中选出兵王）

‍

‍

当主节点被判断客观下线以后，各个哨兵节点会进行协商  
先选举出一个领导者哨兵节点（兵王）并由该领导者节点，  
也即被选举出的兵王进行failover（故障迁移）  
4  
哨兵领导者，兵王如何选出来的？

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250929160535.png)

监视该主节点的所有哨兵都有可能被选为领导者，选举使用的算法是**Raft算法**；Rat算法的基本思路是先到先得：  
即在一轮选举中，哨兵A向B发送成为领导者的申请，如果B没有同意过其他哨兵，则会同意A成为领导者

‍

由兵王开始推动故障切换流程并选出一个新master

哨兵使用建议

某个Slave被选中成为新Master  
选出新master的规则，剩余slave节点健康前提下

redis.conf文件中，优先级slave-priority或者replica-priority最高的从节点（数字越小优先级越高）  
复制偏移位置offset最大的从节点  
最小RunID的从节点字典顺序，ASCII码

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250929160749.png)

朝天子一朝臣，换个码头重新拜  
执行slaveofnoone命令让选出来的从节点成为新的主节点，并通过slaveof命令让其他节点成为其从节点  
Sentinelleader会对选举出的新master执行slaveofnoone操作，将其提升为master节点  
Sentinelleader向其它slave发送命令，让剩余的slave成为新的master节点的slave

老master回来也认怂  
将之前已下线的老master设置为新选出的新master的从节点，当老master重新上线后，它会成为新master的从节点  
Sentinelleader会让原来的master降级为slave并恢复正常工作。

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250929160932.png)

哨兵节点的数量应为多个，哨兵本身应该集群，保证高可用  
哨兵节点的数量应该是奇数  
各个哨兵节点的配置应一致  
哨兵使用建议如果哨兵节点部署在Docker等容器里面，尤其要注意端口的正确映射  
**哨兵集群+主从复制，并不能保证数据零丢失，所以需要集群**  
G

‍

‍

‍

# **Redis 高可用“吹哨人”：Sentinel 哨兵模式**

在Redis的主从复制架构中，虽然实现了读写分离和数据备份，但仍然存在一个致命的弱点：当Master节点宕机时，系统会失去写能力，且无法自动恢复，需要人工介入进行故障转移。为了解决这个问题，Redis引入了**Sentinel（哨兵）模式**。

## **是什么：无人值守的运维专家**

Sentinel（哨兵），顾名思义，就是一位时刻巡查、监控Redis主从集群的“吹哨人”。它的核心职责是：**监控后台Master主机是否故障，如果故障了，就根据投票数自动将某一个从库提升为新的主库，并通知其他从库和客户端，从而实现无人值守的自动故障转移。**

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250929155559.png)

## **能干嘛：哨兵的四大核心职能**

1. **主从监控 (Monitoring)** ：Sentinel会持续不断地监控主库、从库以及其他哨兵节点的运行状态。
2. **故障转移 (Failover)** ：当Master节点被判定为宕机时，Sentinel能**自动**在从库中选举出一个新的Master，保证集群服务的连续性。
3. **消息通知 (Notification)** ：Sentinel可以将故障转移的结果和最新的主库地址，通知给客户端应用程序。
4. **配置中心 (Configuration Provider)** ：客户端在初始化时，不再需要直连Redis主库，而是连接Sentinel集群。Sentinel会告诉客户端当前哪个节点是Master，从而让客户端能够动态地找到服务地址。

## **怎么玩：搭建一个健壮的哨兵集群**

一个生产环境的哨兵部署，通常是 **“一个主从集群 + 一个哨兵集群”** 的模式。

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250929155718.png)

- **哨兵集群**：至少部署3个哨兵节点，以形成一个健壮的、能够进行投票决策的集群。哨兵节点本身不存储任何业务数据，它们只存储监控和配置信息。
- **主从集群**：典型的一主二从或更多从的结构，负责数据的读写和存储。

**核心配置 (**​**​`sentinel.conf`​**​ **)**

哨兵的配置非常简洁，最核心的一行是：

```conf
# sentinel monitor <master-name> <ip> <redis-port> <quorum>
sentinel monitor mymaster 127.0.0.1 6379 2
```

- ​`<master-name>`: 给被监控的主库起一个别名，如 `mymaster`。
- ​`<ip> <redis-port>`: 主库的地址和端口。
- ​`<quorum>`: **法定票数**。这是哨兵模式的灵魂所在。它表示，至少需要有 **2** 个哨兵节点都认为主库宕机了，才会将其判定为“客观下线”，并触发后续的故障转移流程。这个机制避免了因单个哨兵网络抖动而导致的误判。

**其他重要配置**：

- ​`sentinel down-after-milliseconds <master-name> <milliseconds>`: 判定“主观下线”的超时时间。如果一个哨兵在指定毫秒数内没有收到主库的有效回复，它会**主观上**认为主库宕机了。
- ​`sentinel parallel-syncs <master-name> <nums>`: 在故障转移后，允许多少个从库同时向新的主库同步数据。
- ​`sentinel failover-timeout <master-name> <milliseconds>`: 故障转移操作的超时时间。

## **核心原理：故障转移的完整流程**

当Master节点出现问题时，哨兵集群会经历一个严谨的、多阶段的流程来完成故障转移。

**第一阶段：主观下线 (Subjectively Down - SDown)**

- 每个哨兵节点都会独立地、周期性地向Master发送`PING`命令。
- 如果在`down-after-milliseconds`配置的时间内，某个哨兵没有收到Master的有效回复，它就会在自己的认知里，将Master标记为**主观下线 (SDown)** 。
- 此时，仅仅是这个哨兵单方面认为Master出问题了，还不会触发任何操作。

**第二阶段：客观下线 (Objectively Down - ODown)**

- 当一个哨兵将Master标记为SDown后，它会向其他哨兵节点发送询问命令，确认它们是否也认为Master宕机了。
- 当认为Master是SDown的哨兵数量，达到了配置文件中设置的`quorum`法定票数时，Master就会被正式标记为**客观下线 (ODown)** 。
- ODown是一个集体共识，表明Master确实是出故障了，此时故障转移流程正式启动。

**第三阶段：选举领导者哨兵 (Leader Election)**

- 为了避免多个哨兵同时进行故障转移导致混乱，所有哨兵节点需要先选举出一个“领导者”（我们称之为“兵王”）。
- 选举采用的是**Raft算法**，其核心思想是“先到先得”。一个哨兵会向其他哨兵发送成为领导者的请求，收到的第一个请求的哨兵会投票同意。获得超过半数选票的哨兵，将成为本轮故障转移的领导者。

**第四阶段：故障转移 (Failover)**   
现在，由选举出的“兵王”哨兵来全权负责执行故障转移，流程如下：

1. **选出新Master**：

    - “兵王”会从所有从库中，按照一套严格的规则选出一个最合适的节点作为新的Master。选举规则依次是：

      1. **优先级最高**：`redis.conf`中`replica-priority`配置值最小的从库。
      2. **复制偏移量最大**：数据最接近原Master的从库。
      3. **Run ID最小**：如果前两者都相同，则选择运行ID最小的。
2. **“黄袍加身”** ：

    - “兵王”对选出的新Master执行 `SLAVEOF no one` 命令，使其“反客为主”，正式成为新的主库。
3. **“改换门庭”** ：

    - “兵王”向所有其余的从库发送 `SLAVEOF <new-master-ip> <new-master-port>` 命令，让它们转而复制新的主库。
4. **“降级为奴”** ：

    - “兵王”会继续监控那个已经宕机的旧Master。当它某天恢复上线后，“兵王”会向它发送`SLAVEOF`命令，让它成为新Master的从库。

![image](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/20250929160932.png)

#### **哨兵使用建议**

- **哨兵应成集群**：至少部署3个哨兵节点，以保证高可用和正确的决策能力。
- **哨兵数量应为奇数**：这有助于Raft算法在选举中更容易地获得超过半数的选票。
- **哨兵配置应一致**：所有哨兵节点的配置（尤其是`quorum`和`down-after-milliseconds`）应保持一致。
- **数据丢失风险**：由于主从复制是异步的，哨兵+主从复制的架构并**不能保证数据零丢失**。在Master宕机到故障转移完成的瞬间，可能有一小部分已写入Master但尚未同步到Slave的数据会丢失。对于需要强一致性的场景，可能需要考虑Redis Cluster。
