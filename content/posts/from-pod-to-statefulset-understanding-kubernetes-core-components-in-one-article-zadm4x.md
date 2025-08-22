---
title: 从 Pod 到 StatefulSet：一文读懂 Kubernetes 核心组件
slug: >-
  from-pod-to-statefulset-understanding-kubernetes-core-components-in-one-article-zadm4x
url: >-
  /post/from-pod-to-statefulset-understanding-kubernetes-core-components-in-one-article-zadm4x.html
date: '2025-06-29T00:13:38+08:00'
lastmod: '2025-06-29 00:13:38+08:00'
draft: false
params:
  author: AGA
math: false
hidden: false
comments: true
categories:
  - Kubernetes
tags:
  - 中间件学习
---



# 从 Pod 到 StatefulSet：一文读懂 Kubernetes 核心组件

刚接触 Kubernetes (K8s) 时，你可能会被其众多的组件和概念搞得眼花缭乱。但别担心，只要理解了其核心设计思想，一切都会变得清晰起来。本文将带你从最基本的计算单元开始，层层递进，逐步揭开 K8s 的神秘面纱。

## 1. Node & Pod：Kubernetes 的基本计算单元

### Node：集群的基石

在 K8s 的世界里，**Node** 是最基础的计算资源。你可以简单地将一个 Node 理解为一台服务器，无论它是物理机还是虚拟机。整个 K8s 集群就是由一个或多个这样的 Node 组成的。

### Pod：最小的调度单元

K8s 并不直接调度单个容器，而是调度一个更高层次的抽象——**Pod**。

- **Pod 是 K8s 中最小的部署和调度单元**。
- 一个 Pod 包含一个或多个紧密协作的容器。这些容器共享同一个网络命名空间（即共享同一个 IP 地址和端口空间）、存储卷以及运行配置。

![Node 与 Pod 的关系](/images/image-20250628214006-z18s8il.png)

虽然一个 Pod 可以运行多个容器，但最佳实践是 **“一个 Pod，一个主容器”** 。只有当容器之间高度耦合，需要共享资源才能完成特定功能时，才考虑将它们放在同一个 Pod 中。一个典型的例子就是 **Sidecar（边车）模式**：

> **Sidecar 模式**：将一个辅助容器（Sidecar）与主应用容器部署在同一个 Pod 中。Sidecar 负责处理日志收集、监控、网络代理等辅助任务，从而让主应用容器更专注于核心业务逻辑。

![Sidecar 模式示意图](/images/image-20250628214423-s8n3hab.png)

## 2. Service：为 Pod 提供稳定的访问入口

Pod 在创建时会被 K8s 自动分配一个集群内部的 IP 地址。Pod 之间可以通过这个 IP 直接通信。然而，这带来了两个棘手的问题：

1. **访问性问题**：Pod 的 IP 是集群内部地址，集群外部无法直接访问。
2. **稳定性问题**：Pod 是“脆弱”的。当 Pod 发生故障或进行更新时，K8s 会销毁旧 Pod 并创建新 Pod。新 Pod 的 IP 地址会发生变化，导致依赖旧 IP 的服务调用失败。

为了解决这些问题，K8s 引入了 **Service (svc)**  资源。

**Service** 为一组功能相同的 Pod 提供了一个统一、稳定的访问入口。它拥有一个固定的虚拟 IP（ClusterIP），并将所有发往该 IP 的请求，通过内置的负载均衡机制，智能地转发到其后端健康的 Pod 上。

![Service 封装 Pod](/images/image-20250628215514-n0io8bq.png)

> 即使后端的 Pod 因故障被重建，IP 地址发生了变化，Service 的地址依然保持不变。它会自动发现新的健康 Pod，确保服务不中断。

![Service 自动转发请求](/images/image-20250628215719-6s63vvr.png)

## 3. Ingress：集群的智能流量网关

Service 解决了集群内部的访问问题，但如果想让外部用户访问我们的应用（例如网站前端或 API 接口），又该怎么办呢？

一种方法是使用 `NodePort`​ 类型的 Service，它会在每个 Node 上开放一个指定的端口，并将流量转发到 Service。这样，我们就可以通过 `[Node IP]:[NodePort]`​ 来访问服务。

这种方式在开发测试阶段尚可接受，但在生产环境中，我们更希望通过域名（如 `api.example.com`​）来访问服务。这时，**Ingress** 就派上用场了。

**Ingress** 是 K8s 集群的流量入口管理器。它像一个智能的七层（HTTP/HTTPS）网关，可以根据不同的域名或 URL 路径，将外部流量转发到集群内不同的 Service。

通过 Ingress，我们可以实现：

- **域名路由**：将 `app1.example.com`​ 指向 `service-a`​，将 `app2.example.com`​ 指向 `service-b`​。
- **路径路由**：将 `example.com/api`​ 指向 `api-service`​，将 `example.com/web`​ 指向 `web-service`​。
- **SSL/TLS 终止**：集中管理 HTTPS 证书，为服务提供加密。
- **负载均衡**：在多个 Service 之间分配流量。

  ‍

