---
title: "VScode配置Latex"
description: 
date: 2023-11-15T21:32:47+08:00
image: 
math: 
license: 
hidden: false
comments: true
draft: false
categories:
    - 杂七杂八
---


最近开始要写课程论文了，想着要用latex的模板直接写会方便，又懒得下overleaf，话不多说开始配置

## 下载与安装
1. 可以从该镜像下载
	[Index of CTAN-local/systems/texlive/Images](https://mirrors.huaweicloud.com/CTAN/systems/texlive/Images/
	
	mac用户可配置[MacTeX - TeX Users Group](https://tug.org/mactex/mactex-download.html)


2. 安装vscode插件 `LaTeX Workshop`


## 配置
### 配置latex-workshop

不包含外部 pdf 查看器设置的配置

```json
 "latex-workshop.latex.autoBuild.run": "never",
    "latex-workshop.showContextMenu": true,
    "latex-workshop.intellisense.package.enabled": true,
    "latex-workshop.message.error.show": false,
    "latex-workshop.message.warning.show": false,
    "latex-workshop.latex.tools": [
        {
            "name": "xelatex",
            "command": "xelatex",
            "args": [
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "%DOCFILE%"
            ]
        },
        {
            "name": "pdflatex",
            "command": "pdflatex",
            "args": [
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "%DOCFILE%"
            ]
        },
        {
            "name": "latexmk",
            "command": "latexmk",
            "args": [
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "-pdf",
                "-outdir=%OUTDIR%",
                "%DOCFILE%"
            ]
        },
        {
            "name": "bibtex",
            "command": "bibtex",
            "args": [
                "%DOCFILE%"
            ]
        }
    ],
    "latex-workshop.latex.recipes": [
        {
            "name": "XeLaTeX",
            "tools": [
                "xelatex"
            ]
        },
        {
            "name": "PDFLaTeX",
            "tools": [
                "pdflatex"
            ]
        },
        {
            "name": "BibTeX",
            "tools": [
                "bibtex"
            ]
        },
        {
            "name": "LaTeXmk",
            "tools": [
                "latexmk"
            ]
        },
        {
            "name": "xelatex -> bibtex -> xelatex*2",
            "tools": [
                "xelatex",
                "bibtex",
                "xelatex",
                "xelatex"
            ]
        },
        {
            "name": "pdflatex -> bibtex -> pdflatex*2",
            "tools": [
                "pdflatex",
                "bibtex",
                "pdflatex",
                "pdflatex"
            ]
        },
    ],
    "latex-workshop.latex.clean.fileTypes": [
        "*.aux",
        "*.bbl",
        "*.blg",
        "*.idx",
        "*.ind",
        "*.lof",
        "*.lot",
        "*.out",
        "*.toc",
        "*.acn",
        "*.acr",
        "*.alg",
        "*.glg",
        "*.glo",
        "*.gls",
        "*.ist",
        "*.fls",
        "*.log",
        "*.fdb_latexmk"
    ],
    "latex-workshop.latex.autoClean.run": "onFailed",
    "latex-workshop.latex.recipe.default": "lastUsed",
    "latex-workshop.view.pdf.internal.synctex.keybinding": "double-click"
```

### SumatraPDF 安装设置
因为vscode内置的pdf查看器不太好用，可以配置别的pdf查看器。具体配置参考[Visual Studio Code (vscode)配置LaTeX - 知乎](https://zhuanlan.zhihu.com/p/166523064?utm_id=0)


## 常用latex模板
- 科大学位论文模板：[GitHub - ustctug/ustcthesis: LaTeX template for USTC thesis](https://github.com/ustctug/ustcthesis)
- 国科大学位论文模板：[GitHub - mohuangrui/ucasthesis: LaTeX Thesis Template for the University of Chinese Academy of Sciences](https://github.com/mohuangrui/ucasthesis)
- 国科大大作业论文模板：[GitHub - jweihe/UCAS\_Latex\_Template: 中国科学院大学通用课程大作业模板](https://github.com/jweihe/UCAS_Latex_Template)
