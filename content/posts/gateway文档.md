---
title: "{{title}}"
date: "{{date}}"
tags:
  - code
categories:
  - 分类
description: 描述
summary: 摘要
draft: false
share: true
hidden: false
---


## 网络基础知识
![](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/202409191100731.png)

经典协议
![](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/202409191102136.png)
![](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/202409191103392.png)
![](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/202409191104937.png)


### TCP 为什么需要三次握手四次挥手
![](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/202409191110038.png)

- 三次握手的最主要目的是保证连接是双工的，可靠更多的是通过重传机制来保证的。
- 因为连接是全双工的，双方必须都收到对方的FIN包及确认才可关闭。
![](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/202409191110758.png)

### 为什么time_wait要等2msl

### TCP为什么需要流量控制
- 由于通讯双方，网速不同。通讯方任一方发送过快都会导致对方消息处理不过来，所以就需要把数据放到缓冲区中
- 如果缓冲区满了，发送方还在疯狂发送，那接收方只能把数据包丢弃。因此我们需要控制发送速率。
- 我们缓冲区剩余大小称之为接收窗口，用变量win表示。如果的win=0，则发送方停止发送。

### TCP为什么需要拥塞控制
- 流量控制与拥塞控制是两个概念，拥塞控制是调解网络的负载。
- 接收方网络资源繁忙，因未及时相应ACK导致发送方重传大量数据，这样将会导致网络更加拥堵。
- 拥塞控制是动态调整win大小，不只是依赖缓冲区大小确定窗口大小。
![](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/202409191114676.png)
![](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/202409191114749.png)

### 为什么会出现粘包/拆包？
- 应用程序写入的数据大于套接字缓冲区大小，这将会发生拆包。
- 应用程序写入数据小于套接字缓冲区大小，网卡将应用多次写入的数据发送到网络上，这将会发生粘包。
-  进行MSS（最大报文长度）大小的TCP分段，当TCP报文长度-TCP头部长度>MSS的时候将发生拆包。
- 接收方法不及时读取套接字缓冲区数据，这将发生粘包。

### 如何获取完整应用数据报文？
- 使用带消息头的协议，头部写入包长度，然后再读取包内容。
- 设置定长消息，每次读取定长内容，长度不够时空位补固定字符。
- 设置消息边界，服务端从网络流中按消息边界分离出消息内容，一般使用\n’。
- 更为复杂的协议，例如json、protobuf


![](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/202409191344974.png)
![](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/202409191344782.png)

### golang的tcp小demo

解码部分

``` go
package unpack

import (
	"encoding/binary"
	"errors"
	"io"
)

const MsgHeader = "12345678"

// Encode 将消息编码为特定格式并写入 bytesBuffer 中。
// 消息格式：消息头 + 消息长度 + 消息内容
// 长度：消息头 8字节 + 消息长度 4字节 + 实际消息内容长度 contentLen
func Encode(bytesBuffer io.Writer, content string) error {
	// 写入消息头
	if err := binary.Write(bytesBuffer, binary.BigEndian, []byte(MsgHeader)); err != nil {
		return err
	}
	// 写入消息长度
	contentLen := int32(len(content))
	if err := binary.Write(bytesBuffer, binary.BigEndian, contentLen); err != nil {
		return err
	}
	// 写入消息内容
	if err := binary.Write(bytesBuffer, binary.BigEndian, []byte(content)); err != nil {
		return err
	}
	return nil
}

// Decode 从 bytesBuffer 中读取并解码消息。
// 返回消息内容的字节切片和可能的错误。
func Decode(bytesBuffer io.Reader) (bodyBuf []byte, err error) {
	MagicBuf := make([]byte, len(MsgHeader))
	// 1. 读取消息头
	if _, err = io.ReadFull(bytesBuffer, MagicBuf); err != nil {
		return nil, err
	}
	// 2. 判断消息头是否正确
	if string(MagicBuf) != MsgHeader {
		return nil, errors.New("msg header error")
	}
	lengthBuf := make([]byte, 4)
	// 3. 读取消息长度
	if _, err = io.ReadFull(bytesBuffer, lengthBuf); err != nil {
		return nil, err
	}
	// 4. 转换消息长度
	length := binary.BigEndian.Uint32(lengthBuf)
	bodyBuf = make([]byte, length)
	// 5. 读取实际消息内容
	if _, err = io.ReadFull(bytesBuffer, bodyBuf); err != nil {
		return nil, err
	}
	return bodyBuf, nil
}


```


客户端部分

