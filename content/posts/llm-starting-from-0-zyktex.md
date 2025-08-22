---
title: 从0开始的LLM
slug: llm-starting-from-0-zyktex
url: /post/llm-starting-from-0-zyktex.html
date: '2025-08-21 21:11:40+08:00'
lastmod: '2025-08-21 21:12:43+08:00'
categories:
  - LLM
toc: true
isCJKLanguage: true
---



# 从0开始的LLM

# **从函数到神经网络**

事实上函数就是一种变换，对数据进行变换得到我们所需要的结果。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NzIxNzIwZTZlOWI0MThmMzRhNmM4NTQwYWZhM2Y5MTJfVjFibEpsNFVWMFIyYkpxeWZ2eGx4Vmh0T05XOXpJbENfVG9rZW46SDU2a2JvREZWb0xLV0R4MDZkaGNFWHZhbnpkXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

### 符号主义和联结主义

早期的人工智能-\>**符号主义**，即用精确的函数来表示一切。但是很多时候，我们没办法找到一个精确的函数来描述某个关系，退而求其次选择一个近似解也不错，也就是说函数没必要精确的通过每一个点，它只需要最接近结果就好了，这就是**联结主义**。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZDBmYTY4ZWZlMDVkNGU4MmYyNDEyNzVkOTc0OWU4MDJfUGlPQXRkTWlWRmk3NDgyM3VGUUVPYTlMOVBmbGJTUVVfVG9rZW46R0lmTGJKUHBrbzJoVzB4aGZNYmMyc3A5bjljXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

### 激活函数

但是当数据稍微变化一下，出现曲线的时候，简单的线性函数就没办法解决这个问题了。那我们的目标就是将线性函数转为非线性函数，这可以通过套一个非线性函数来做到，比如平方、正弦函数、指数函数。这就是**激活函数。**

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MDc4MzllZDRhN2NjYmM2YzJkMjUyZDM0MjM4ODIzYjVfWjNVRm1iazc0clB3QXFOU0Y2STAyd1padjZQRlhpeXJfVG9rZW46WUdidGJydWxzb2dNRWh4VXpvTGNVWHN5bmhnXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

常用的激活函数如ReLU其实并不复杂，但是就能起到很好的效果。

这还不够，正常情况下我们不会只有一个输入x，再者只有一个激活函数可能不会达到理想的结果，所以可以无限套娃（不止是两层）

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZjNhYThkZGZmYTNlNDNmMzkxNzhmYmNjNDNkZDU1NDBfTG94ME5ZakkwYm5LcUFUVURaMjlkdFkzb1JOeGhDSmNfVG9rZW46QllYQmJTT2pYb1NxNjd4YU4yd2NNNUJpblJoXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

通过将多个输入进行整合，我们在激活函数外部引入一层线性变换，再施加激活函数，并可将这一结构逐层嵌套。

采用这种方式，能够逐步构建出高度复杂的非线性关系，理论上具备逼近任意连续函数的能力。

### 神经网络

当网络层数过多时，结构会显得过于复杂。为了更好地描述这一系统，我们引入“神经元”的概念：图中的每一个小圆圈代表一个神经元。多个神经元相互连接形成的网状结构，称为**神经网络**。

通常，我们将最左侧接收原始输入

$$
\mathbf{x}
$$

 的部分称为**输入层**，将最右侧产生最终输出

