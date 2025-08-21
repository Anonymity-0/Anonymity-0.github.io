---
title: HTTP
slug: http-zwnado
url: /post/http-zwnado.html
date: '2025-08-21 21:19:34+08:00'
lastmod: '2025-08-21 21:19:47+08:00'
toc: true
isCJKLanguage: true
---



# HTTP

### 常见状态码

- 1xx 类状态码属于提示信息，是协议处理中的一种中间状态，实际用到的比较少。
- 2xx 类状态码表示服务器成功处理了客户端的请求，也是我们最愿意看到的状态。

  - 200 OK
- 3xx类状态码表示客户端请求的资源发生了变动

  - 304
  - 302
- 4xx 类状态码表示客户端发送的报文有误，服务器无法处理，也就是错误码的含义。

  - 403 Forbidden 表示服务器禁止访问资源，并不是客户端的请求出错。
  - 404 Not Found 表示请求的资源在服务器上不存在或未找到，所以无法提供给客户端。
- 5xx 类状态码表示客户端请求报文正确，但是服务器处理时内部发生了错误，属于服务器端的错误码。

  - 502 Bad Gateway 通常是服务器作为网关或代理时返回的错误码，表示服务器自身工作正常，访问后端服务器发生了错误。
  - 503 Service Unavailable 表示服务器当前很忙，暂时无法响应客户端，类似“网络服务正忙，请稍后重试”的意思。

### HTTP常见字段

#### Host:

客户端发送请求时，用来指定服务器的域名。

```HTTP
GET /index.html HTTP/1.1
Host: www.example.com
```

#### Content-Length

​`Content-Length` 字段用于表示 HTTP 消息体（Body）的长度，单位为字节。该字段通常出现在响应中，也可以出现在带有请求体的请求中（如 POST 请求）。告知接收方本次传输的数据体有多大，以便接收方知道何时读取完毕。

```HTTP
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234

<!DOCTYPE html>
<html>
...
</html>
```

HTTP是基于TCP传输协议进行通信的，**而使用了TCP传输协议，就会存在一个"粘包"的问题。**

**什么是粘包？**

“粘包”是指多个逻辑上独立的数据包在 TCP 流中被粘在一起传输，接收方无法直接判断每个数据包的起始和结束位置。

举例说明：

- 客户端发送了两个请求：请求A（100字节）和请求B（200字节）。
- 由于 TCP 的字节流特性，服务器可能一次性读取到300字节的数据，而无法判断这到底是两个请求，还是一个合并的请求。

**如何解决粘包问题？**

HTTP 协议通过以下方式明确消息边界，从而避免粘包问题：

1. **设置回车符、换行符作为HTTPheader的边界**， HTTP 使用回车符（CR）和换行符（LF）来界定头部字段的每一行，并以两个连续的 CRLF（即 `\r\n\r\n`）作为 Header 的结束标志。  
    ​![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZDZiODdkN2EyYzRkYzVlYWY5ZWJhMjVjMTE1ZmEyYTNfWUpicHdHS014SEVGdXpnNTZ3Y0doaFhNMkh0UmZGSURfVG9rZW46SlhGTWI1S0RXb3BNbmV4ZTEzSWNHUjkybnlIXzE3NTU3ODIzNzA6MTc1NTc4NTk3MF9WNA)
2. HTTP Body 的边界

    1. 如果响应中包含 `Content-Length` 字段，接收方就可以根据该字段的值读取指定长度的字节作为 Body。
    2. 这样就能明确知道 Body 的起始和结束位置，从而避免粘包问题。

#### Connection

在 HTTP 协议中，`Connection` 是一个非常重要的字段，常用于控制客户端与服务器之间的网络连接行为，尤其是用于协商是否使用 HTTP 长连接（Keep-Alive）。

客户端通过发送 `Connection: Keep-Alive` 告诉服务器希望保持连接打开，以便后续请求可以复用该 TCP 连接。

示例请求头：

```HTTP
GET /index.html HTTP/1.1
Host: www.example.com
Connection: Keep-Alive
```

服务器收到该请求后，如果支持长连接，也会在响应头中返回：

```HTTP
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234
Connection: Keep-Alive
```

1. **什么是 HTTP 长连接？**

