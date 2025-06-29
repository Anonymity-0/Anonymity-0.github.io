---
title: 告别单节点：使用 Multipass + k3s 搭建本地多节点 K8s 集群
slug: >-
  say-goodbye-to-single-node-use-multipass-k3s-to-build-a-local-multinode-k8s-cluster-1gako2
url: >-
  /post/say-goodbye-to-single-node-use-multipass-k3s-to-build-a-local-multinode-k8s-cluster-1gako2.html
date: '2025-06-29 15:02:11+08:00'
lastmod: '2025-06-29 15:08:13+08:00'
categories:
  - Kubernetes
toc: true
isCJKLanguage: true
---



# 告别单节点：使用 Multipass + k3s 搭建本地多节点 K8s 集群

在上一篇文章中，我们介绍了如何使用 Minikube 快速搭建一个单节点的 Kubernetes 环境。Minikube 无疑是入门学习和简单应用测试的绝佳工具，但当我们需要模拟更真实的生产场景，例如测试高可用性、网络策略或多节点调度时，单节点的局限性就显现出来了。

这一次，我们将探索一种更强大的本地集群搭建方案：使用 **Multipass** 和 **k3s**，从零开始构建一个功能完备的**多节点** Kubernetes 集群。

### 主角介绍：Multipass 与 k3s