$$
y
$$

 的部分称为**输出层**。而在两者之间、由多层神经元构成的中间层次，则被称为**隐藏层**（Hidden Layer），隐藏层的主要作用是对输入数据进行复杂的特征提取和变换。![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MDAwNGRkMmQ4NmI3ZGRiMzgxYTlkOTY5YzZhZWYzMGFfOXZEZzg3QURtSTlPeXJlUk5yQkw2QWlyUGM2a1pBS2tfVG9rZW46Sk04R2JFMWVkbzdSU0J4YVlWb2NWY1ZwbmxiXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

随着函数的不断嵌套，神经网络在深度上逐步扩展，原本作为输出的部分演变为中间的隐藏层。隐藏层的核心功能是对输入数据进行多层次的非线性变换与特征提取，逐步挖掘数据中深层次的内在规律，为最终的输出提供有力支撑。

从结构上看，就像是一个信号从左向右传播的过程，这一过程被称为**前向传播**（Forward Propagation）。通过堆叠多个隐藏层以及调整每层中神经元的数量，神经网络能够构建出高度复杂的非线性映射关系。

尽管整个结构看似复杂，但我们最终的目标依然明确而简单：寻找一组参数的近似解——即根据已知的**输入** ***x*** **和输出 y，反推出所有连接权重** ***w*** **和偏置** ***b***，使得网络能够尽可能准确地拟合数据背后的潜在函数。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YmVjNDgxMzQ5ODZhYWRhMzNmMTgyODRjMWEzNGQyZjRfa29NSFZqOVhaRFFjOXhkQVE5aGFzUFUxZDNMejgxS2RfVG9rZW46RzVFSGJwUkxqb3V1RDd4QThZYmN5RUVTbmliXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

# **如何计算神经网络的参数**

从前文我们可以得知，其实我们的核心本质还是根据已知的**输入** ***x*** **和输出 y，反推出所有连接权重** ***w*** **和偏置** ***b***

**那什么样的w和b是好的呢**？我们需要的w和b是够让函数的输出尽可能拟合真实数据**真实数据**那一组参数。

对于以下图片，我们直觉上看出显然第一个拟合的更好。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=OTQ2ODU5YjFhZGY5MDU5Yzk3YTVmYWJmMzk5ZDcwOTFfaFhBNkNGMWhIR3VQdnBYNXhvS3Z1NzU0dHlxOGd3UmRfVG9rZW46V0c3MGJDNnJRb2FiaTB4RXhEYWNUWnJhbjFkXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

那如何用数学语言去描述拟合的好呢？

我们使用真实值

$$
y
$$

 与模型预测值 \$\$ \\hat{y}\$\$ 之间的误差来衡量单个样本的预测精度，其表达式为：\$\$|y - \\hat{y}|\$\$为了评估模型在整个数据集上的整体拟合效果，我们将所有样本的误差（即这些“距离”）相加，得到预测值与真实值之间的总偏差。这类用于衡量模型预测误差的函数，称为**损失函数**（Loss Function）——它量化了模型预测结果与真实数据之间的不一致性。

在实际应用中，为了便于数学处理（如求导），我们通常对误差进行平方处理，并去除绝对值，同时对所有样本取平均，从而得到一种广泛使用的损失函数：**均方误差**（Mean Squared Error, MSE）：

$$
L = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2
$$

从模型参数的角度来看，预测值

$$
\hat{y}
$$

 是由输入x 、权重 \$\$ w\$\$ 和偏置 \$\$ b\$\$ 决定的，因此损失函数 \$\$ L\$\$ 本质上是关于参数 \$\$ w\$\$ 和 \$\$ b\$\$ 的函数：\$\$L \= L(w, b)\$\$我们的目标就是**通过调整参数**

$$
w
$$

 **和 b ，使损失函数** \$\$ L\$\$ **尽可能小，从而让模型的预测结果尽可能接近真实值**。怎么能让函数值最小呢？

### 如何让损失函数最小？——梯度下降原理

根据微积分的基本原理，函数的最值通常出现在\*\*极值点\*\*或\*\*边界点\*\*。而极值点的一个关键特征是：\*\*导数为零\*\*。

#### 1. 简单情况：解析求解（适用于线性回归）

当参数较少时（例如在线性回归中只有

$$
w
$$

 和 \$ b \$），我们可以尝试通过令偏导数为零来求解最优参数：

$$
\frac{\partial L}{\partial w} = 0, \quad \frac{\partial L}{\partial b} = 0
$$

解这个方程组，就能得到使损失函数最小的参数值。

这种方法对应的是经典的\*\*线性回归\*\*（Linear Regression）——通过寻找一条最优直线来拟合输入

$$
x
$$

 与输出 \$\$ y\$\$ 的关系。但这种方法只适用于结构简单、可解析求导的模型。

#### 2. 复杂情况：梯度下降法（适用于神经网络）

神经网络通常是高度非线性的复杂函数，其损失函数维度高、结构复杂，无法直接求解导数为零的方程。此时，我们采用一种迭代优化方法：\*\*梯度下降法\*\*（Gradient Descent）。

我们不需要一步到位地找到最小值，而是从某个初始参数出发，\*\*一步步调整

$$
w
$$

 **和** \*\*\$ b \$\*\*，使得损失函数 \$\$ L\$\$ 逐步减小，最终逼近最小值。具体策略是：

- 调整参数 \$ w \$，观察损失函数

  $$
  L
  $$

  的变化；
- 如果增大

  $$
  w
  $$

  导致

  $$
  L
  $$

  增大，说明我们应\*\*减小\*\* \$ w \$；
- 反之，若

  $$
  L
  $$

  减小，则当前方向正确。

而损失函数L随着参数w变化而变化的程度的数学表达，就是\*\*偏导数\*\*，

- 如果

  $$
  \frac{\partial L}{\partial w} > 0
  $$

  ：说明

  $$
  w
  $$

  增大时，\$ L \$ 会增大 → 想要减小 \$ L \$，就应该\*\*减小 \*\*\$ w \$\*\*。
- 如果

  $$
  \frac{\partial L}{\partial w} < 0
  $$

  ：说明

  $$
  w
  $$

  增大时，\$ L \$ 会减小 → 应该\*\*增大 \*\*\$ w \$\*\*。

所以，\*\*让

$$
w
$$

 **向** \$\$ -\\frac{\\partial L}{\\partial w}\$\$ 的方向变化\*\*，就能使 \$\$ L\$\$ 减小,我们要做的就是让w和b不断的往偏导数的反方向去变化。 具体变化的快慢，我们再增加一个系数（**学习率**）来控制。![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NDM1NmUwZjE1YmE2NWVjNDQ0YzgzZmM3N2MyODA1MDFfUXpnb29ibFlYUlNzU2phaXdQbjVqSlpoMDA0NlhZRlNfVG9rZW46UDI2RWI0WUROb1RlSnJ4aVg3U2NPWTdUbkhiXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

所有参数的偏导数组成的向量，称为\*\*梯度\*\*（Gradient），记作：

$$
\nabla L = \left( \frac{\partial L}{\partial w}, \frac{\partial L}{\partial b}, \dots \right)
$$

### 梯度下降的流程

1. **初始化**：随机设置参数

    $$
    w, b
    $$

- **前向传播**：计算当前预测值

  $$
  \hat{y}
  $$

  和损失

  $$
  L
  $$
- **反向传播**：计算梯度

  $$
  \nabla L
  $$
- **参数更新**：沿梯度反方向调整参数
- **重复**：直到损失收敛或达到最大迭代次数  
  不断变化w和b使得损失函数不断减小，进而求出最后的w和b，这个过程就叫做**梯度下降**。

### 求解偏导数

公示很好理解，偏导数怎么求就成了目前最大的难题？

如果是简单的一元二次函数，求偏导数当然非常简单，但我们都知道，神经网络整体所代表的函数非常复杂，直接求偏导几乎不可能。

虽然函数很复杂，但是层与层之间的关系还是很简单的

用一个简单的例子来说明。要求L对w1的偏导，只需要用链式法则分别求图中的三个偏导，再相乘就好了。而由于我们可以从右向左计算这些偏导数，然后调整每一层的参数，计算前一层的时候用到的偏导数的值，后面也会用到（更左边的层），所以可以让这些值从右向左传播，这个过程就叫做**反向传播**。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NzAzYWZlYjQ4ZmFkN2RkYzMxNjg1ZTdlNjdjZGZiZGVfb2gxanJHZ1hNcWdQakN0TThIdVNKdnA2UzF4WElaMVFfVG9rZW46UlEyTmJ0ck44b1o2WVh4dDhkUGM5dWJPbk9nXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

小结：我们通过**前向传播**根据输入x计算输出**y**，再根据**反向传播**计算**损失函数** 关于每个参数的梯度，每个参数都向梯度的反方向变化一点，这个就是神经网络的一次训练。经过多轮训练使得损失函数足够小，就得到了我们想要的函数。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NzM1ODdkMThkYTIyNTExMzRkODM3YWIxYTE5NGZmYmNfNmpVcVhvcGM2QnpIdUdrWEh5aE54MTJnVEFtMnNxQUNfVG9rZW46R2FITGJIUktOb2hmY1h4Uk5OWmNsN1pmbmhkXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

# 调教神经网络咋这么难？

上文提到，我们的目标是让 ****损失函数尽可能小**** ，从而使模型的预测函数尽可能接近真实的数据规律。听起来似乎“损失越小越好”？但事实并非如此。

### 过拟合

看下图可知，从训练数据的角度来看，右边的函数拟合效果更优；但在对新数据进行预测时，其表现可能反而不如左边的模型准确。

这种在训练数据上表现的很完美，在新数据表现的很糟糕的现象就叫做 **过拟合**（Overfitting），模型把训练数据学得太好了，好到连数据中的**噪声**、**异常值**甚至**随机波动**都一并记了下来。在没见过的数据上表现的能力，我们称为**泛化能力**。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MDI3MGI5Y2Q3ZDI0ODViOTRlM2EwOTUzODNmODM0NzRfRW5NdjZ6Z080Sm0ya0RRZGxENzNmUXVuRTdMTEx3MHFfVG9rZW46Q0RiT2Jwc3JkbzBPbGt4SHFZYmNLbVo3blNkXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

那我们该怎么解决过拟合呢？很简单，模型太复杂了，这个函数其实只是一个简单的线性函数，选一个简单一点的模型就好了，这就告诉我们，模型也不是越大越好。

与此相对，也可以通过增加训练数据的量来解决这个问题。数据越充足，模型越不容易过拟合。

有一些情况下，我们没有办法直接收集更多数据，可以用原来的数据创造更多的数据（图像旋转、镜像、滤镜、裁剪），这就叫做**数据增强**，这就能让模型不会因为输入的一点波动而产生很大的结果差异。

训练过程本质上是**模型参数不断调整**的过程。如果能限制参数的过度变化，避免其走向过于复杂或极端的值，就有助于提升模型的泛化能力。

一个直观的思路是：如果发现模型在训练集上持续变好，但在验证集上的性能开始下降（即可能开始过拟合），我们就提前停止训练。这种方法被称为**早停法（Early Stopping**）。

通过这种方式，我们可以在模型尚未“学过头”之前及时叫停，从而有效缓解过拟合问题，提升其对新数据的适应能力。

但显然，这方法还是太粗糙了，有没有更精细的方法呢？

我们只需在原始损失函数的基础上，加入对**参数本身大小**的惩罚项。这样，当参数调整使得损失函数下降的幅度，还不及参数增大所带来的惩罚增幅时，新的总损失函数反而会上升。这意味着该次调整并不合适。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MWU4ODcxMGUyZDNiNWVkY2I1YTk3NmRhYjlkMmFiZjhfN0laOWZOZ1JiMVU0V1pwNFY5V1FlbUxMVkdyUTNnMHJfVG9rZW46SzB3UmJFN0VQb0F2QXp4ZEZUYWNjN2ZxbkdnXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

常见的做法是惩罚参数的**绝对值之和**（称为 **L1 正则化**），或者惩罚其**平方和**（称为 **L2 正则化**）。其中，平方和在参数较大时带来的惩罚更重，因此对抑制大参数的效果更强。这种通过添加惩罚项来控制模型复杂度的方法，统称为正则化。而惩罚力度的强弱，则由一个额外引入的参数——**正则化系数**——来控制。

类似地，之前我们在梯度下降中引入的**学习率**，也是一个不通过训练更新、而是人为设定来调控训练过程的参数。这类用于控制学习过程的参数，统称为**超参数**。正则化系数就是典型的超参数之一，它不参与模型的拟合过程，却深刻影响着模型的泛化能力。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=OWQ5ZjZhY2ZmZWM3YzYxZGQwOWUyOGI4NzUyODc0OTNfcnBpaFdMbXFGa1pGUU9BYjA3bHE2MTBhMDRCVGJpazhfVG9rZW46SEFzSWJNS01Ib08zdTd4Z2lxU2NiYlZDblhkXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

除了上述方法，还有一个简单到令人发指的方式，为了防止让模型**过于依赖**某几个参数，我们在每次训练时都**随机丢弃掉**一部分参数，这种方法叫**dropout**(丢弃）。

现在我们了解了如何避免过拟合，那我们是否能训练出一个非常好的神经网络了呢？不，还有很多问题：

| 问题         | 描述                                                                 | 解决方案                                                                 | |--------------|----------------------------------------------------------------------|--------------------------------------------------------------------------| | 梯度消失     | 神经网络越深，梯度反向传播时越来越小，参数更新困难                     | 用残差网络来防止深层网络的梯度衰减                                       | | 梯度爆炸     | 梯度数值越来越大，参数的调整幅度失去控制                               | 用梯度裁剪来防止梯度的更新过大\<br\>用合理的权重初始化和输入数据归一化来让梯度分布更加平滑 | | 收敛速度慢   | 可能陷入局部最优或来回震荡                                             | 用动量法、RMSProp、Adam等自适应优化器来加速收敛，减少震荡               | | 计算开销大   | 数据规模太大，完整的前向传播和反向传播都耗时巨大

对此，我们当然也有很多办法，这里简单提一下，留待补充。

# 神经网络中永远也搞不明白的矩阵和CNN

### **矩阵表示和CNN**

现在回到开始，假设我们有一个这样的神经网络，虽然参数不多，但是看起来已经很麻烦了，这时候可以考虑用矩阵来简化一下。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YTEzNTA0YWZjYmIxZjBjNjZjNzRhYjIzNzc0YmZjNWRfRTZDWjRiVnlUdXRvWkJ4S2ZleE9BWE9QRTV3aGZnaE9fVG9rZW46TWdCeWJmM1FKbzk2ZzV4WldWeWNOOG5lbk1lXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

这样原本复杂的式子就可以表示为Y \= g(WX+b)

与此同时，当神经网络的层数越来越多的时候，也需要用合适的方法来表示。我们把输入层用a[0]表示，中间的层就用a[1]、a[2]来表示，以此类推。

第一层、第二层和通式如下所示。这样不仅我们看起来更简单、更抽象了，更有利于研究更深的问题了。同时，矩阵运算相比之前的式子，可以更好的利用GPU的并行运算特性，能加速神经网络的训练和推理过程。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTJkNTVjNDUwOTUzMWE2NzBhYWJhZDFjMmQ5MTI0ODVfWFZnVnhXUVNpRmtDcHpQMWZ6QXNIZVBRcGhWMnNZc1NfVG9rZW46WVpPSGJsM1M5b2pWS294UXAwc2NaZ1hNbmpkXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

我们再来看之前的神经网络，可以发现每一个节点都和前一层的所有节点相连接，这个并非神经网络所必需的，而这种连接方式叫做**全连接**。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZGQ4MTcyMTZhZjE1MTBjM2UyMGE4NDdkMGFjODEwNDNfVm1DQVRsa0ZiamtPZTZ2b00ydXFZNkJXVW83dnhWanJfVG9rZW46VGZtSmJBcVFXb2wycGR4dHpKU2NoaEc5bkp1XzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

全连接层有一个显而易见的缺点，对于下面的这个例子，输入30\*30的灰度图像，第一层的神经元数量是900，下一层神经元的数量是1000，在一个全连接层之后就需要90万个参数，这太庞大啦。

并且这还只是把图像平铺开，不包含每个像素之间的位置关系，如果图片稍稍平移或改变一些局部信息，但所有的神经元都会和之前不一样，这就是不能很好的理解图像的局部模式。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NzAyNDIyZjI0MTI4MDU2M2JhNmUxODIxNTJlNWM4YzdfdVBBQ21aTUNqaWh5bHNVRUdEalA4b1oydHczNHJjaTFfVG9rZW46QXBLVGIyZWEzb3JOOWJ4a2lnV2NhYkZXbjJnXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

那怎么办？让我们随便在图像中取一个3×3的块，将他的灰度值与另一个固定的矩阵做运算（对应位置相乘，最后求和），遍历整张图片的所有位置，得出的数值形成一个新的图像，这种方式就叫做**卷积运算**。刚刚给出的矩阵就叫做**卷积核**。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YjQ4ZmJiMTdhMDIxMmEwM2YwMDNhN2MyOTIyNWJhNTZfQ0ExOEJwMXE3cnhNaFdTUTc5TlFudVBDMzFsRTdKcWlfVG9rZW46RmlHcmJPRmRCbzBJRHR4bnI3TWM5VWRXbnRiXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NmY0MjFkNTk4MDk5MjY1MzQ1NWEyODM4YTVhNzhmNjBfTnYxbG1IekNKNmswWjRPWDlUbHVhdVZveThKaHZmNFJfVG9rZW46UkVTSGJXd2xIb2FScmZ4YmhwdGNNWjZ2bmhNXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

卷积核不是一个新的概念，它早就被应用于传统图像处理领域，不同的卷积核可以达到不同的处理效果（轮廓、锐化、模糊）。

但区别在于，图像处理中的卷积核是已知的，神经网络中我们用到的卷积核是**未知**的，它同样由参数构成，是被训练出来的一组值。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MDJlYzAxZTZmMjU4MGM3ZDhjMTNhZTZlMTNkODAzMjdfTG05NVU2SzNtUUZOaE5SQ2FWWFlqYnh1cWdJSnhkUUdfVG9rZW46Q2xUdmJ3dDZibzkxR0R4ZDFjRmNlaUlubk9iXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

回到经典的神经网络结构，其实就是把一个**全连接层**替换为了**卷积层**，不仅能减少参数的数量，还能更有效的捕捉到图像中的**局部信息**。从公式上看，也就是把原来的矩阵标准乘法（叉乘）替换为了卷积运算。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NTdmNWMxMWQ0ZWIyOTljYzRlZWZjODNhZGEyZDM3NDNfSGRVTVpQVk9PSFBvUk9RQkxYQjQ2VjZGeWRJTUQ3bUhfVG9rZW46UnRFaWJMYnlab0JpNlF4emF1bmNwWWRVbjRmXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

这样我们的神经网络示意图就能简化为新的形式，从很多个小圈，变成一层一层。

在图像识别的卷积网络中，通常还会多出一层**池化层**，池化层的作用是**降低维度的同时保留主要特征**，减少计算量。图中的卷积层、池化层、全连接层都可以有多个，而这种适用于图像识别领域的神经网络结构就叫做**卷积神经网络（Convolutional Neural Network，CNN**）。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZmQ5NmVmNmU4MDI1MDY2YWQ2YTUyNDRkNjViNzk4NDFfdTNmaXRVTXJoSkZNVnAwQ3pLQTg1Ykk1b1NSZ0V1TDJfVG9rZW46RXgyR2I5VVFpb3RJenB4WnFBOWNkT2VhbmJkXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

卷积神经网络的训练过程很容易可视化，我们可以观测每一轮从原始图像中提取了什么样的特征，虽然这些都是中间隐藏层的事情，但是却能神奇的观察出一些实际意义。

卷积神经网络依旧有它的局限性，一般来讲它只适用于处理静态数据，对于时间序列、文本、视频、音频等动态数据，就需要其他的神经网络结构了。

# 语言居然可以被计算出来？从 RNN 到 Transformer

给你一句话，让你判断某个词的褒贬，如果用一个函数来实现这个功能，该怎么做呢？

先别急，先让我们考虑如何把这些文字作为参数输入，变成计算机能够识别的数字，这个过程就叫做**编码**。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZjZmZDc4MWNmNjAxZGMxNjA0MDkzYzUyZDJmMGNjZmNfc2tRdUwwZkkwY1NER25WT2F6NDI4NzFPUE1xMkpKWG5fVG9rZW46S0pHd2JHdUpvb2ZRZjR4R0kzSmNRaUNLblc4XzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

具体的编码方式有很多种：

一种简单粗暴的方法：每一个文字或词组都用一个数字来代表，建一个非常大的映射关系表

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YmJmMTNjNDczMWNhNWU4MGUxNDhkNmFlZDE5ZTg0ZjhfM21aMW00RW1Ud2pCMXdRS29Zd3ZWcDUzRHAwTEtoNzFfVG9rZW46VWhJNGJSVjJvbzY1b254a2NGYWMySkxRbjVnXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

这样有几个显而易见的缺点，第一，只用一个数字表示，不仅要建的表很大，**维度也很低**（只有一维），第二，数字和数字之间无法表示字与字、词与词之间的联系，对语言理解没有任何意义。

为了解决维度低的问题，有人提出了**one-hot编码**，即准备一个维度非常高的向量，每个字只有向量中一个位置是1，其余全是0。虽然维度低的问题被解决了，但是维度好像又太高了，非常稀疏，向量之间都是正交的，词和词之间仍然无法找到相关性。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=Yzg0YTg5ODhkMWQ0YjZjZTZlZTc1OTViY2VkOTZiMWRfQWxxczkwNm1XV0ZHdGpwZkVCQUZ0RVFtTERyNjVxZURfVG9rZW46S0YwOWJ2ZHpub0hxRjV4eXl6d2NkVHU5bkZoXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

那有没有能解决以上两种问题的方法呢？有的，这种方法就是**词嵌入。**

通过词嵌入的方式得到的词向量，维度不高不低，每个位置可以理解为一个特征值，但这个特征是通过**训练**得到的，我们并不知道代表着什么。那这种方式如何表示词与词之间的语义相关性呢？可以用两个向量的**点积**或**余弦相似度**来表示向量之间的相关性，进而表示词语之间的相关性。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NjM4Y2ZmMGQ0YWRhMmVmYTIzNWQ0ZjJjYzdkZjJmZmNfVnZSU0tFM0xsb1d1M1JyTEI1QjJkSlF4REdZd0RjYzhfVG9rZW46VkI5OWJYQ2lNb0NudWN4dmRHT2NId015bmRkXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

**这样就将自然语言之间的联系转为可以用数学公式计算的方式。** 同时，一些数学上的计算结果可能反映出一些很微妙的关系，例如一个训练好的词嵌入矩阵，很可能使得桌子-椅子 \= 鼠标 - 键盘。

把所有词向量组成一个大矩阵，这个大矩阵就叫做**嵌入矩阵**，每一列表示一个**词向量**。矩阵中的值由训练得到，比较经典的方法是**word2vec**，不展开讲解（挖坑）。

虽然这样表示的维度比起one-hot已经大大下降，但是也超过了人能直接理解的二维、三维，我们管这些向量所在的空间叫做**潜空间。** 我们无法理解潜空间中的位置关系，词和词的关系虽然可以用点积或者余弦向量的形式显示出来，但我们需要一些方法能够把潜空间降维至2-3维，方便我们直观看到词与词之间的关系。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZThjZDlhNWZmMDc4N2M1ZDkzNjk1ZDFkOGY1NTBjY2VfM0V6S25GWElrWVFoNGwyelpmd2lXVW9tZlRWaGdLSGpfVG9rZW46VzJxMmIwdHBob3l6WTd4MUEwOGM1cHFEbmRkXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=OWNkNDNiZDA0YTdkNGI1YWQyNGEyOTc3ZjQ0MjMwMjJfeWVMclZTT0VvVDJWUGFaVWZHWFRFalVwNFdacXJTQWFfVG9rZW46QXdhMmI4YWRCb202QWN4OTNBZGNiSkhLblBmXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

这样我们可以用词嵌入的方法将文本转为数据，放入输入端的神经元中了。

但这样就可以了吗？举个例子，下图中左边的五个词转为5个词向量，每个词向量假设为300维度，那么输入层就要有1500个神经元，这样当然是可行的，但是有两个新问题：

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=OGYwNGE2MmJmNWU0YzBlZWI1MzE5ZjI2MDM5Mzc5YzlfUzNyUlNQVjZEWkN0RTF3aEcxdGVBYzhaNWhmMWhYY0ZfVG9rZW46T1BzOGJXak04bzNpMzl4RXg3dmNVYk9VbmdlXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

1. 输入层太大了，并且长度不固定，是**变长**的；
2. 无法体现词语的**先后顺序**，仅仅是把它平铺展开形成了一个非常大的向量。

这就像之前图像识别的时候，我们把一张图片所有的像素点展开成一个大向量，一股脑送入输入层一样，既增加了神经元的个数，有无法体现词之间的关联。在CNN中，我们可以通过卷积的方式来提取图像特征，那nlp领域中，我们可以通过什么办法，既能解决词语之间的先后顺序问题，又能降低输入层的参数量呢？

回到经典的神经网络，但是不是一次输入一句话，而是输入X是一个词，输出Y就是这个词是褒义还是贬义，当然这里的X、W都是矩阵，之后不再展开。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NTM1MTFlYjM2MDRlZmMyNmM3MDU1MTRhNmNiZmQzZDhfZVpzcklXN29qME42dkpGeUVGWnpTS2NXMHdBcGdFV2tfVG9rZW46V09EZWJaczJSbzJ4U2J4Ynp1eGNjb0Vjbm9iXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

第二个词来的时候我们用同样的函数得到结果，我们用尖括号表示是第几个词，这样就能得到顺序关系。可以发现在第二个词的计算过程中，完全没有让第一个词的任何信息参与进来，怎么办呢？

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MDg3OTI2MmM0NGU3MzFiNjRmNjlkMzdmOGIzYmUzYmVfMHhzcGtINERic1hRUEFRV1NNTzNFUk5uZ3hadndaeG5fVG9rZW46WkF2MmI2REhHb24zRjN4bGJ0cGNoRlg4bkVkXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

我们可以让第一个词计算之后，**先别输出结果Y，输出一个隐藏状态H1，然后再经过一次非线性变换**，**得到输出Y1**。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YWI4NDExYzY5YzE5ZTc1NThjOTJlNmQ2MTEwYTc3Yjlfd2NyaU1sazVYblVRS3pTbDhWcjM5a0FwZG9rSUEySEZfVG9rZW46TVRKdGJvN2Rkb1VjZjB4akRuNmNheEgzblZkXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

接下来，这个第一个词得到的隐藏层H1和第二个词的输入X2一起参与运算，先得到H2，再**然后再经过一次非线性变换**，**得到输出Y2，以此类推。** 这样前面一个词的信息就能不断的往下传递，直到传到最后一句话的最后一个词中，就能把所有词的信息都囊括起来了。

当然这里的W值并不是一样的，有专门针对词向量的Wxh矩阵，有专门针对隐藏状态的Whh矩阵，以及最终计算出结果的Why矩阵，当然，偏置项b也是如此。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NmJkYjRkNjZhOTI4NTg3NjFlZmU1MjBhMzAyODk1OTdfVDgxMVlET2NQNElMVjN3dzZoVkwxYmRBd2hvYWtvUXpfVG9rZW46SWZlUmJ3SHNrb3lFYlp4TXk3RWNDR3lsbmhjXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

把这个图简化一下，就能得到**循环神经网络RNN。** 这个RNN模型就具备了理解词与词之间先后顺序的能力，可以判断一句话中各个单词的褒贬词性，还能给出一句话，不断生成下一个字，以及完成翻译等自然语言处理工作。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MDBlMDNkY2FkNDE5OTM0OGZiNTM5OGEyODI0ZjBhMGZfOUFtaUdLV1YxRmYweGZBaUt1M01kYUV4cXJCV2s0dE5fVG9rZW46SlJNemI5QXJVb0JxWlZ4V25WTmNmQ2dabnVmXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

可以从矩阵和公式的角度来看这个计算过程，从公式来看，和传统的神经网络相比，RNN只是多了一个前一时刻的隐藏状态而已。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZjRkOTEzZjZhNzk3ZmM5NGFmODQ3Y2VkNGIxODI5ZjVfU1c5OUR4b250dHpPek5RMWlnbnlyc2RmaUUybzJTemFfVG9rZW46QUZLbmJCa08yb3o4eU54MWc2R2NTTnVXbkZkXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ODdkNTIwMWFhYjVkMDEzZDZmNWNkMmExMjk0NTA4NzJfaXo5cElOWnIzNlliQWNyUHRHbFNpaXhDN21nRjhoTE1fVG9rZW46UTU3WGIySEhsb3kyaHN4eXpCa2N3MzY5bjgxXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

那么RNN是否就完美了呢？当然不，RNN依旧存在两个问题：

1、信息会随着时间步的增多而逐渐丢失，**无法捕捉长期依赖**，而有的语句的关键信息恰好在很远的地方

2、RNN必须**顺序处理**，每个时间步必须依赖上一个时间步的隐藏状态的计算结果

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NDY0N2U3YzNlMmYxYTE4ZWUxOWEwZmUxMzlmY2QyMjVfS2dCMGdYa1BIOE5qRDVaQ0J6SWdFSVk2aEIyNkc4bzFfVG9rZW46VVAydWJXMlBsb3FzR214ZW1TOGNkNW1lblBaXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

虽然有一些方法在改进以上两点问题，但是还不够好（已过气），那么是否有一个可以彻底抛弃按顺序计算的新方案呢？

那就是Transformer！

# Transformer 其实是个简单到令人困惑的模型

用神经网络进行文字翻译，先用词嵌入的方式，把每个词都转换成词向量，假设每个词向量纬度就是6。

如果直接丢到一个全连接神经网络中，那每个词都没有上下文信息，并且长度只能一一对应，显然不行。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=N2E4MGY0NWQ0MGYzOGI4NzI1ZWNkNjRhNTFjM2MyNTFfY0JVT0FucjNxMUZOa3JuTDAxQkRCVkJZalRYZ0Z6bzZfVG9rZW46RUUxd2JkR256b05Yc3F4V2NqVWNDYXhvblFlXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

如果用循环神经网络RNN，又面临串形计算，而且如果句子太长，也会导致长期依赖困难的问题，也不ok。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=Y2Y5NzY4ZWZjZTkwM2M4OTQwMjkzYmI0N2JkZDljM2ZfbERVbktmZm9vdEVZS1p2VkFYdmswZk9DRzR1aDNVZjFfVG9rZW46Q2NxZGJLT0lIb1BmQ2h4TU1yb2NlR2xLblBoXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

前面说的方法都不太行，那到底什么方法可行呢？

### 单头注意力（Single-Head Attention）

首先，为了让输入包含每个词之间的位置信息（前后顺序等），给每个词一个**位置编码**，表示这个词在整个句子中出现的位置。把这个位置编码加到原来的词向量中，现在这个词就有了**位置信息**。

但是现在每个词中没有其他词的上下文信息，注意不到其他词的存在。我们用Wq矩阵和第一个词向量相乘得到维度不变的向量q1，用Wk矩阵和第一个词向量相乘得到k1，用Wv矩阵和第一个词向量相乘得到v1，这里的Wq、Wk、Wv矩阵都是可以通过训练得到的权重值。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=OGVlNzgxYzkxMGNlM2UyNTU4YTEyMGJjNjdiMWY0ZTRfS0h2ejFjdUdYdkFZT216U3U0Y1JZRXJhbThEU0hoQkJfVG9rZW46Sk9mOWJaRW1Pb1JZNlp4ZG9tNWMwSkFibm5rXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZGFkNTllMTdjNmI3NTZmODU1OWM5NGEyYTI2MDI2ODNfWE9WNnVjemNQWjdYZEdXT2x2N1d3NElNNHM2eHFPNlJfVG9rZW46V3VMcWJpWG9hb1V6d0p4YWpVamNJNDBEbnNjXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MzI0OWMzNDIzYWYyNDMwZDgyYmUwN2UwYzZmOWI4MzZfc2xtR2M5ZVZUTkpwS3ZXN2o4VVo0Smh3b0lNek12RDVfVG9rZW46SkJ1N2I1aG5ob2NmYzN4ZFA5VWNEMk50bnZlXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

接着对其他词向量也和相同的WQKV矩阵相乘，分别得到自己对应的向量。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=M2ZiZGE1NTg2YjQ3YmE0OThiMzYxZjM3ODA2MTdkMjBfUE10N1VnTW5kc3hFcjgybzJ5U1N5R2tKZ0R6TjhJUmZfVG9rZW46TmVkZGJpWURLb0NiWTV4TWdMUWNHNkZXbnlmXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=M2NhYTIzNDY3YTZiNjVhNTFjYWJlZDVmZTNhNzg4MTVfSHNsb0pVUUQxY0dZQWZsUHl3QW5yUXBlejdBOEpMNEZfVG9rZW46V1hrMWJZekw4b25KbUl4bWMxQ2NiTWRxbmplXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

当然，实际GPU运算时，是通过拼接而成的矩阵做乘法，不是一步一步分开计算的，得到的直接就是所有词向量的qkv，就是三个大矩阵（Q、K、V）。

不过为了方便理解，还是拆成一个个的词向量来看。

现在我们的词向量已经通过线性变换映射为了QKV，

让q1和k2做点积得到a12，这代表在第一个词的视角里第一个词和第二个词的**相似度**，同理，和k3做点积得到a13，代表第二个词的视角里第一个词和第三个词的**相似度**，以此类推。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NjZmMzk5MDlkMGU2OWE1MTk0ZTczNThkMTUyMWFkZTFfMEdVNGl1aVlFRUM2VGlscmZlZkZLSjF1c1ZnVmNTSEVfVG9rZW46SnpuaWJSb1Yxb2NrYUR4dUpqNGNVTWdmbkxlXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

拿到相似度系数 a11、a12、a13、a14 后，将它们分别与对应的词向量 v 相乘，再将结果相加，得到向量 a1。这个过程可以理解为：从第一个词的视角出发，根据其他词与它的相似度高低赋予相应的权重，加权融合所有词的词向量。最终得到的 a1 就是在第一个词的视角下，聚合了整个上下文信息的表示。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTBjNTljNDhkYTU3NjRjYzQxODdmNmQ4MzE0ZDExMWRfSzFza3VWZWY2eHVBZklhWDhsUVg3S1BmSjFHOWpYM1JfVG9rZW46V25kMmJ1QTJBb0l0T1h4OXhYamNvVFhRbmtjXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

同理，其他几个词也按照这种方式得到a2、a3、a4，这代表每个词都把其他词的词向量，按照和自己的相似度权重，加到了自己的词向量中。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MmNjNzU2ZmE3YTNmNDU1NDU3OTU4YmZkZjczODM4MDBfb2hEcWF2ekUwcjAyOVdkMXdWcDBUanVHQlJSc0p0UlJfVG9rZW46RzV0amJhZE1Ub0JzRkx4dWdBUGNmVUdLbkEzXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

通过上面的计算过程，我们把原来词向量变成了一组新的词向量，这组新的词向量中每一个都包含了位置信息和其他词上下文信息，这就是**注意力机制attention**做的事情。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MTBiMmRhMzMwMDgzYTBiYTIyOTM3NGEwZDYxYzE3NDZfY2tGaVp2eVFCUXJubklIamNXZ29tNFg3NFhFRVRpdmVfVG9rZW46R0hwZGJYQXBrb2lDa1N4ZkZ3NWN2a3psbmpjXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

总结一下，单头注意力机制就是从输入X通过权重矩阵得到QKV，然后先用Q和K相乘得到一个相似度系数矩阵，然后再和V相乘，最终得到包含上下文信息的词向量矩阵。（当然我们忽略掉了缩放、掩码和一层softmax处理

### 多头注意力（Multi-Head Attention）

但是两个词的关系并不是固定的，对于注意力机制来说，如果只通过一种方式计算一次相关性，灵活性就太低了。

所以我们可以增加权重矩阵Wq、Wk、Wv的数量，把之前得到的QKV通过两个权重矩阵计算得到两组新的QKV，给每个词两个学习机会，每组QKV称为一个头。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZDVlOTI5ZjYzMWE0NDM1OTU2MWI0Y2IzMTcwNDljMmVfZlhyd3NwWTM3ZlNYRXFVZkJDYlA5aUo3TXdHeVFwdlVfVG9rZW46U2hOMmJQTkR4b0lUSU94bXRxMWNMNURZbklnXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

再次通过之前的注意力计算方式，得到每个头对应的输出向量 a。然后将这些来自不同头的输出向量**拼接（concatenate）** 起来，就得到了一个融合了多个视角信息的综合表示。

在我们刚刚的例子中，使用了两个头，这种让模型从多个子空间并行学习不同特征的机制，就称为**多头注意力（Multi-Head Attention）。**

> 📝 补充说明：虽然有些教学视频或图示为了便于理解，会画成“先计算一次 QKV，再分到不同头进行第二次变换”，给人一种“两步走”的印象，但实际上——每个头的 Q、K、V 都是直接从原始输入通过各自独立的权重矩阵一步投影得到的，并没有真正的“中间 QKV”作为输入再做第二步。
>
> 但从数学上看，多次线性变换可以合并为一次矩阵运算，因此即使理解为“先统一映射，再拆分到各头”，只要最终的参数结构等价，结果是完全一致的。这也说明了为什么用一个大矩阵一次性计算所有头的 QKV，在功能上等价于多个小矩阵分别计算。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=YzA4YTZlMjEwZjllMzEwNzFhYjEwODQxNzBiM2I5NmFfZFd6RmlkTVRaTHd2dmllbUpMQzFxSWl4MUowVE9ZOXVfVG9rZW46UTVOVGJVWmRLb29IZzR4ZlR2M2NHM3JtbldiXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

以上就是Transformer架构最核心的东西啦，attention  is all you need！

让我们对照论文中的架构图来看看：

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZDE5M2QwZWJjMDMzY2Q0MzFhMjg4NmFlZWY1NjhiYTRfV2VGQmJSV0VzRjVnZDdTejJZOHVNODJZVTRiVlI1TVpfVG9rZW46UENtQmJ5Y2V1b1JVRm54Z3NJV2M4NnRsbkxIXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

首先第一步就是通过词嵌入的方式转换成词向量矩阵 **input Embedding**。

第二步加入位置信息 对应图上 **Postional Encoding**

第三步 经过多头注意力机制的处理，输入的矩阵维度和输入没有变化，给每个词向量增加了上下文信息，对应 **Muti-head attention**

第四步 添加了残差网络和归一化处理，是为了解决梯度消失，并且让分布更加稳定而做的优化，对应图上**Add&amp;Norm**

我们可以看到多头注意力机制在transformer架构里重复出现了很多次，可见其重要性。

看看transfomer里的多头注意力机制，首先QKV分别经过线性变换拆分成多组，相当于给了多次机会学习到不同的相似度关系，依次经过注意力机制运算后，把预算结果拼接起来，当然最后的多头结果并不是单纯拼接，还需要再次进行一次权重矩阵的乘法（也就是线性变化）。

现在看这两个公式，

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

所谓注意力机制运算就是QK矩阵相乘，经过缩放

$$
{\sqrt{d_k}
$$

，再经过softmax乘处理，最后和V相乘

$$
\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h)W^O
$$

$$
where\text{ head}_i = \text{Attention}(QW_i^Q, KW_i^K, VW_i^V)
$$

对于多头情况，就是先将q、k、v矩阵经过多个权重矩阵，拆分到多个头中。分别经过注意力机制的计算，最后合并起来，再经过一次

$$
W^
$$

矩阵运算得到输出。回过头看看transformer的图，左边的部分叫**编码器**，右边的部分叫做**解码器**

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=N2E5YzY3ZTVkOTVjMjQzMGViMjU1MTU4OTk5YjViYzBfa1BDUGZINXh3bGxWdUZsYTZ2UjlZTmhobjRCeHhZYTJfVG9rZW46R2YyT2JhVDNEb29HVmx4SlhHQmM0MTZvbkRoXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)

当我们要对一句话进行翻译时，我们训练这个时间网络的过程是：

1. 输入源文本：首先，将需要翻译的句子作为输入。
2. 词嵌入：通过词嵌入（Word Embedding）技术，将输入的文本序列转换为对应的向量表示。
3. 位置编码：由于模型本身不包含循环或卷积结构，无法感知序列顺序，因此需要加入位置编码（Positional Encoding），为向量注入词语在序列中的位置信息。
4. 编码器处理：

    1. 向量序列进入编码器（Encoder）。
    2. 经过多头自注意力机制（Multi-Head Self-Attention）处理，该机制允许模型在不同位置关注输入序列的不同部分。
    3. 注意力输出与原始输入进行残差连接（Residual Connection），然后进行层归一化（Layer Normalization）。
    4. 接着，通过一个全连接前馈网络（Feed-Forward Network）进行进一步处理。
    5. 该网络的输出再次与输入进行残差连接并进行层归一化。
    6. 编码器最终的输出（即经过处理的序列向量）将作为后续解码器中“Encoder-Decoder Attention”层的键（Key）和值（Value）矩阵（KV矩阵）。
5. 解码器处理：

    1. 解码器（Decoder）的输入是目标语言序列（翻译结果），在训练时通常是完整的目标句子（或其移位版本）。
    2. 同样经过词嵌入和位置编码，得到向量表示。
    3. 首先经过一个带掩码的多头自注意力层（Masked Multi-Head Self-Attention）。这里的“掩码”至关重要：它确保在生成第 `t` 个位置的输出时，模型只能“看到”第 `t` 个位置之前（包括 `t`）的输入，而无法访问后续位置的信息。这模拟了实际推理过程——翻译是逐词生成的，生成当前词时不应知晓未来的词。  
        ​![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NjZkYzhjNDk5ZWQ0MjNlMDVlZTJiYTRjZDgxOGJlZThfSVlFSXlnZGZxME1lUkduQXZmZFhMRlJGWTZoRWJxUFZfVG9rZW46UmVrSGJZcVVob3BQb3l4eU9RN2NVMTlubmJlXzE3NTU3ODE5NDQ6MTc1NTc4NTU0NF9WNA)
    4. 该层的输出同样经过残差连接和层归一化。
    5. 然后进入“Encoder-Decoder Attention”层。在此层中，解码器上一步的输出作为查询（Query）矩阵（Q矩阵），与编码器提供的 KV 矩阵进行注意力计算，从而使解码器能够关注源句子中的相关信息。
    6. 此注意力输出再经过残差连接和层归一化。
    7. 最后，通过一个全连接前馈网络，并再次进行残差连接和层归一化。
6. 输出预测：

    1. 解码器最终的输出向量，会通过一个线性变换层（Linear Layer），将其维度映射到目标词汇表（Vocabulary）的大小。
    2. 接着，应用 Softmax 函数，将线性层的输出转换为一个概率分布，表示下一个最可能出现的词在整个词表中的概率。
    3. 在推理阶段，我们选择概率最高的那个词作为当前时刻的翻译输出。此过程重复进行，直到生成完整的翻译句子。