HTTP 长连接（也叫持久连接）是指：**在一次 TCP 连接建立后，不立即关闭连接，而是让后续的 HTTP 请求/响应复用这个连接。**

2. 长连接的特点

    1. **只要任意一端没有明确提出断开连接，TCP 连接就保持打开状态。**
    2. 客户端可以使用同一个连接发送多个请求，减少 TCP 握手和慢启动带来的延迟。
3. 长连接并不是永久的。它通常由以下方式之一终止：

    1. 任意一方主动关闭连接（如发送 `Connection: close`）。
    2. 超时：服务器或客户端在一定时间内没有收到新请求，会自动断开连接。
    3. 网络异常或主动断开。
4. 虽然名字相似，但 HTTP Keep-Alive 和 TCP Keepalive 是两个完全不同的概念

    1. HTTP Keep-Alive 是为了**复用连接**，TCP Keepalive 是为了**检测连接是否还存在**。

#### Content-Type

​`Content-Type` 是服务器在响应中使用的字段，用来告诉客户端：本次返回的数据是什么格式。

例如：

```HTTP
Content-Type: text/html; charset=utf-8
```

这表示服务器返回的是一个 HTML 格式的网页，并且使用了 UTF-8 编码。

​`Accept` 是客户端在请求中使用的字段，用来告诉服务器：自己可以处理哪些类型的数据。

例如：

```HTTP
Accept: */*
```

这表示客户端可以接受任何格式的数据。

客户端也可以指定偏好类型，比如希望接收 JSON 格式数据：

```HTTP
Accept: application/json
```

#### Content-Encoding

​`Content-Encoding` 字段说明数据的压缩方法。表示服务器返回的数据使用了什么压缩格式。

```HTTP
Content-Encoding: gzip
```

上面表示服务器返回的数据采用了 gzip 方式压缩，告知客户端需要用此方式解压。

客户端在请求时，用 `Accept-Encoding` 字段说明自己可以接受哪些压缩方法。

```HTTP
Accept-Encoding: gzip, deflate
```

### GET 和 POST 有什么区别？

根据 RFC 规范，**GET 的语义是从服务器获取指定的资源** 。这个资源可以是静态的文本、页面、图片、视频等。GET 请求的参数一般写在 URL 中。由于 URL 只支持 ASCII 编码，所以 GET 请求的参数也**只允许使用 ASCII 字符**。此外，浏览器会对 URL 的长度有所限制（虽然 HTTP 协议本身并未对 URL 长度做任何规定）。

**GET 方法是安全且幂等的**，因为它是“只读”操作。无论执行多少次，都不会改变服务器上的数据，且每次的结果都是一样的。因此，GET 请求的数据可以被缓存，这种缓存可以做到浏览器层面（完全避免发送请求），也可以做到代理服务器上（如 Nginx）。此外，浏览器中 GET 请求可以保存为书签。

根据 RFC 规范，**POST 的语义是根据请求体（body）对指定资源进行处理**，具体处理方式取决于资源类型。POST 请求的数据通常放在报文 body 中，body 中的数据可以是任意格式，只要客户端和服务端协商一致即可。浏览器一般不会对 body 的大小做限制。

**POST 请求通常用于“新增或提交数据”** ，会改变服务器上的资源状态，因此它是不安全的，并且不是幂等的（多次提交可能会创建多个资源）。因此，浏览器通常不会缓存 POST 请求，也不建议将 POST 请求保存为书签。

需要说明的是，RFC 规范并没有规定 GET 请求不能带 body。理论上，任何 HTTP 请求都可以带 body。只是根据 GET 的语义，它用于获取资源，因此通常不需要使用 body。

另外，URL 中的查询参数也不是 GET 请求的专属，POST 请求的 URL 中同样可以带有参数。

### HTTPS

#### HTTP与HTTPS有哪些区别？

- **安全性不同**

  - HTTP 是超文本传输协议，数据以**明文形式**传输，存在被窃听、篡改和伪造的风险。
  - HTTPS 则在 HTTP 和 TCP 之间加入了 SSL/TLS 安全协议，实现了数据的**加密传输**，有效提升了通信安全性。
