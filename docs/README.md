# Semantic-Crosswalk-Editor

## Overview

The purpose of this project is to enhance the data portability of standards.
Although in the end for any structured data we start with XML as syntax.

Our first milestone objective is to provide within half a year a Minimum Viable Product (MVP) to interested parties.

For demonstration, we have chosen the real-world scenario maintaining the syntax binding of the EU e-procurement (EU CEN Standard EN16931) scenario.

With our MVP we want to show how domain experts are able to easily align their semantics - here given by the CEN technical committee 434 (EN16931-1) - with the related given syntax, in our showcase the e-procurement XML syntax Cross Industry Invoice (CII) defined by the UN/CEFACT.

## High level Concepts

* [Reused Free Open Source Software (FOSS) Modules - Standing on Shoulders of Giants](Foss.md).
* [Basics on the European e-Invoice Specification (EN16931)](EN16931.md).

## User Documentation

* [Getting Started](GettingStarted.md):
  * Use-case: after installing the extension, in an empty workspace, what to do next to start working with the Syntax Bindings (without assuming someone explained it already)?
* [Features](Features.md):
  * List and show key features of our extension (without getting to much into detail)
  * (Additionally, roughly what vscode and vscode-xml offers for our use-cases)
* [Optimizing Workspace](OptimizingWorkspace.md):
  * Setting up the workspace to improve workflow, customizing vscode settings for our use-case, etc. (in a simple way)
* [Advanced Use-Cases](AdvancedUseCases.md):
  * Specials our extension offers (advanced settings, get in detail)
  * Efficiently use the extension in conjunction with other VSCode customizations, extensions, custom snippets, etc., etc.
  * (Additionally, what else can be done with vscode and vscode-xml)

## Developer Documentation

* [Semantic-Crosswalk-Editor Development](Development.md): How to build and contribute to this extension
* [XML Features](https://github.com/DAPSI-IDISS/vscode-xml/tree/IDISS/docs):
  Everything about the underneath vscode-xml extension
* [XML Extensions](https://github.com/DAPSI-IDISS/vscode-xml/tree/IDISS/docs/Extensions.md#extensions):
  How to extend vscode-xml settings and XML features (completion, validation, hover, etc)?
