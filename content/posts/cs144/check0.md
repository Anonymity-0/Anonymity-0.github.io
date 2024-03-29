---
title: "Check0"
description: 
date: 2024-03-29T14:16:37+08:00
image: 
math: 
license: 
hidden: false
comments: true
draft: false
categories:
    - 计算机网络基础知识
tags:
    - lab
---

## 前言
其实从本科开始，计网相关的课上了也有三次：第一次是大二在CQU上的，当时用的自顶向下那本书，一上来方老师就无敌催眠，不过是开卷考试，最后面向考试临时复习也拿了90+；第二次是考研的时候看的湖科大的网课，说实话这个老师动画做的很好，每个知识点好像都听懂了，但是还是没有形成成套的系统；第三次是在USTC上的高级计算机网络，上学期选这门课的时候，还是抱着一种想学东西的心态去听的，毕竟选的时候就听过这门课很硬核。遗憾的是，尝试听了一两节课后还是放弃了。机缘巧合之下，看到了cs144的lab，想给自己立一个新坑，这个学期搓出来cs144。计网的概念实在是玄乎又不好理解，或许换种方式，试试自己动手写写，顺便尝试读读英文文档（当然还是会借助一下翻译器），话不多说，cs144，启动！



## 1 Set up GNU/Linux on your computer