- **连接建立过程不同**

  - HTTP 的连接建立较为简单，在完成 **TCP 三次握手**后，即可开始传输 HTTP 报文。
  - HTTPS 在 TCP 三次握手之后，还需要进行 **SSL/TLS 握手**过程，包括协商加密算法、交换密钥等步骤，才能进入加密数据传输阶段。
- **默认端口不同**

  - HTTP 默认使用 **80** 端口，而 HTTPS 默认使用 **443** 端口。
- **身份验证机制不同**

  - HTTPS 协议需要服务器向 CA（证书颁发机构）申请**数字证书**，用于验证服务器身份，防止中间人攻击。HTTP 没有此类身份验证机制。

#### 混合加密

HTTPS 采用的是\*\*对称加密\*\*与\*\*非对称加密\*\*相结合的「混合加密」机制，具体流程如下：

- 在\*\*通信建立初期\*\*，使用\*\*非对称加密\*\*来安全地交换一个称为「会话密钥」的密钥信息。由于非对称加密的公钥可以公开分发，私钥由服务器单独持有，因此可以有效解决密钥交换的安全问题。
- 一旦双方成功交换了会话密钥，在\*\*后续通信过程中\*\*，全部采用\*\*<u>对称加密</u>\*\*方式，使用该会话密钥来加密和解密数据。

**为何采用「混合加密」？**

- **对称加密**具有运算速度快、效率高的优点，适合用于大量数据的加密传输。但其缺点是通信双方需要共享同一个密钥，而如何安全地交换密钥是个难题。
- **非对称加密**虽然解决了密钥交换的安全问题（公钥可公开，私钥保密），但其加解密速度较慢，不适合用于大量数据的加密。

#### 数字签名

为了确保传输内容的完整性，我们通常会对内容生成一个唯一的“指纹”——也就是**哈希值（Hash）** ，然后将内容与该哈希值一并传输。

接收方收到后，也会对内容重新计算哈希值，并与发送方附带的哈希值进行比对。如果两者一致，说明内容未被篡改；如果不一致，则说明内容可能在传输过程中被修改。

虽然通过\*\*哈希算法\*\*可以检测内容是否被篡改，但这种方式\*\*无法验证内容的来源\*\*，也无法防止中间人同时篡改内容和哈希值。

**非对称加密**有两个密钥：

- **公钥**：可以公开，任何人都能使用。
- **私钥**：必须由持有者严格保密。

私钥加密、公钥解密的目的，是为了验证消息的来源，防止身份冒充。由于私钥是严格保密的，只有持有者才能用它进行加密，因此如果接收方能用对应的公钥成功解密，就能确认这条消息确实是由私钥持有者发出的。

**数字签名**的核心机制是：\*\*用私钥加密哈希值，用公钥解密验证\*\*。

**数字签名的工作流程如下：**

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NWUyMGE3ZjY4YWUzNGE1MDM0NzEzZDNhMzMyMWZhZGRfbUF4WXJEaTBydHRYRDlETmRBaDdHdjQ5d0tLem9WS05fVG9rZW46QW90Q2JHaU1lbzlNWWZ4cVZTdWNXQkQxbkNVXzE3NTU3ODIzNzA6MTc1NTc4NTk3MF9WNA)

1. 服务端先对要传输的内容使用哈希算法生成一个哈希值。
2. 然后使用自己的\*\*私钥\*\*对这个哈希值进行加密，生成\*\*数字签名\*\*。
3. 服务端将\*\*原始内容 + 数字签名\*\*一起发送给客户端。
4. 客户端收到后，使用相同的哈希算法对内容重新计算哈希值。
5. 同时使用服务端提供的\*\*公钥\*\*对数字签名进行解密，得到原始的哈希值。
6. 最后，客户端将自己计算出的哈希值与解密得到的哈希值进行比对：

    1. 如果一致，说明内容未被篡改，且确实来源于持有私钥的服务端。
    2. 如果不一致，则说明内容被篡改或来源不可信。

#### 数字证书

我们已经知道，HTTPS 通过\*\*哈希算法\*\*可以确保数据的完整性，通过\*\*数字签名\*\*可以验证消息的来源。但还有一个关键问题没有解决：我们怎么确定收到的\*\*公钥\*\*，真的是来自我们要访问的服务器，而不是被中间人伪造的？

