---
title: 动态字符串SDS
slug: dynamic-string-sds-7ahiw
url: /post/dynamic-string-sds-7ahiw.html
date: '2025-05-28 10:19:34+08:00'
lastmod: '2025-06-10 23:10:32+08:00'
toc: true
isCJKLanguage: true
---



# 动态字符串SDS

---

title: "动态字符串SDS"  
date: {{ now.Format "2006-01-02T15:04:01+08:00" }}  # 自动填充当前时间（适用于 Hugo）  
image: "/images/your-image.jpg"  # 图片路径（可选）  
math: false  # 是否启用数学公式（如 LaTeX）  
license: "CC BY-SA 4.0"  # 许可协议（可选）  
hidden: false  # 是否隐藏文章  
comments: true  # 是否启用评论  
draft: false  # 是否为草稿（true 时不生成）  
categories:  
    - "redis源码解析"  
tags:  
    - "中间件源码学习"  
    - "redis"

---

‍

Redis没有用c语言的字符串，本质c语言没有字符串`char * s = "hello"`​ ![image](/images/image-20250527212640-b2ey49f.png)他有一个结束标识'\0'

- 获取字符串长度需要通过运算-1或者字符数组O(n)

- 非二进制安全：如果我有一个字符也是‘\0’会出问题，不能包含。

- 不可以修改，因为他保存在内存的常量池。

Reids构建了一种新的字符串结构称为简单动态字符串SDS,SDS其实是一个结构体，源代码如下

```c
struct __attribute__ ((__packed__)) sdshdr8 {
	uint8_t len；/*buf已保存的字符串字节数，不包含结束标示*/
	uint8_t alloc;/*buf申请的总的字节数，不包含结束标示*/
	unsigned char flags；/*不同SDS的头类型，用来控制SDS的头大小*/
	char buf[]; //
}；
```

因为uint8 最多长度为255，redis里不止是有sdshdr8，还有其他结构体

![image](/images/image-20250527220136-omqlmk5.png)

### SDS类型对比表格

|类型|值|结构体|Header大小|len字段|alloc字段|最大长度|特殊说明|
| ---------------------| ----| ----------| ------------| -----------------| --------------| ------------| ------------------------------------|
|SDS\_TYPE\_5|0|sdshdr5|1字节|无(存在flags中)|无|31字节|长度存储在flags高5位，不支持预分配|
|SDS\_TYPE\_8|1|sdshdr8|3字节|uint8\_t|uint8\_t|255字节|适合短字符串|
|SDS\_TYPE\_16|2|sdshdr16|5字节|uint16\_t|uint16\_t|65,535字节|适合中等长度字符串|
|SDS\_TYPE\_32|3|sdshdr32|9字节|uint32\_t|uint32\_t|\~4GB|适合长字符串|
|SDS\_TYPE\_64|4|sdshdr64|17字节|uint64\_t|uint64\_t|极大|适合超长字符串|

## 设计优势

1. **内存效率**: 根据字符串长度选择合适的header大小，避免浪费
2. **类型自动选择**: 根据字符串长度自动选择最优的SDS类型
3. **向后兼容**: 所有类型都支持相同的API接口
4. **性能优化**: 较小的header减少内存访问开销

**一个包含字符串“name”的sds结构如下：**

![image](/images/image-20250527220507-vfbe49f.png)

二进制安全：我遍历buf的时候，不会因为碰到\0就不读了，而是根据len的长度来读。

因为len记录了长度，获取长度的时间复杂度为O(1)。

sds之所以叫动态字符串，因为他具备动态扩容的能力

## SDS 扩容策略（内存预分配）

当进行字符串追加（如 `sdsCat`​）操作时，如果当前剩余空间不足，SDS 会根据以下规则进行 **动态扩容**：

✅ 情况 1：新字符串总长度 \< 1MB

- 新分配的空间 \= `新字符串长度 * 2 + 1`​
- 即：预留 **双倍于所需空间** 的容量，防止频繁扩容。

✅ 情况 2：新字符串总长度 ≥ 1MB

- 新分配的空间 \= `新字符串长度 + 1MB + 1`​
- 这是为了避免在大字符串情况下过度浪费内存。

> ⚠️ 注意：+1 是为了给结尾的 `\0`​ 留出空间。

### 源码