![Ingress 流量分发](/images/image-20250628223820-1ncd6et.png)

## 4. ConfigMap & Secret：解耦配置与敏感数据

为了保持应用程序的可移植性，我们应该将**配置信息**与**应用程序镜像**分离开。K8s 提供了两种资源来帮助我们实现这一点。

### ConfigMap：管理普通配置

​`ConfigMap`​ 用于存储非敏感的配置数据，如数据库地址、端口号、功能开关等。应用程序可以在运行时动态读取这些配置。

> 当配置需要变更时，我们只需修改 `ConfigMap`​ 对象并重启 Pod 即可，无需重新构建和部署整个应用程序镜像。

### Secret：管理敏感信息

​`ConfigMap`​ 中的数据是明文存储的，不适合存放密码、API 密钥等敏感信息。为此，K8s 提供了 `Secret`​。

​`Secret`​ 的用途和 `ConfigMap`​ 类似，但它是专门为存储敏感数据而设计的。需要注意的是，`Secret`​ 默认只对数据进行 Base64 编码，并非强加密。它真正的安全性来自于 K8s 的访问控制（RBAC）和网络策略，确保只有授权的 Pod 才能访问到特定的 `Secret`​。

![ConfigMap 与 Secret](/images/image-20250628230455-roq18nq.png)

## 5. Volume：让容器数据不再“昙花一现”

容器的文件系统是临时的。当容器被销毁或重启时，其中的数据也会随之丢失。这对于需要持久化数据的应用（如数据库、文件上传服务）是不可接受的。

K8s 的 **Volume** 机制解决了这个问题。它允许我们将一个存储卷（Volume）挂载到 Pod 的一个或多个容器中。这个存储卷的生命周期独立于容器，可以是：

- **节点本地磁盘** (`hostPath`​)
- **云存储** (如 AWS EBS, GCE Persistent Disk)
- **网络存储** (如 NFS, Ceph)

这样，即使 Pod 被销毁重建，只要新的 Pod 挂载回同一个 Volume，数据就能得以保留。

## 6. Deployment：轻松管理无状态应用

单个 Pod 无法保证高可用。如果 Pod 所在的 Node 宕机，或者我们需要对应用进行升级，服务就会中断。

解决方案很简单：**运行多个副本**。当一个副本失效时，流量可以无缝切换到其他健康副本上。

**Deployment** 是 K8s 中用于管理**无状态应用**（如 Web 服务器、API 网关）的核心控制器。它在 Pod 的基础上增加了一层强大的管理能力：

- **副本控制**：定义并维护指定数量的 Pod 副本。如果某个 Pod 挂了，Deployment 会自动创建一个新的来替代它，始终确保运行的副本数符合预期。
- **滚动更新**：支持平滑地升级应用版本。它会逐个用新版 Pod 替换旧版 Pod，确保在整个更新过程中服务不中断。
- **回滚操作**：如果新版本出现问题，可以一键回滚到之前的稳定版本。

![Deployment 管理多个 Pod 副本](/images/image-20250628231940-8wkrdsc.png)

> 可以说，Deployment 是在 Pod 之上的一层抽象，它赋予了我们对应用进行生命周期管理、扩缩容和版本控制的能力。

## 7. StatefulSet：有状态应用的守护神

对于数据库、消息队列这类**有状态应用**，Deployment 就不太适用了。因为这类应用的每个副本通常不是完全对等的，它们有自己独特的身份和持久化数据。

例如，一个主从数据库集群，主节点和从节点承担的角色不同，每个节点都有自己独立的数据存储。

为了管理这类应用，K8s 提供了 **StatefulSet**。

**StatefulSet** 和 Deployment 类似，也能管理 Pod 副本。但它为有状态应用提供了额外的保障：

- **稳定的网络标识**：每个 Pod 都有一个固定的、可预测的主机名（如 `db-0`​, `db-1`​）。
- **稳定的持久化存储**：每个 Pod 都关联一个独立的、持久的存储卷。即使 Pod 重启，它也会被重新挂载到原来的存储卷上。
- **有序的部署和伸缩**：Pod 会按照顺序（0, 1, 2...）创建和销毁，这对于需要依赖启动顺序的集群应用至关重要。

![StatefulSet 管理有状态应用](/images/image-20250628235851-rho2le5.png)

## 总结与思考

我们从最基础的 **Pod** 和 **Node** 出发，通过 **Service** 实现了稳定的服务访问，利用 **Ingress** 对外暴露服务并进行流量管理。接着，我们用 **ConfigMap** 和 **Secret** 解耦了配置，用 **Volume** 实现了数据持久化。最后，我们学习了如何用 **Deployment** 管理无状态应用，以及用 **StatefulSet** 驾驭复杂的有状态应用。

> **一个实用的建议**：StatefulSet 虽然强大，但管理起来也相对复杂。在许多场景下，一种更简单、更通用的做法是将数据库这类核心有状态服务部署在 K8s 集群之外（例如使用云厂商提供的 RDS 服务），让 K8s 专注于管理无状态应用。这可以大大简化集群的架构和维护成本。

‍