换句话说，虽然\*\*数字签名\*\*可以验证“这条消息是不是持有私钥的人发出的”，但我们无法仅凭签名判断“这个\*\*公钥\*\*背后的持有者是不是我们要找的人”。如果我们误将攻击者的\*\*公钥\*\*当成服务器的，那整个安全机制就会被绕过，这就是典型的“中间人攻击”。

为了解决这个问题，HTTPS 引入了\*\*数字证书\*\*机制，并借助一个可信的第三方角色 —— \*\*CA（证书颁发机构）\*\*，来为服务器的身份做背书。

具体来说：

- 服务器在部署 HTTPS 服务时，会将自己的\*\*公钥\*\*和身份信息（比如域名、公司名称等）提交给 CA；
- CA 在核实这些信息后，会使用自己的\*\*私钥\*\*对这些内容进行签名，生成一份数字证书，并将其返回给服务器；
- 当客户端访问服务器时，服务器会将这份数字证书一并发给客户端；
- 客户端收到后，会用内置在操作系统或浏览器中的\*\*CA 公钥\*\*去验证证书中的签名；
- 如果验证通过，说明该证书确实是由可信的 CA 签发的，且内容没有被篡改，进而可以确认证书中包含的\*\*公钥\*\*确实属于目标服务器。

通过这种方式，\*\*数字证书\*\*将服务器的身份和它的\*\*公钥\*\*绑定在一起，并由可信的第三方进行担保，从而解决了“如何信任公钥”的问题。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NGU0YmY3ZjlmM2NiMjRiYzU1MzA0ODI1YmJkOTEzMzRfb2JIWHlQejVmUzhQeDB4Z3JyNEFWSG9IOXRMQ2F1MHJfVG9rZW46TGRmMWJHZ3Bob2lmTk94NWs1UGM3UFJJbmZjXzE3NTU3ODIzNzA6MTc1NTc4NTk3MF9WNA)

### TLS 协议建立的详细流程

HTTPS 的安全通信是通过 TLS（或早期的 SSL）协议来实现的，其核心过程是「握手」。握手阶段的主要目的是建立一个安全的加密通道，让客户端和服务器协商加密方式，并交换生成「会话密钥」所需的参数。整个过程大致如下：

#### 1. 客户端发起请求：ClientHello

当客户端（如浏览器）准备与服务器建立加密连接时，会发送一个 **ClientHello** 请求。该请求中包含以下关键信息：

- 客户端支持的 \*\*TLS 协议版本\*\*，例如 TLS 1.2 或 TLS 1.3；
- 一个由客户端生成的\*\*随机数\*\*（Client Random），用于后续生成会话密钥；
- 客户端支持的\*\*密码套件列表\*\*（即加密算法组合），例如 RSA、ECDHE 等；
- （可选）的扩展信息，如支持的扩展协议、签名算法等。

#### 2. 服务器响应：ServerHello

服务器收到 ClientHello 后，会返回一个 **ServerHello** 响应，内容包括：

- 确认使用的 \*\*TLS 协议版本\*\*，如果客户端不支持当前服务器要求的版本，则终止连接；
- 一个由服务器生成的\*\*随机数\*\*（Server Random），同样用于生成会话密钥；
- 从客户端提供的密码套件中选择一个，作为本次通信的加密方式；
- 服务器的\*\*数字证书\*\*，用于客户端验证服务器身份；
- （在某些情况下）服务器也可能发送自己的密钥交换参数，例如用于 ECDHE 的公钥参数。

#### 3. 客户端验证并回应

客户端收到 ServerHello 后，首先验证服务器的数字证书是否合法。验证方式如下：

- 使用操作系统或浏览器内置的 \*\*CA 公钥\*\*，对证书进行签名验证；
- 确认证书是否在有效期内、是否被吊销、域名是否匹配等。

如果证书验证通过，客户端会进行如下操作：

- 生成一个\*\*随机数 pre-master key\*\*，作为生成会话密钥的另一个关键参数；
- 使用服务器证书中的\*\*公钥\*\*对该 pre-master key 进行加密，并发送给服务器；
- 发送 **Change Cipher Spec** 消息，表示从现在开始的通信将使用协商好的加密方式；
- 发送 **Finished** 消息（握手结束通知），其中包含之前所有握手消息的摘要，用于服务器验证握手过程的完整性。