```c
// s：当前SDS字符串指针
// addlen：需要额外增加的空间大小
// greedy：是否启用贪婪策略（即预分配更多空间）
sds _sdsMakeRoomFor(sds s, size_t addlen, int greedy) {
    void *sh, *newsh;         // sh: 指向SDS结构体头；newsh: 新内存地址
    size_t avail = sdsavail(s);  // 当前可用剩余空间
    size_t len, newlen, reqlen;
    char type, oldtype = sdsType(s);  // 获取当前SDS类型（sdshdr5、8、16等）
    int hdrlen;               // SDS头部长度（根据类型不同而不同）
    size_t bufsize, usable;   // 实际申请到的内存大小，以及其中可用于存储的部分
    int use_realloc;

    // Step 1: 检查当前是否有足够空间可以容纳新增内容
    if (avail >= addlen) return s;  // 如果有，直接返回原字符串，无需扩容

    // Step 2: 计算当前SDS字符串长度 + 需要新增的内容长度
    len = sdslen(s);                // 获取当前SDS的有效字符长度
    sh = (char*)s - sdsHdrSize(oldtype); // 找到整个SDS结构的起始地址（包括头部）
    reqlen = newlen = (len + addlen);     // reqlen 是实际需要的总长度
    assert(newlen > len);                 // 确保不会溢出

    // Step 3: 根据greedy标志选择不同的扩容策略
    if (greedy == 1) {
        // 贪婪策略：
        // - 如果新长度小于最大预分配阈值（默认1MB），则翻倍分配
        // - 否则只多分配SDS_MAX_PREALLOC（通常为1MB）
        if (newlen < SDS_MAX_PREALLOC)
            newlen *= 2;
        else
            newlen += SDS_MAX_PREALLOC;
    }

    // Step 4: 根据新的所需长度确定使用哪种SDS结构类型
    type = sdsReqType(newlen);  // 根据长度决定应该用哪个sdshdr结构（如 sdshdr8、sdshdr16 等）
    if (type == SDS_TYPE_5) type = SDS_TYPE_8;  // sdshdr5不支持动态扩容，所以强制升级为sdshdr8

    // Step 5: 判断是否可以直接realloc，还是需要重新malloc并复制数据
    hdrlen = sdsHdrSize(type);  // 计算新类型头部的大小
    use_realloc = (oldtype == type);  // 类型未变，就可以尝试用realloc扩展内存

    // Case A: 类型一致，尝试用 realloc 扩展内存空间
    if (use_realloc) {
        newsh = s_realloc_usable(sh, hdrlen + newlen + 1, &bufsize);
        if (newsh == NULL) return NULL;  // 内存分配失败
        s = (char*)newsh + hdrlen;       // 定位到真正的字符串区域（跳过头部）

        // 可能由于对齐等原因导致实际分配的空间比请求的大，检查是否需要调整类型
        if (adjustTypeIfNeeded(&type, &hdrlen, bufsize)) {
            memmove((char *)newsh + hdrlen, s, len + 1);  // 将原字符串内容移动到新位置
            s = (char *)newsh + hdrlen;
            s[-1] = type;              // 更新类型字段
            sdssetlen(s, len);         // 设置长度
        }
    } 
    // Case B: 类型不一致，必须重新分配内存并拷贝旧数据
    else {
        newsh = s_malloc_usable(hdrlen + newlen + 1, &bufsize);  // 分配新内存
        if (newsh == NULL) return NULL;

        adjustTypeIfNeeded(&type, &hdrlen, bufsize);  // 检查是否还可以降级或优化类型
        memcpy((char*)newsh + hdrlen, s, len + 1);    // 拷贝原字符串内容
        s_free(sh);                                    // 释放旧内存
        s = (char*)newsh + hdrlen;                     // 定位到字符串区域
        s[-1] = type;                                  // 设置类型
        sdssetlen(s, len);                             // 设置长度
    }

    // Step 6: 更新SDS的可用空间信息
    usable = bufsize - hdrlen - 1;  // 可用空间 = 总空间 - 头部 - 结束符\0
    sdssetalloc(s, usable);         // 设置alloc字段为可用空间大小

    return s;  // 返回新的SDS字符串
}
```

|步骤|功能|
| ------| ----------------------------------------------------------------|
|**Step 1**|检查是否有足够的剩余空间，避免不必要的扩容|
|**Step 2**|计算新字符串总长度|
|**Step 3**|使用贪婪策略决定是否预分配更多空间（提升性能）|
|**Step 4**|根据新长度选择合适的SDS结构类型（节省内存）|
|**Step 5**|判断是否可以就地扩容（realloc）或必须新建内存块（malloc+copy）|
|**Step 6**|更新SDS结构中的 alloc 字段|

‍

总的来说sds的优点：

==①获取字符串长度的时间复杂度为0（1）
②持动态扩容
③减少内存分配次数
④二进制安全==

‍
