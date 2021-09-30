# Semantic-Crosswalk-Editor

## Overview

The **purpose** of this project is to enhance the data portability of standards.
Although in the end for any structured data we start with XML as syntax.

Our **first milestone objective** is to provide within half a year a Minimum Viable Product (MVP) to interested parties.

For the beginning, we have chosen the real-world scenario maintaining the syntax binding of the EU e-procurement (EU CEN Standard EN16931) scenario.

![EU Syntax Binding](images/EN16931-SyntaxBinding.png)

With our MVP we want to show how domain experts are able to easily align their semantics - here given by the CEN technical committee 434 (EN16931-1) - with the related given syntax, in our showcase the e-procurement XML syntax Cross Industry Invoice (CII) defined by the UN/CEFACT.

## High level Concepts

* [Reused Free Open Source Software (FOSS) Modules - Standing on Shoulders of Giants](Foss.md).
* [Basics on the European e-Invoice Specification (EN16931)](EN16931.md).

## User Documentation

* [Getting Started](GettingStarted.md): How to install the Semantic Crosswalk Editor and get started with Syntax Bindings.
* [Optimizing Workspace](OptimizingWorkspace.md): Setting up the workspace to improve workflow with the SCE extension.
* [SCE Features](Features.md): Comprehensive list of the Semantic Crosswalk Editor key features (with animations to show them in action).
* [XML Features](https://github.com/DAPSI-IDISS/vscode-xml/tree/IDISS/docs):
  Everything about the underneath XML extension (validation, preferences, formatting, etc).

## Developer Documentation

* [SCE Development](Development.md): How to build and contribute to the Semantic Crosswalk Editor extension.
* [XML Extensions](https://github.com/DAPSI-IDISS/vscode-xml/tree/IDISS/docs/Extensions.md#extensions):
  How to extend VSCode XML and LemMinX features (completion, validation, hover, etc).