#### 4. 服务器完成握手

服务器收到客户端发来的加密 pre-master key 后，会使用自己的\*\*私钥\*\*进行解密，获取该随机数。此时，服务器和客户端都已拥有以下三个随机数：

- Client Random（客户端生成）
- Server Random（服务器生成）
- Pre-Master Key（客户端生成并加密发送）

利用这三个随机数以及之前协商的加密算法，双方各自独立计算出\*\*会话密钥（Session Key）\*\*，用于后续的加密通信。

服务器随后发送：

- **Change Cipher Spec** 消息，表示从现在开始的通信也将使用会话密钥加密；
- **Finished** 消息，包含之前所有握手数据的摘要，供客户端验证握手过程的完整性。

#### 5. 加密通信开始

当客户端和服务器都成功交换 Finished 消息后，TLS 握手正式完成。接下来的通信将完全基于 HTTP 协议进行，但所有的数据都会使用\*\*会话密钥\*\*进行加密，确保传输过程中的安全性与完整性。

### HTTPS 一定安全可靠吗？

问题的场景是这样的：客户端通过浏览器向服务端发起HTTPS请求时，被「假基站」转发到了一个

「中间人服务器」，于是客户端是和「中间人服务器」完成了TLS握手，然后这个「中间人服务器」再与

真正的服务端完成TLS握手。

- 中间人提供的证书是自签名或由不可信 CA 签发的，浏览器会明确提示风险。
- 只有当用户主动忽略警告并继续访问时，攻击才可完成。

## HTTP/1.1、HTTP/2、HTTP/3 演变

### HTTP/1.1

#### *长连接*

早期的HTTP/1.0在性能上存在一个显著问题：每次发起请求都需要重新建立一次TCP连接（包括三次握手），并且请求是串行进行的，导致大量的重复TCP连接建立和断开，增加了通信开销。

为了解决这一问题，HTTP/1.1引入了长连接（也称为**持久连接**）机制，只要任意一端**没有明确提出断开连接，则保持TCP连接状态**。当然，如果某个 HTTP 长连接超过一定时间没有任何数据交互，服务端就会主动断开这个连接

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZmQ5ZTQzZGUyZWU3ZTNmN2IzNTZiNzE0OWI4OThkMjNfWEJRU3l5a2lGQ2Nadnh4Rmpzc1c5bndKWkhjcGE2U1dfVG9rZW46VmltZ2JMdjQ2b2YyVVN4dmdoMWNmNGVobk1iXzE3NTU3ODIzNzA6MTc1NTc4NTk3MF9WNA)

#### 管道网络传输

HTTP/1.1采用了长连接的方式，使得管道（pipeline）传输成为可能。

在长连接的基础上，**客户端可以在同一个TCP连接中连续发送多个请求，而无需等待前一个请求的响应返回**。这样可以有效减少整体的通信延迟，提升传输效率。

例如，当客户端需要请求两个资源时，传统方式是在同一个TCP连接中先发送第一个请求A，等待服务器响应后，再发送第二个请求B。而在管道机制下，客户端可以连续发送请求A和B，无需逐个等待响应，从而缩短总响应时间。

如下图：

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MTRmNjEzMGM3YzA1MGIwNmJjZDA1YjIyMzg2Y2Q5NzhfUm1xU0NjZ0dQUExQeFp5RU5KN0RvSUhEaHNRQm9WaEFfVG9rZW46VjFURmJVTERxb1RZNlp4RHp0WGNyNG1nbnlMXzE3NTU3ODIzNzA6MTc1NTc4NTk3MF9WNA)

但需要注意的是，服务器必须按照接收到请求的顺序返回响应。如果服务器处理请求A耗时较长，那么即使请求B已经处理完成，其响应也必须等A的响应发送完毕后才能返回，这就导致了“队头阻塞（Head-of-line blocking）”。

因此，HTTP/1.1的管道机制虽然减少了请求端的阻塞，但并没有解决响应端的队头阻塞问题。