文档中给出了几种环境的安装方式
1. Recommended: Install the CS144 VirtualBox virtual-machine image (instructions at https://stanford.edu/class/cs144/vm howto/vm-howto-image.html).
2. Use a Google Cloud virtual machine using our class’s coupon code (instructions at https://stanford.edu/class/cs144/vm howto).
3. Run Ubuntu version 23.10, then install the required packages: sudo apt update && sudo apt install git cmake gdb build-essential clang \clang-tidy clang-format gcc-doc pkg-config glibc-doc tcpdump tshark
4. Use another GNU/Linux distribution, but be aware that you may hit roadblocks along the way and will need to be comfortable debugging them. Your code will be tested on Ubuntu 23.10 LTS with g++ 13.2 and must compile and run properly under those conditions.
5. If you have a 2020–24 MacBook (with the ARM64 M1/M2/M3 chips), VirtualBox will not successfully run. Instead, please install the UTM virtual machine software and our ARM64 virtual machine image from https://stanford.edu/class/cs144/vm howto/.

我是MAC系统所以就按第五种进行虚拟机的安装（上学期已经被折磨过一次）
1. 下载UTM并进行安装（这一步没啥好介绍的）
2. 下载[Setting up your CS144 VM](https://stanford.edu/class/cs144/vm_howto/)提供的[ARM64 GNU/Linux virtual machine image](https://web.stanford.edu/class/cs144/vm_files/cs144-arm64-2024.utm.tar.gz),并导入UTM
3. 启动虚拟机,初始用户和密码都是`cs144`
到这里，虚拟机就安装完成了，开始实验！


## 2 Networking by hand
这一节主要是体验一下，用图形化浏览器访问网页和在终端操作的区别。

### 2.1 Fetch a Web page
1. 在图形化浏览器访问[cs144.keithw.org/hello](http://cs144.keithw.org/hello)，可以看到下图内容
	![](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/202403161810392.png)

2. 在虚拟机的终端输入 `telnet cs144.keithw.org http`，结果如下
	- 这个命令是用来通过Telnet协议手动模拟一个简单的HTTP请求，以连接到域名 `cs144.keithw.org` 上提供的HTTP服务。
	- **telnet** 是一个基于TCP/IP协议的远端登录工具，它允许用户通过网络与远程主机上的指定端口建立直接交互式连接。
	- **cs144.keithw.org** 是要连接的目标服务器的域名。
	- **http** 指定要连接的TCP端口号，默认情况下HTTP服务运行在80端口，但在这种情况下省略了端口号，因为`http`作为参数实际上暗示telnet应连接到HTTP服务的标准端口80。
	- ![](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/202403161813923.png)
3. 当你执行这个命令后，telnet会尝试与该服务器的80端口建立连接。一旦连接成功，你可以在telnet会话中手工输入HTTP请求头和请求体来模拟浏览器与Web服务器之间的通信。
	1. 输入`GET /hello HTTP/1.1` ，回车。这是一个HTTP头部信息，告知服务器请求的目标主机名，确保服务器知道你请求的是哪个站点的资源，即使多个站点可能共享同一IP地址和端口。
	2. 输入`Host: cs144.keithw.org`，回车。这是一个HTTP头部信息，告知服务器请求的目标主机名，确保服务器知道你请求的是哪个站点的资源。
	3. 输入`Connection: close`，回车。这也是一个HTTP头部信息，指示服务器在完成响应后关闭TCP连接，因为在HTTP/1.1中默认采用持久连接，而这里明确要求一次请求结束后就关闭连接。
	4. 在输入完上述信息后，再按一次回车键，发送一个空行。在HTTP协议中，空行标志着请求头部的结束，接下来服务器将读取并处理你的请求。
	5. 如果一切正常，你将在telnet窗口中看到服务器发回的响应。


### 2.2

### 2.3
## 3. Writing a network program using an OS stream socket

前面只是一些直观的体验，现在要真正开始编程了，在这个实验中，你将使用操作系统内置的传输控制协议支持。你需要编写一个名为“webget”的程序，创建一个TCP流套接字，连接到Web服务器，并获取一个页面。在后续的实验中，你将实现传输控制协议的另一部分，即自己实现TCP协议，将不可靠的数据报转换为可靠的字节流。


### 3.1 Let’s get started—fetching and building the starter code
1. 在虚拟机的终端窗口运行`git clone https://github.com/cs144/minnow` 获得源代码

2. Optional: Feel free to backup your repository to a private GitHub/GitLab/Bitbucket repository (e.g., using the instructions at https://stackoverflow.com/questions/10065526/ github-how-to-make-a-fork-of-public-repository-private), but please make absolutely sure that your work remains private.（可选项，其实就是让你备份）

3. 进入文件夹: `cd minnow`

4. 创建一个目录来编译实验软件：`cmake -S . -B build`

5. 编译源文件: `cmake --build build`

6. 返回上层文件夹，打开 `writeups/check0.md` 文件，这是实验检查点报告的模板。
	- . ![](https://raw.githubusercontent.com/Anonymity-0/Picgo/main/img/202403171228997.png)

### 3.2 Modern C++: mostly safe but still fast and low-level
实验作业将使用现代C++风格编写，这种风格使用最近（2011年）的语言特性以尽可能安全地进行编程。这可能与过去编写C++的方式不同。关于这种风格的参考，请参见[C++ Core Guidelines](http://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines)。

具体来说：
- 使用 https://en.cppreference.com 作为编程资源。（我们建议您避免使用cplusplus.com，因为它可能已经过时。）
- 不要使用malloc()或free()。
- 不要使用new或delete。
- 尽量不使用原始指针（\*），只在必要时使用“智能”指针（unique_ptr或shared_ptr）（在CS144中不需要使用这些）。
- 避免使用模板、线程、锁和虚函数（您在CS144中不需要使用这些）。
- 避免使用C风格字符串（char \*str）或字符串函数（如strlen()，strcpy()）。这些容易出错。请改用std::string。
- 不要使用C风格强制转换（例如，(FILE \*)x）。如果需要，请使用C++静态强制转换（通常在CS144中不需要这样做）。
- 优先通过常量引用传递函数参数（例如：const Address & address）。
- 除非需要修改，否则使每个变量都为const。
- 除非需要修改对象，否则使每个方法都为const。
- 避免使用全局变量，并尽可能使每个变量的作用域最小。
- 在提交作业之前，运行`cmake --build build --target tid`y以获取有关如何根据C++编程实践改进代码的建议，并运行`cmake --build build --target format`以一致地格式化代码。

### 3.3 阅读Minnow支持代码 
为了支持这种编程风格，Minnow使用类将操作系统的函数封装成现代C++的形式。这些类主要是对您在CS 110/111课程中已经接触过的概念，如套接字和文件描述符，进行封装。
您需要阅读这些类的公共接口，这些接口定义在`util/socket.hh`和`util/file descriptor.hh`文件中的`public:`之后的部分。特别要注意的是，Socket是FileDescriptor的一种类型，而TCPSocket又是Socket的一种类型。

这段话乍一看我头都大了，查阅了一下得到的解释如下：
- Socket是网络编程中的一个概念，它允许程序通过计算机网络进行通信。
- FileDescriptor是一个更通用的概念，它通常指的是操作系统中的一个整数，用于标识打开的文件、套接字等资源。
- 在Minnow中，Socket是FileDescriptor的一个子类，这意味着Socket拥有FileDescriptor的所有功能，并且还有一些额外的网络通信相关的功能。同样，TCPSocket是Socket的子类，它提供了对TCP（传输控制协议）套接字的专门支持。

如果听起来还是很抽象，那我们还是看看代码吧

```c++
class Socket : public FileDescriptor
{

public:
  //! Bind a socket to a specified address with [bind(2)](\ref man2::bind), usually for listen/accept
  void bind( const Address& address );

  //! Bind a socket to a specified device
  void bind_to_device( std::string_view device_name );

  //! Connect a socket to a specified peer address with [connect(2)](\ref man2::connect)
  void connect( const Address& address );

  //! Shut down a socket via [shutdown(2)](\ref man2::shutdown)
  void shutdown( int how );

  //! Get local address of socket with [getsockname(2)](\ref man2::getsockname)
  Address local_address() const;
  //! Get peer address of socket with [getpeername(2)](\ref man2::getpeername)
  Address peer_address() const;

  //! Allow local address to be reused sooner via [SO_REUSEADDR](\ref man7::socket)
  void set_reuseaddr();

  //! Check for errors (will be seen on non-blocking sockets)
  void throw_if_error() const;
};

```
可以看到`Socket`类是`FileDescriptor`的子类，它定义了一些与套接字相关的操作，如绑定地址、连接、关闭、获取本地和对等地址等。

```c++
class TCPSocket : public Socket
{
private:
  //! \brief Construct from FileDescriptor (used by accept())
  //! \param[in] fd is the FileDescriptor from which to construct
  explicit TCPSocket( FileDescriptor&& fd ) : Socket( std::move( fd ), AF_INET, SOCK_STREAM, IPPROTO_TCP ) {}

public:
  //! Default: construct an unbound, unconnected TCP socket
  TCPSocket() : Socket( AF_INET, SOCK_STREAM ) {}

  //! Mark a socket as listening for incoming connections
  void listen( int backlog = 16 );

  //! Accept a new incoming connection
  TCPSocket accept();
};

```
- `TCPSocket`类是`Socket`的子类，它专门用于处理TCP套接字。
- `TCPSocket`类有两个构造函数，一个是默认构造函数，用于创建一个未绑定、未连接的TCP套接字；另一个是从`FileDescriptor`构造的，这通常是`accept`方法接受新连接时使用的。
- 重点讲一下`explicit TCPSocket( FileDescriptor&& fd ) : Socket( std::move( fd ), AF_INET, SOCK_STREAM, IPPROTO_TCP ) {}`这个部分，这是之前没有遇到过的（C++学的比较浅）。
	- 总的来说，`explicit TCPSocket( FileDescriptor&& fd ) : Socket( std::move(fd), AF_INET, SOCK_STREAM, IPPROTO_TCP ) {}`表示`TCPSocke`t构造函数接受一个右值引用的`FileDescriptor`类型的参数fd，并使用这个参数来初始化`Socket`对象。
	- `explicit`关键字表示这个构造函数只能显式地被调用，不能隐式地转换类型。
	- `FileDescriptor&& fd`表示这个构造函数接收一个`FileDescriptor`类型的参数，`&&`表示这个参数是右值引用，也就是说，这个参数可能是一个临时的对象。
	- `: Socket( std::move( fd ), AF_INET, SOCK_STREAM, IPPROTO_TCP )` 这部分是构造函数的初始化列表。它的作用是初始化这个`TCPSocket`对象的父类`Socket`。实际上是在调用基类`Socket`的构造函数，并传递了构造函数的参数。这样做的好处是，它可以确保基类构造函数在派生类构造函数体执行之前被调用，从而正确初始化基类的部分。
	- `std::move( fd )`表示将`fd`的所有权移动给`Socket`，这样可以避免不必要的复制。
	- `AF_INET, SOCK_STREAM, IPPROTO_TCP`是创建`Socket`时需要的参数，它们分别表示使用的网络协议族（IPv4），套接字类型（流式套接字）和协议（TCP）。

如果你觉得上面解释的如果还不够清晰，那说明~~你的c++和我一样学的半桶水~~，接下来是一些举例的知识补充：

#### explicit关键字
用一个更简单的例子来解释`explicit`关键字的作用。
想象一下你有一个装钱的钱包，这个钱包只能装纸币，不能装硬币。现在，你想要设计一个往钱包里放钱的功能。
1. **没有`explicit`的情况**：
   你设计了一个钱包的构造函数，这个构造函数可以接受一个纸币面额的参数，比如`100`，然后钱包里就会自动有`100`块钱。这个构造函数没有使用`explicit`关键字。
   ```cpp
   class Wallet {
   public:
       Wallet(int money) : money(money) {}
       int getMoney() const { return money; }
   private:
       int money;
   };
   ```
   这时，你可以这样使用这个钱包：
   ```cpp
   Wallet wallet(100); // 明确地创建一个有100块钱的钱包
   Wallet anotherWallet = 200; // 这里隐式地将200这个整数转换成了一个钱包
   ```
   在第二种情况中，你只是写了一个数字`200`，并没有明确地调用构造函数，但是编译器却自动帮你创建了一个钱包，并且里面有`200`块钱。这就是没有`explicit`关键字的构造函数允许的隐式转换。
2. **使用`explicit`的情况**：
   现在，你决定在设计钱包的时候，不允许这种隐式转换，你希望每次往钱包里放钱都必须明确地调用构造函数。这时，你可以在构造函数前加上`explicit`关键字。
   ```cpp
   class Wallet {
   public:
       explicit Wallet(int money) : money(money) {}
       int getMoney() const { return money; }
   private:
       int money;
   };
   ```
   这时，如果你尝试之前的那种隐式转换：
   ```cpp
   Wallet wallet(100); // 这仍然是正确的，因为这是明确地调用构造函数
   Wallet anotherWallet = 200; // 这将是一个错误，因为构造函数是explicit的，不允许隐式转换
   ```
   第二行代码会导致编译错误，因为编译器不再允许你只是写一个数字就自动创建钱包。你必须明确地调用构造函数，像第一行那样。
所以，`explicit`关键字的作用就是防止构造函数的隐式调用，让类型转换更加明确，避免程序中出现意想不到的行为。

在cs144这段代码中，如果我们尝试这样做：

```cpp
FileDescriptor fd(1234); // 创建一个文件描述符
TCPSocket socket = fd;    // 这将失败，因为TCPSocket的构造函数是explicit的
```

这段代码会失败，因为TCPSocket的构造函数是explicit的，这意味着我们不能使用隐式类型转换将FileDescriptor类型的值转换为TCPSocket对象。我们必须明确地调用构造函数，如下所示：

``` cpp
FileDescriptor fd(1234); // 创建一个文件描述符
TCPSocket socket(std::move(fd)); // 正确，明确地调用构造函数
```


#### 右值引用
在C++中，我们有两种类型的引用：左值引用和右值引用。

左值引用是我们通常所说的引用，它引用的是一个具有明确存储位置的对象。例如：

```c++
int a = 5;

int& ref = a; // 左值引用
```


右值引用是C++11引入的新特性，它引用的是一个临时对象，或者说是一个将要销毁的对象。这种引用通常用于移动语义和完美转发。例如：

```c++
int&& rref = 5; // 右值引用
```

在这个例子中，数字5是一个临时对象，我们可以用右值引用来引用它。

`FileDescriptor&& fd`就是一个右值引用，它指向的是一个`FileDescriptor`类型的临时对象。这个构造函数的作用就是，直接取走这个临时对象的值，用来初始化一个新的`TCPSocket`对象，而不需要复制这个临时对象。

假设有个FileDescriptor对象：
```cpp
FileDescriptor fd1(1);
```
如果我们尝试这样做：
``` cpp
TCPSocket socket1(fd1); // 这会创建一个副本
```

这里，fd1是一个左值引用，因为它是一个有名字的对象。当我们传递fd1给TCPSocket的构造函数时，我们需要创建fd1的一个副本。
```c++
// 以下是创建TCPSocket对象的正确方式，使用右值引用
TCPSocket socket1(FileDescriptor(1)); // 创建了一个临时的FileDescriptor对象
```

#### std::move()

在C++中，`std::move`是一个函数模板，它将一个左值引用转换为右值引用。当你在代码中看到`std::move(fd)`时，它的作用是将`fd`这个左值引用转换为右值引用。这样，你就可以传递一个临时的对象，而不需要创建它的一个副本。


```c++
#include <utility> // for std::move

class MyObject {
public:
    MyObject(int value) : value(value) {}
    MyObject(MyObject&& other) : value(other.value) {
        other.value = 0; // "窃取" other 的资源
    }
    int value;
};

int main() {
    MyObject obj1(5);
    MyObject obj2(std::move(obj1)); // 使用 std::move 将 obj1 转换为右值引用

    // 现在，obj1 的值已经被 "窃取"，obj2 的值是 5
    return 0;
}
```
在这个例子中，我们有一个`MyObject`类，它有一个接受右值引用的构造函数。在`main`函数中，我们创建了一个`MyObject`对象`obj1`，然后我们使用`std::move(obj1)`将`obj1`转换为右值引用，然后将其传递给`obj2`的构造函数。这样，`obj2`的构造函数就可以直接接收`obj1`的所有权，而不需要复制`obj1`。

回到原始问题，`explicit TCPSocket( FileDescriptor&& fd ) : Socket( std::move(fd), AF_INET, SOCK_STREAM, IPPROTO_TCP ) {}`中的`std::move(fd)`也是类似的作用。它将`fd`这个左值引用转换为右值引用，这样就可以传递一个临时的`FileDescriptor`对象，而不需要创建它的一个副本。这可以提高性能，因为我们避免了不必要的对象复制。

```cpp
FileDescriptor fd1(1);
TCPSocket socket(std::move(fd1));

```
在这段代码中，`std::move(fd1)`将`fd1`转换为右值引用，然后将其传递给`TCPSocket`的构造函数。这样，`TCPSocket`的构造函数就可以直接接收`fd1`的所有权，而不需要复制`fd1`。注意，一旦你这样做了，你就不应再使用`fd1`了，因为它的值可能已经被"窃取"了。

### 3.4 Writing webget

误会了现在才到写的时候。。。
1. 在构建目录中，使用文本编辑器或集成开发环境打开…/apps/webget.cc文件。
2. 在get URL函数中，实现如文件中所述的简单Web客户端，使用之前使用的HTTP（Web）请求格式。使用TCPSocket和Address类。
3. 提示：
	1. 请注意，在HTTP中，每行必须以“\r\n”结束（仅使用“\n”或endl是不够的）。
	2. 不要忘记在你的客户端请求中包含“Connection: close”行。这告诉服务器在发送完这个请求后，不需要等待你的客户端发送更多的请求。相反，服务器将发送一个回复，然后会立即结束其发送的字节流（从服务器套接字到你的套接字）。你会发现你的传入字节流已经结束，因为当你的套接字读取完从服务器传来的整个字节流时，会达到“EOF”（文件结束）。这就是你的客户端知道服务器已经完成回复的方式。
	3. 确保读取并打印服务器所有输出直到套接字达到“EOF”（文件结束）——一次读取调用是不够的。
	4. 我们预计你将需要编写大约十行代码




```cpp
//! 一个围绕[TCP 套接字](\ref man7::tcp)的包装类
class TCPSocket : public Socket
{
private:
  //! \brief 通过文件描述符构造（由accept()函数使用）
  //! \param[in] fd 是用于构造的文件描述符
  explicit TCPSocket( FileDescriptor&& fd ) : Socket( std::move( fd ), AF_INET, SOCK_STREAM, IPPROTO_TCP ) {}
public:
  //! 默认构造函数：创建一个未绑定、未连接的TCP套接字
  TCPSocket() : Socket( AF_INET, SOCK_STREAM ) {}
  //! 标记一个套接字监听入站连接
  void listen( int backlog = 16 );
  //! 接受一个新入站的连接
  TCPSocket accept();
};
```
这是TCPSocket类的源码，注意他的构造函数，`AF_INET` 指定了 IPv4 地址族，`SOCK_STREAM` 指定了流式套接字类型。

```cpp
//! 包装类，用于处理[IPv4 地址](@ref man7::ip) 和 DNS 操作。
class Address
{
public:
  //! \brief 包装 [sockaddr_storage](@ref man7::socket) 的类。
  //! \details `sockaddr_storage` 结构体有足够的空间来存储任何类型的套接字地址（IPv4 或 IPv6）。
  class Raw
  {
  public:
    sockaddr_storage storage {}; //!< 被包装的结构体本身。
    // NOLINTBEGIN (*-explicit-*)
    operator sockaddr*(); //!< 隐式转换操作符，允许将 Raw 对象转换为 sockaddr 指针。
    operator const sockaddr*() const; //!< 隐式转换操作符，允许将 Raw 对象转换为 const sockaddr 指针。
    // NOLINTEND (*-explicit-*)
  };
private:
  socklen_t _size; //!< 被包装地址的大小。
  Raw _address {}; //!< 包含地址的 [sockaddr_storage](@ref man7::socket) 的包装。
  //! 通过 ip/host、service/port 和解析器提示构造。
  Address( const std::string& node, const std::string& service, const addrinfo& hints );
public:
  //! 通过解析主机名和服务名构造。
  Address( const std::string& hostname, const std::string& service );
  //! 通过点分四段字符串（例如 "18.243.0.1"）和数字端口构造。
  explicit Address( const std::string& ip, std::uint16_t port = 0 );
  //! 通过 [sockaddr *](@ref man7::socket) 构造。
  Address( const sockaddr* addr, std::size_t size );
  //! 相等比较运算符。
  bool operator==( const Address& other ) const;
  bool operator!=( const Address& other ) const { return not operator==( other ); } //!< 不等比较运算符，通过重载 == 运算符实现。
  //! \name 转换函数
  //!@{
  //! 返回点分四段 IP 地址字符串（例如 "18.243.0.1"）和数字端口。
  std::pair<std::string, uint16_t> ip_port() const;
  //! 返回点分四段 IP 地址字符串（例如 "18.243.0.1"）。
  std::string ip() const { return ip_port().first; }
  //! 返回数字端口（主机字节序）。
  uint16_t port() const { return ip_port().second; }
  //! 返回数字 IP 地址作为整数（即以 [主机字节序](\ref man3::byteorder)）。
  uint32_t ipv4_numeric() const;
  //! 从 32 位原始数字 IP 地址创建 Address。
  static Address from_ipv4_numeric( uint32_t ip_address );
  //! 返回人类可读的字符串，例如 "8.8.8.8:53"。
  std::string to_string() const;
  //!@}
  //! \name 低级操作
  //!@{
  //! 返回底层地址存储的大小。
  socklen_t size() const { return _size; }
  //! 返回指向底层套接字地址存储的常量指针。
  const sockaddr* raw() const { return static_cast<const sockaddr*>( _address ); }
  //! 安全地转换为底层 sockaddr 类型。
  template<typename sockaddr_type>
  const sockaddr_type* as() const;
  //!@}
};
```
`Address`类的构造函数有许多，让我们回到getURL函数，可以看到传递过来的参数为host和path。

```cpp
void get_URL( const string& host, const string& path )
{
}

```
很容易的想到用以下构造函数进行地址对象的构建
```cpp
explicit Address( const std::string& ip, std::uint16_t port = 0 );
```



`TCPSocket`类并没有定义`write`方法，但是它继承自`Socket`类，而`Socket`类又继承自`FileDescriptor`类。在Unix和Linux系统中，套接字可以被视为一种特殊类型的文件描述符，因此你可以使用`write`系统调用来向套接字写入数据。这就是为什么你可以在`TCPSocket`对象上调用`write`方法而不会报错的原因。





``` cpp
void get_URL( const string& host, const string& path )
{
  TCPSocket socket;
  const string service {"http"};
  socket.connect(Address(host,service)); // 绑定到所有接口的80端口
  const string request {"GET "+path+" HTTP/1.1\r\n"+"Host: "+host+"\r\n"+"Connection: close\r\n"+"\r\n"};
  socket.write(request);
  string response,buffer;
  while(socket.read(buffer),!buffer.empty()){
    response.append(buffer);
  }
  cout  << response; 
  socket.close();
}

```




测试
`cmake --build build --target check_webget`