- **[Multipass](https://multipass.run/)**​ **:**  由 Canonical (Ubuntu 的母公司) 出品的一款轻量级虚拟机管理器。你可以把它想象成一个命令行版的 VirtualBox 或 VMware，但更加轻巧、快捷，专为开发者设计，能让你在数秒内启动一个全新的 Ubuntu 虚拟机。
- **[k3s](https://k3s.io/)**​ **:**  一个经过 CNCF (云原生计算基金会) 认证的轻量级 Kubernetes 发行版。它由 Rancher Labs（现为 SUSE 的一部分）推出，通过移除和替换一些非核心组件，极大地简化了 K8s 的安装和运维，同时保持了完全的兼容性。

强强联合，我们将使用 Multipass 快速创建所需的虚拟机，然后用 k3s 在这些虚拟机上轻松部署一个多节点 K8s 集群。

### 第一步：安装和熟悉 Multipass

Multipass 是我们创建“服务器”的基础。让我们先安装并掌握它的基本用法。

#### 1.1 安装 Multipass

根据你的操作系统，选择对应的安装方式：

```bash
# macOS (使用 Homebrew)
brew install multipass

# Windows (使用 Chocolatey)
choco install multipass

# Linux (使用 Snap)
sudo snap install multipass
```

#### 1.2 Multipass 常用命令

你不需要记住所有命令，但以下这些是日常使用中的必备法宝。可以通过 `multipass help <command>`​ 查看具体用法。

```bash
# 查看虚拟机列表
multipass list

# 创建一个名为 k3s-master 的虚拟机
multipass launch --name k3s-master

# 查看虚拟机详细信息 (包括 IP 地址)
multipass info k3s-master

# 进入虚拟机的 shell 环境
multipass shell k3s-master

# 在虚拟机内执行单个命令
multipass exec k3s-master -- ls -l /home/ubuntu

# 挂载本地目录到虚拟机
# 将本地的 ~/k8s-data 目录挂载到虚拟机的 /data 目录
multipass mount ~/k8s-data k3s-master:/data

# 停止、启动、删除虚拟机
multipass stop k3s-master
multipass start k3s-master
multipass delete k3s-master

# 彻底清理已删除的虚拟机（释放磁盘空间）
multipass purge
```

> **💡 经验分享：关于 M1/M2 Mac 的一个坑**  
> 有用户反馈，在搭载 Apple Silicon 芯片的 Mac 上，每次 macOS 系统大版本升级后，Multipass 创建的虚拟机可能会丢失。这是一个需要注意的问题，建议在系统升级前做好数据备份。
>
> - **镜像位置**: `/var/root/Library/Application Support/multipassd/qemu/vault/instances`​
> - **配置文件**: `/var/root/Library/Application Support/multipassd/qemu/multipassd-vm-instances.json`​

### 第二步：实战！搭建多节点 k3s 集群

基础工具准备就绪，现在开始搭建我们的 `1 Master + 2 Worker`​ 集群。

#### 2.1 创建和配置 Master 节点

首先，我们用 Multipass 创建一个配置稍高一些的虚拟机作为 Master 节点。

```bash
# 创建一个名为 k3s-master 的虚拟机，分配 2 核 CPU, 8GB 内存, 10GB 磁盘
multipass launch --name k3s-master --cpus 2 --memory 8G --disk 10G
```

虚拟机创建成功后，我们就可以在其中安装 k3s 了。k3s 的安装过程极其简单，只需一条命令即可将当前节点设置为 Master。

进入 Master 节点的 shell 环境：

```bash
multipass shell k3s-master
```

在 `k3s-master`​ 的 shell 中，执行以下安装命令：

```bash
# 推荐国内用户使用 mirror 源加速安装
curl -sfL https://rancher-mirror.rancher.cn/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn sh -

# 或者使用官方源
# curl -sfL https://get.k3s.io | sh -
```

安装完成后，k3s 会自动启动，并内置了 `kubectl`​。我们可以立即验证 Master 节点的状态：

```bash
# 注意：k3s 的 kubectl 需要 sudo 权限
sudo kubectl get nodes
```

你应该能看到一个名为 `k3s-master`​ 的节点，状态为 `Ready`​。

#### 2.2 创建和配置 Worker 节点

要让 Worker 节点加入集群，它们需要两样东西：

1. **Master 节点的 IP 地址**
2. **一个安全的加入凭证 (Token)**

让我们来获取它们。

**首先，获取 Master 节点的 Token。**  这个 Token 存储在 Master 节点的一个文件里。  
在 `k3s-master`​ 的 shell 中执行：

```bash
sudo cat /var/lib/rancher/k3s/server/node-token
```

复制这个 Token，我们稍后会用到。

**然后，获取 Master 节点的 IP 地址。**  退出 `k3s-master`​ 的 shell (输入 `exit`​)，在**你自己的电脑终端**上执行：

```bash
multipass info k3s-master | grep IPv4 | awk '{print $2}'
```

记下这个 IP 地址。

**现在，我们来创建并加入 Worker 节点。**

为了方便操作，我们可以将刚刚获取的 Token 和 IP 存为本地终端的环境变量：

```bash
# 在你自己的电脑终端上执行
# 将 <YOUR_TOKEN> 替换为你刚刚从 Master 节点复制的 Token
export K3S_TOKEN="<YOUR_TOKEN>"

# 将 <MASTER_IP> 替换为你刚刚获取的 IP 地址
export MASTER_IP="<MASTER_IP>"
```

接下来，创建两个 Worker 虚拟机：

```bash
multipass launch --name k3s-worker1 --cpus 2 --memory 8G --disk 10G
multipass launch --name k3s-worker2 --cpus 2 --memory 8G --disk 10G
```

最后，使用一个 `for`​ 循环，批量让这两个 Worker 节点安装 k3s 并加入集群。这个命令会在每个 Worker 虚拟机上执行安装脚本，并通过环境变量 `K3S_URL`​ 和 `K3S_TOKEN`​ 告诉它们如何找到并加入 Master。

```bash
# 在你自己的电脑终端上执行
for i in 1 2; do
  multipass exec k3s-worker$i -- bash -c "curl -sfL https://rancher-mirror.rancher.cn/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn K3S_URL=\"https://$MASTER_IP:6443\" K3S_TOKEN=\"$K3S_TOKEN\" sh -"
done
```

这个过程会自动完成，稍等片刻即可。

### 第三步：验证集群

所有节点都已配置完毕。让我们回到 Master 节点来验证整个集群的状态。

```bash
# 在你自己的电脑终端上执行，直接在 master 节点上运行 kubectl
multipass exec k3s-master -- sudo kubectl get nodes -o wide
```

如果一切顺利，你将看到如下输出，包含一个 Master 节点和两个 Worker 节点，并且它们的状态都为 `Ready`​：

```
NAME          STATUS   ROLES                  AGE   VERSION        INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION      CONTAINER-RUNTIME
k3s-master    Ready    control-plane,master   10m   v1.28.x+k3s1   192.168.64.2   <none>        Ubuntu 22.04.3 LTS   5.15.0-88-generic   containerd://1.7.x
k3s-worker1   Ready    <none>                 2m    v1.28.x+k3s1   192.168.64.3   <none>        Ubuntu 22.04.3 LTS   5.15.0-88-generic   containerd://1.7.x
k3s-worker2   Ready    <none>                 2m    v1.28.x+k3s1   192.168.64.4   <none>        Ubuntu 22.04.3 LTS   5.15.0-88-generic   containerd://1.7.x
```

‍