> 提示：实际上，HTTP/1.1的管道化功能并未被广泛支持，大多数浏览器也未默认启用该功能。因此，后续讨论HTTP/1.1的特性时，通常都是基于未启用管道化的前提。大家了解有这个机制即可，但不必在实际开发中依赖它。

#### 队头阻塞

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZjI3NWUyMzE2YTc5ODFhZTI4ZmU1ODM4MzJlM2FkMWNfbmFIOGhMcmg0OGtHdzIwZG1PQ1JHUEdhVjljWGpSNUVfVG9rZW46UnNkb2JKMThZb2VaRE54SWFwa2NiSjRwblJnXzE3NTU3ODIzNzA6MTc1NTc4NTk3MF9WNA)

在同一个TCP连接中，HTTP管道化允许客户端同时发送多个请求，实现了一定程度的请求并发。

然而，在响应阶段，服务器必须按照接收请求的顺序依次返回响应，这就导致了\*\*响应的队头阻塞（Head-of-line blocking）\*\*问题。

比如，假设客户端依次发送了请求A、B、C，服务器在处理时，请求B很快处理完成，但请求A由于某种原因延迟了几秒。此时，即使请求B已经就绪，也必须等待请求A的响应发送完毕后才能发送，请求C也必须再等B发送完才能发送。这样一来，后续所有响应都会被阻塞，形成“队头阻塞”现象。

如上图中红线标识的响应，由于自身延迟，导致它后面的所有响应都被迫延迟，进一步影响整体性能。这也体现了HTTP/1.1管道化技术在实际应用中的主要局限性。

### HTTP/2

#### 头部压缩

HTTP/2会压缩头，如果你发出的多个请求，请求头是一样或者相似的，那么协议会帮你消除重复的部分。

#### 二进制

HTTP/2的报文不再是纯文本而是全面采用了二进制

#### 并发传输

- 一个TCP连接被拆分成多个 **Stream（数据流）** ，每个 Stream 有唯一的 **Stream ID** 来标识。
- 一个 Stream 包含一条或**多条 Message（** 消息），比如一个 HTTP 请求或响应。
- 每个 Message 又被拆成**多个 Frame（帧）** ，Frame 是 HTTP/2 的最小传输单位，是二进制格式的。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NjA0MTcyMTBjYTQ5MGIyOWQ2ZDJmNzAyNzgzYWM5ZThfME9KSXp4UGhUc3lHS01QZHo2ck5QaUZiT0pKaDBMZExfVG9rZW46TnBLNmJnbXEzb2RJUnR4N1BxUWNPeFdNbkFoXzE3NTU3ODIzNzA6MTc1NTc4NTk3MF9WNA)

- 不同 Stream 的 Frame 可以 交错发送（multiplexing，多路复用），接收方根据 Stream ID 把属于同一个流的 Frame 重新组装成完整的 HTTP 消息。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=MTc0YjYzZTVmYzZmOGVlMDQ3ZWIzM2EzNzNkMjhhZTNfQzVVcGEyM0dQZXpoVEw5eU9xc3RCMXJvdkFXTnJDOUVfVG9rZW46VzdpWGJkTWJYb1FkcXl4RHBYN2NzelRQblNlXzE3NTU3ODIzNzA6MTc1NTc4NTk3MF9WNA)

##### 解决了队头阻塞吗？

答案是：

> ✅ 它解决了 HTTP 层面的“队头阻塞”（HTTP Head-of-Line Blocking），
>
> ❌ 但没有完全解决 TCP 层面的“队头阻塞”。

HTTP/2通过多路复用技术，允许客户端和服务器在一个TCP连接上并行交错地发送多个Stream（如Stream1和Stream3）的帧，接收方根据Stream ID将帧重新组装成完整的HTTP消息，从而解决了**HTTP层面的队头阻塞**，避免了请求因排队而等待。

然而，由于HTTP/2仍依赖TCP协议，**当传输中某个帧丢失时，TCP要求按序传输，会阻塞整个连接上的所有数据流直到丢失的帧被重传，因此无法解决TCP层面的队头阻塞问题**。

#### 服务器推送

HTTP/2还在一定程度上改善了传统的「请求－应答」工作模式，服务端不再是被动地响应，可以**主动向 客户端发送消息**。