```go
package main

import (
	"fmt"
	"gatewat_demo/base/unpack/unpack"
	"net"
)

// main 是程序的入口函数。
// 它建立一个 TCP 连接到本地的 9090 端口，并发送编码后的消息 "hello world 0!!!"。
func main() {
	// 尝试建立一个 TCP 连接到本地的 9090 端口
	conn, err := net.Dial("tcp", "localhost:9999")
	defer conn.Close() // 在函数结束时关闭连接
	if err != nil {
		// 如果连接失败，打印错误信息并返回
		fmt.Println("Error dialing", err.Error())
		return
	}
	// 使用自定义的 Encode 函数将消息 "hello world 0!!!" 编码并发送
	unpack.Encode(conn, "hello world 0!!!")
}


```

服务器部分

```go
package main

import (
	"fmt"
	"gatewat_demo/base/unpack/unpack"
	"net"
)

// main 是程序的入口函数。
// 它在本地的 9999 端口上启动一个 TCP 服务器，等待客户端连接并处理连接。
func main() {
	// 1. 本地端口监听 ip:port
	listener, err := net.Listen("tcp", "localhost:9999")
	if err != nil {
		// 如果监听失败，打印错误信息并返回
		fmt.Printf("listen failed, err:%v\n", err)
		return
	}
	for {
		// 2. 等待客户端建立连接
		conn, err := listener.Accept()
		if err != nil {
			// 如果接受连接失败，打印错误信息并继续等待下一个连接
			fmt.Printf("accept failed, err:%v\n", err)
			continue
		}
		// 3. 启动一个单独的 goroutine 处理连接
		go process(conn)
	}
}

// process 处理单个客户端连接。
// 它从连接中读取数据并解码，直到发生错误或连接关闭。
func process(conn net.Conn) {
	defer conn.Close() // 在函数结束时关闭连接
	for {
		// 从连接中解码数据
		bt, err := unpack.Decode(conn)
		if err != nil {
			// 如果读取数据失败，打印错误信息并退出循环
			fmt.Printf("read from client failed, err:%v\n", err)
			break
		}
		// 打印从客户端接收到的数据
		fmt.Printf("receive from client, data:%v\n", string(bt))
	}
}


```

运行后可以看到
![](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/202409191437432.png)

### golang创建udp服务器和客户端

![](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/202409191437163.png)

客户端

``` go
package main

import (
	"fmt"
	"net"
)

func main() {
	// 1. 本地端口监听 ip:port
	conn, err := net.DialUDP("udp", nil, &net.UDPAddr{
		IP:   net.IPv4(127, 0, 0, 1),
		Port: 9999,
	})
	if err != nil {
		fmt.Printf("connect failed, err:%v\n", err)
		return
	}

	//2. 发送数据
	for i := 0; i < 100; i++ {
		_, err = conn.Write([]byte("hello server"))
		if err != nil {
			fmt.Printf("send data failed, err:%v\n", err)
			return
		}
		// 3. 接收数据
		result := make([]byte, 1024)
		n, remoteAddr, err := conn.ReadFromUDP(result)
		if err != nil {
			fmt.Printf("receive data failed, err:%v\n", err)
			return
		}
		fmt.Printf("receive from addr:%v data:%v count:%v\n", remoteAddr, string(result[:n]), n)
	}

}


```

服务端

```go
package main

import (
	"fmt"
	"net"
)

// main 是程序的入口函数。
// 它在本地的 9999 端口上启动一个 UDP 服务器，等待客户端发送消息并回复。
func main() {
	// 1. 本地端口监听 ip:port
	listener, err := net.ListenUDP("udp", &net.UDPAddr{
		IP:   net.IPv4(127, 0, 0, 1),
		Port: 9999,
	})
	if err != nil {
		// 如果监听失败，打印错误信息并返回
		fmt.Printf("listen failed, err:%v\n", err)
		return
	}
	// 2. 循环读取消息
	for {
		var data [1024]byte
		// 使用 ReadFromUDP 读取数据，返回数据长度 n，客户端地址 addr，错误 err
		n, addr, err := listener.ReadFromUDP(data[:])
		if err != nil {
			// 如果读取数据失败，打印错误信息并退出循环
			fmt.Printf("read from udp failed, err:%v\n", err)
			break
		}

		// 启动一个单独的 goroutine 处理客户端请求
		go func() {
			// 3. 回复数据
			fmt.Printf("data:%v addr:%v count:%v\n", string(data[:n]), addr, n)
			_, err = listener.WriteToUDP([]byte("received success"), addr)
			if err != nil {
				// 如果发送数据失败，打印错误信息
				fmt.Printf("write to udp failed, err:%v\n", err)
				return
			}
		}()
	}
}


```



### 