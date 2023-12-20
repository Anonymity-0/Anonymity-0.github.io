---
title: "Portland"
description: 
date: 2023-12-20T22:51:25+08:00
image: 
math: 
license: 
hidden: false
comments: true
draft: false
categories:
    - 高级计算机网络
tags:
    - 论文笔记
---

# PortLand: a scalable fault-tolerant layer 2 data center network fabric

* * *

## 💡 Meta Data

<table><tbody><tr><th style="background-color: rgb(219, 238, 221);"><p style="text-align: left"><span style="background-color: #dbeedd">Title</span></p></th><td style="background-color: rgb(219, 238, 221);"><p><span style="background-color: #dbeedd">PortLand: a scalable fault-tolerant layer 2 data center network fabric</span></p></td></tr><tr><th style="background-color: rgb(243, 250, 244);"><p style="text-align: left"><span style="background-color: #f3faf4">Journal</span></p></th><td style="background-color: rgb(243, 250, 244);"><p></p></td></tr><tr><th style="background-color: rgb(219, 238, 221);"><p style="text-align: left"><span style="background-color: #dbeedd">Authors</span></p></th><td style="background-color: rgb(219, 238, 221);"><p><span style="background-color: #dbeedd">Radhika Niranjan Mysore; Andreas Pamboris; Nathan Farrington; Nelson Huang; Pardis Miri; Sivasankar Radhakrishnan; Vikram Subramanya; Amin Vahdat</span></p></td></tr><tr><th style="background-color: rgb(243, 250, 244);"><p style="text-align: left"><span style="background-color: #f3faf4">Pub. date</span></p></th><td style="background-color: rgb(243, 250, 244);"><p><span style="background-color: #f3faf4">八月 16, 2009</span></p></td></tr><tr><th style="background-color: rgb(219, 238, 221);"><p style="text-align: left"><span style="background-color: #dbeedd">期刊标签</span></p></th><td style="background-color: rgb(219, 238, 221);"><p></p></td></tr><tr><th style="background-color: rgb(243, 250, 244);"><p style="text-align: left"><span style="background-color: #f3faf4">DOI</span></p></th><td style="background-color: rgb(243, 250, 244);"><p><span style="background-color: #f3faf4"><a href="https://doi.org/10.1145/1592568.1592575" rel="noopener noreferrer nofollow">10.1145/1592568.1592575</a></span></p></td></tr><tr><th style="background-color: rgb(219, 238, 221);"><p style="text-align: left"><span style="background-color: #dbeedd">附件</span></p></th><td style="background-color: rgb(219, 238, 221);"><p><span style="background-color: #dbeedd"><a href="zotero://open-pdf/0_LESYP9QN" rel="noopener noreferrer nofollow">Niranjan Mysore 等 - 2009 - PortLand a scalable fault-tolerant layer 2 data c.pdf</a></span></p></td></tr></tbody></table>

## 📜 研究背景 & 基础 & 目的

* * *

这篇论文的研究背景是针对日益增长的数据中心网络中存在的限制和挑战，例如在现有的层2和层3网络协议在支持大规模数据中心中的灵活性、效率和容错性方面存在的局限性 在笔者提出的论文中，研究的基础是现有网络协议在面临未来单个站点拥有数百万虚拟终端的数据中心时所面临的挑战，特别是关注于如何在这种大规模环境中实现可扩展、易管理、容错和高效的数据中心网络结构

论文的目的是设计和实现一种名为PortLand的协议，该协议旨在解决现有网络在数据中心部署中的局限性，通过提供一种可扩展、容错、并适用于数据中心环境的层2路由和转发协议通过PortLand协议的设计和实施，论文的目的是展示该协议能够支持“即插即用”的大规模数据中心网络，并为数据中心网络提供更灵活、高效和容错的解决方案

ARP是地址解析协议（Address Resolution Protocol），用于将IP地址映射成对应的MAC地址的协议。在局域网中，当一台设备需要发送数据给另一台设备时，它会使用ARP来获取目标设备的MAC地址，以便将数据发送到正确的目标。ARP协议在以太网和其他局域网技术中广泛使用。

## 📊 研究内容

* * *

**PMAC是如何设计的**  
PMAC（Pseudo MAC）地址的设计是基于一种层次化的编码方式。在PortLand中，每个主机被分配一个唯一的PMAC地址，该地址编码了主机在拓扑结构上的位置。例如，在同一个pod中的所有终节点的PMAC地址具有相同的前缀。主机保持不变，认为它们仍然使用其实际的MAC地址（AMAC）。当主机发送ARP请求时，它们接收到目标主机的PMAC地址[5a]。所有的数据包转发都是基于PMAC地址进行的，这样可以实现非常小的转发表。发送数据包时，出口交换机会对PMAC地址进行重写，将其转换为目标主机的AMAC地址，以保持主机不变的MAC地址的幻象。