比如，客户端通过HTTP/1.1请求从服务器那获取到了HTML文件，而HTML可能还需要依赖CSS来渲染页面，这时客户端还要再发起获取CSS文件的请求，需要两次消息往返，如图左边部分：

如图右边部分，在HTTP/2中，客户端在访问HTML时，服务器可以直接主动推送CSS文件，减少了消息传递的次数。

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=NDFmMmIzMDM5ODI2MGQ5YzNiNmEzOTBhN2MwZDI0NWVfU1NEb3BtWnozQ28xb0I1Vkp1c25jYnptZE5jeWJCZjlfVG9rZW46QjM5YWJJdEhlb21Hdnp4eERmVWNXQ1lubndlXzE3NTU3ODIzNzA6MTc1NTc4NTk3MF9WNA)

### HTTP/3

HTTP/2队头阻塞的问题是因为TCP，所以HTTP/3把HTTP下层的**TCP协议改成了UDP！**

#### 无队头阻塞

QUIC有自己的一套机制可以保证传输的可靠性的。当某个流发生丢包时，只会阻塞这个流，**其他流不会受到影响**，因此不存在队头阻塞问题。这与HTTP/2不同，HTTP/2只要某个流中的数据包丢失了，其他流也会因此受影响。

#### 建立连接更快

对于HTTP/1和HTTP/2协议，TCP和TLS 是分层的，分别属于内核实现的传输层、openssI库实现的表示层，因此它们难以合并在一起，需要分批次来握手，**先TCP握手，再TLS握手**。

HTTP/3在传输数据前虽然需要QUIC协议握手，但是这个握手过程只需要1RTT，握手的目的是为确认双方的连接ID，连接迁移就是基于连接ID实现的。

但是**HTTP/3的QUIC协议并不是与TLS分层**，而是**QUIC内部包含了TLS**，它在自己的帧会携带TLS里的"记录"，再加上QUIC使用的是TLS/1.3，因此**仅需1个RTT**就可以「同时」完成建立连接与密钥协商，如下图

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTk3Njg2ZjUxN2Y3ZDVlM2U4YTE4OWIyYjMzNTEzODhfZG9QMmY5Wkp4djE1SlZ5SEhYN0w3aEw4RUtCMElGZnhfVG9rZW46U1NtcmJ0OUE0b29Ldkt4NksyMGM3SjZ4bnhnXzE3NTU3ODIzNzA6MTc1NTc4NTk3MF9WNA)

甚至，在第二次连接的时候，应用数据包可以和QUIC握手信息（连接信息+TLS信息）一起发送，达到

0-RTT的效果。如下图右边部分，HTTP/3当会话恢复时，有效负载数据与第一个数据包一起发送

![](https://d9rfv1jkdq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTljMzkyYzVjZDYxYjYzNmE1YzA4YWQ1MjY0MjhiMmFfNHplQXBGeldEUkdFZkxhTk9vcThDOVplYk1YWGVnS0FfVG9rZW46SEdDV2JsUVQwb0w4OE14QldsdmNiSVZNbkZlXzE3NTU3ODIzNzA6MTc1NTc4NTk3MF9WNA)

#### 连接迁移

基于TCP的HTTP协议使用四元组（**源IP、源端口、目的IP、目的端口**）标识一个连接。当移动设备从4G切换到Wi-Fi时，**IP地址改变**，四元组失效，原TCP连接必须断开并重新建立。这个过程需要经历TCP三次握手、TLS协商和慢启动，导致明显卡顿，连接迁移成本高。

而QUIC协议不再依赖四元组，而是通过**连接ID唯一标识一个连接**。即使网络切换导致IP变化，只要客**户端和服务器仍保留连接上下文（如连接ID、加密密钥等）** ，就能无缝恢复通信，无需重新握手，实现连接迁移，避免卡顿。

QUIC在UDP之上集成了传输控制、加密（TLS 1.3）和多路复用等功能，相当于“TCP + TLS + HTTP/2”的整合体。但由于许多网络设备无法识别QUIC，会将其视为普通UDP流量，可能被限速或丢包，这是其在实际部署中面临的一个挑战。

### TLS的升级

https://xiaolincoding.com/network/2\_http/https\_optimize.html#tls-%E5%8D%87%E7%BA%A7