![image](https://cdn.jsdelivr.net/gh/Anonymity-0/Picgo@note_picture/img/image.58jtvgee9ds0.webp)  


步骤1：当入口交换机首次看到源MAC地址时，会将数据包传送到交换机。

步骤2a：软件在本地PMAC表中创建一个条目，将主机的AMAC和IP地址映射到其PMAC。边缘交换机决定PMAC。

步骤2b：交换机将此映射通信给“Fabric Manager”。

步骤3：“Fabric Manager”使用此状态来响应ARP请求。交换机还会创建适当的流表条目，将 PMAC 目标地址重写为 AMAC，以便对任何发送到主机的流量重写PMAC目的地地址。

### Proxy-based ARP

“Ethernet by default broadcasts ARPs to all hosts in the same layer 2 domain. We leverage the fabric manager to reduce broadcast overhead in the common case, as depicted in Figure 3. In step 1, an edge switch intercepts an ARP request for an IP to MAC address mapping and forwards the request to the fabric manager in step 2. The fabric manager consults its PMAC table to see if an entry is available for the target IP address. If so, it returns the PMAC in step 3 to the edge switch. The edge switch creates an ARP reply in step 4 and returns it to the original host.” (Niranjan Mysore 等, 2009, p. 43) 🔤以太网默认情况下会向同一第 2 层域中的所有主机广播 ARP。如图 3 所示，我们利用结构管理器来减少普通情况下的广播开销。在步骤 1 中，边缘交换机拦截 IP 到 MAC 地址映射的 ARP 请求，并在步骤 2 中将请求转发给结构管理器。Fabric 管理器会查询其 PMAC 表，查看是否有目标 IP 地址的条目。如果有，它会在步骤 3 中将 PMAC 返回给边缘交换机。边缘交换机在步骤 4 中创建 ARP 回复，并将其返回给原始主机。🔤

![image](https://cdn.jsdelivr.net/gh/Anonymity-0/Picgo@note_picture/img/image.6pnerd5w0tc0.webp)

步骤1-2：边缘交换机拦截针对IP到MAC地址映射的ARP请求，并将请求转发给布线管理器。**ARP请求不被广播**。

步骤3：布线管理器查询其PMAC表，查看目标IP地址是否有条目可用。如果有，则返回PMAC给边缘交换机。

步骤4：边缘交换机创建ARP响应，并将其返回给原始主机。

“Note that end hosts receive PMACs in response to an ARP request and that all packet forwarding proceeds based on the hierarchical PMAC. The egress switch performs PMAC to AMAC rewriting only on the last hop to the destination host.” (Niranjan Mysore 等, 2009, p. 43)

PMAC是针对ARP请求的应答而接收到的，所有数据包转发都是根据层次式PMAC进行的。出口交换机只在最后一跳到达目标主机时才执行PMAC到AMAC的重写。

### Distributed Location Discovery

**LDP**

“we also present a location discovery protocol (LDP) that requires no administrator configuration. PortLand switches do not begin packet forwarding until their location is established.” (Niranjan Mysore 等, 2009, p. 44) 🔤我们还介绍了一种无需管理员配置的位置发现协议（LDP）。在确定位置之前，PortLand 交换机不会开始转发数据包。🔤

**LDM**

“PortLand switches periodically send a Location Discovery Message (LDM) out all of their ports both, to set their positions and to monitor liveness in steady state. LDMs contain the following information:” (Niranjan Mysore 等, 2009, p. 44) 🔤PortLand 交换机会定期向其所有端口发送位置发现信息（LDM），以设置其位置并监控稳定状态下的有效性。LDM 包含以下信息：🔤

- 交换机标识符（switch id）：每个交换机的全局唯一标识符，如所有本地端口的最低 MAC 地址。
- pod 号码（pod）：同一 pod 中所有交换机共享的号码（见图 1）。不同 pod 中的交换机将有不同的 pod 编号。核心交换机从不设置此值。
- 位置 (pos)：分配给每个边缘交换机的编号，在每个 pod 中都是唯一的。
- 树级别（level）：0、1 或 2，取决于交换机是边缘交换机、汇聚交换机还是核心交换机。我们的方法适用于更深的层次结构。
- 向上/向下（dir）：Up/down（向上/向下）是一个位，表示交换机端口在多根树中的朝向是向下还是向上。

![image](https://cdn.jsdelivr.net/gh/Anonymity-0/Picgo@note_picture/img/image.77l4xh96qik0.webp)

> 行7:如果一个交换机在足够长的时间内没有连接到超过 k/2 个邻居交换机，则它是边缘交换机。行8:incoming_port up 在接收到任何后续的LDM时，边缘交换机推断相应的入站端口是一个朝上的端口。

> 行10、11:交换机在上行端口上接收到来自边缘交换机的 LDM 时，会断定自己一定是聚合交换机，而且相应的传入端口是下行端口。

> 行12-13:"第12-13行处理核心/聚合交换机向尚未设置部分端口方向的聚合/边缘交换机传输LDMS的情况。"行14:核心交换机的验证首先要验证其所有活动端口都已连接到其他 PortLand 交换机

> 行15-18:然后在第 15-18 行中验证所有邻居都是尚未设置链接方向的汇聚交换机（连接到边缘交换机的汇聚交换机端口已被确定为朝下）。

> 行20:如果这些条件成立，交换机就可以断定自己是核心交换机，并将其所有端口设置为向下。

> 如算法 1 第 2-4 行和第 29 行所示，在多个位置号码同时被提议的情况下，聚合交换机会将提议的位置号码保留一段时间，然后再计时。


起初，除了交换机标识符和端口号外，其他所有值都是未知的。

我们假设所有交换机端口都处于三种状态之一：断开、连接到终端主机或连接到另一台交换机。

“Edge switches learn their level by determining that some fraction of their ports are host connected.” 🔤边缘交换机通过确定其部分端口已连接主机来了解其等级。🔤

“Level assignment then flows up the tree. Aggregations switches set their level once they learn that some of their ports are connected to edge switches.” 🔤然后，级别分配会沿着树向上流动。汇聚交换机在得知其部分端口连接到边缘交换机后，就会设置自己的级别。🔤

“Finally, core switches learn their levels once they confirm that all ports are connected to aggregation switches.” 🔤最后，核心交换机在确认所有端口都连接到汇聚交换机后，就会学习其级别。🔤

### Provably Loop Free Forwarding

交换机使用 LDP 建立本地位置后，就会利用来自邻居的更新来填充转发表。

核心交换机会了解直接连接的汇聚交换机的 pod 编号。转发数据包时，核心交换机只需检查 PMAC 目标地址中与 pod 编号相对应的位，即可确定适当的输出端口。

汇聚交换机也会了解所有直接连接的边缘交换机的位置编号。汇聚交换机必须通过检查 PMAC 来确定数据包的目的地是同一 pod 中的主机还是不同 pod 中的主机。如果在同一 pod 中，则必须将数据包转发到与 PMAC 中位置条目相对应的输出端口。

如果在不同的 pod 中，在无故障的情况下，数据包可以沿着汇聚交换机的任何链路转发到核心层。为实现负载平衡，交换机可采用多种技术选择合适的输出端口。Fabric 管理器将采用额外的流量表项来覆盖单个流量的默认转发行为。不过，这一决定与本工作无关，因此我们假定采用标准技术，如 ECMP 中的流量散列技术[16]。

我们的转发协议通过观察上行-下行语义[26]可证明是无环的，数据包将总是被转发至聚合交换机或核心交换机，然后向其最终目的地下行传输。我们通过确保一旦数据包开始向下传输，便不可能向拓扑结构的上行传输，以防止瞬时环路和广播风暴。

### “Fault Tolerant Routing”

![image](https://cdn.jsdelivr.net/gh/Anonymity-0/Picgo@note_picture/img/image.wqfmfdicnr4.webp)

步骤1：如果在一段可配置的时间内没有接收到LDM(在此上下文中也称为keepalive)，交换机将在步骤1中假定链路发生故障。

步骤2:检测交换机将故障通知fabric管理器。

步骤3:fabric管理器维护一个包含整个拓扑的每链路连接信息的逻辑故障矩阵，并用新信息更新它。

步骤4:最后，在步骤4中，fabric管理器将故障通知所有受影响的交换机，然后这些交换机根据新版本的拓扑分别重新计算它们的转发表。

“Required state for network connectivity is modest, growing with k3/2 for a fully-configured fat tree built from k-port switches.” (Niranjan Mysore 等, 2009, p. 45) 网络连接所需的状态是适度的，对于由k端口交换机构建的完全配置的胖树来说，它随着k3/2的增长而增长。

![image](https://cdn.jsdelivr.net/gh/Anonymity-0/Picgo@note_picture/img/image.4sshadtqs2a0.webp)

### Fault Tolerant Routing for Multicast

现在我们考虑组播和广播情况下的容错。相对于现有的协议，我们考虑的故障场景是，没有一个单一的生成树植根于一个核心交换机，能够覆盖一个多播组或广播会话的所有接收器。考虑图5中的示例。

![image](https://cdn.jsdelivr.net/gh/Anonymity-0/Picgo@note_picture/img/image.5hddjlvc5o00.webp)

在这里，我们有一个多播组映射到最左边的核心交换机。有三个接收器，分布在0号pod和1号pod（图中三个R）。发送端将数据包转发到指定的核心交换机，核心交换机再将数据包分发给接收端。

步骤1：在步骤1中，pod 0中两个突出显示的链接同时失败。

步骤2:两个汇聚交换机检测到故障并通知fabric管理器

步骤3:fabric管理器更新其故障矩阵。

步骤4:fabric管理器计算所有受影响的多播组的转发表项。

步骤5:我们通过计算与每个多播组相关联的接收器集的贪婪集覆盖来处理这种情况。这可能导致多个指定的核心交换机与多播或广播组相关联。fabric管理器在图5的步骤5中将所需的转发状态插入到适当的表中。

从故障中恢复需要通过pod 0中的两个单独的聚合交换机进行转发。但是，不存在同时连接两个汇聚交换机的单核交换机。

## 🚩 研究结论

* * *

## 📌 感想 & 疑问

* * *

### Why existing L2 and L3 techniques can not satisfy  R1-5 for the cloud datacenter?

1. **单一网络结构（R1和R2）：** 云数据中心要求整个数据中心使用一个相同的网络结构，但L3技术需要为每个交换机配置子网信息，而L2技术由于需要支持广播而面临效率和可扩展性的挑战。
2. **透明虚拟机迁移（R3）：** 在L3中，虚拟机迁移到不同子网的主机时需要切换IP地址，这导致透明的迁移变得不可能。而L2的MAC表也面临着在硬件上不切实际的问题。
3. **转发环路问题（R4）：** 无论是L2还是L3，在路由收敛期间都可能发生转发环路问题，这在设计上很困难。
4. **高效路由协议（R5）：** 要求一种能够快速传播拓扑变化的高效路由协议，但现有的L2和L3协议都是基于广播的，效率不高。

### What is PMAC address?、

PMAC（Pseudo MAC）地址是PortLand网络设计中使用的一种地址。每个终端主机在PortLand中被分配了一个唯一的PMAC地址，用于编码该主机在网络拓扑中的位置。PMAC地址使得路由转发和虚拟机迁移变得高效。终端主机保持其实际的MAC（AMAC）地址不变，不知道自己被分配了一个PMAC地址。在进行ARP请求时，源主机会收到目标主机的PMAC地址。所有的数据包转发都基于PMAC地址进行，这样可以实现非常小的转发表。出口交换机会对PMAC地址进行转换，以保持目标主机的MAC地址不变。

### Location discovery.

位置发现是指在网络中确定设备的位置的过程。根据提供的上下文信息[2]，PortLand使用一种轻量级协议来帮助交换机发现其在拓扑中的位置。交换机通过接收LDM（Link Detection Message）来了解其邻居交换机的信息，通过判断与多少个邻居交换机相连来确定是否为边缘交换机。边缘交换机通常有一半以上的端口连接到终端设备。在确认自己是边缘交换机后，交换机可以通过在所有端口上进行PING操作来进一步确认其位置。终端设备将回复PING请求，而不会发送LDM。

### How PortLand satisfies R1 – R5?

1. R1: VM can migrate, introduce PMAC
2. R2: no configuration, LDP protocol
3. R3: use all equal cost paths, ECMP
4. R4: no loop
5. R5: failure-tolerant, fabric manager

PortLand满足R1-R5的方式如下：

1. **R1: 虚拟机迁移和引入PMAC：** PortLand允许虚拟机迁移，并引入了PMAC（Persistent MAC）来保持虚拟机在不同子网上的IP地址不变，实现了透明的虚拟机迁移。
2. **R2: 无需配置和LDP协议：** PortLand不需要在每个交换机上进行繁琐的配置，而是使用了LDP（Label Distribution Protocol）协议，简化了网络管理的复杂性。
3. **R3: 使用所有等价路径和ECMP：** 为了实现更好的负载均衡和性能，PortLand利用ECMP（Equal Cost Multipath）使用所有等价路径，确保数据流可以通过多条路径传输，提高网络利用率。
4. **R4: 无环路：** PortLand设计中考虑了防止转发环路的问题，确保在网络路由收敛时不会出现不必要的循环。
5. **R5: 容错性强，有Fabric Manager：** PortLand具备故障容忍性，通过Fabric Manager进行管理，确保在网络中出现故障时可以及时调整和修复，提高了网络的可靠性和稳定性。

是的，这篇文章使用了伪MAC地址（PMAC）技术。

## 🔬 理论推导

* * *