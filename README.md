# Semantic-Crosswalk-Editor

Editor to improve Data Interoperability by bridging Standards using human-centric Semantics.

## Overview

The **purpose** of this project is to enhance the data portability of standards.
Although in the end for any structured data we start with XML as syntax.

Our **first milestone objective** is to provide within half a year a Minimum Viable Product (MVP) to interested parties.

For the beginning, we have chosen the real-world scenario maintaining the syntax binding of the EU e-procurement (EU CEN Standard EN16931) scenario.

![EU Syntax Binding](docs/images/EN16931-SyntaxBinding.png)

With our MVP we want to show how domain experts are able to easily align their semantics - here given by the CEN technical committee 434 (EN16931-1) - with the related given syntax, in our showcase the e-procurement XML syntax Cross Industry Invoice (CII) defined by the UN/CEFACT.

## High level Concept

* [Reused Free Open Source Software (FOSS) Modules - Standing on Shoulders of Giants](docs/Foss.md).
* [Basics on the European e-Invoice Specification (EN16931)](docs/EN16931.md).

## User Documentation

* [Getting Started](docs/GettingStarted.md): How to install the Semantic Crosswalk Editor and get started with Syntax Bindings.
* [Optimizing Workspace](docs/OptimizingWorkspace.md): Setting up the workspace to improve workflow with the SCE extension.
* [SCE Features](docs/Features.md): Comprehensive list of the Semantic Crosswalk Editor key features (with animations to show them in action).
* [XML Features](https://github.com/DAPSI-IDISS/vscode-xml/tree/IDISS/docs):
  Everything about the underneath XML extension (validation, preferences, formatting, etc).

## Developer Documentation

* [SCE Development](docs/Development.md): How to build and contribute to the Semantic Crosswalk Editor extension.
* [XML Extensions](https://github.com/DAPSI-IDISS/vscode-xml/tree/IDISS/docs/Extensions.md#extensions):
  How to extend VSCode XML and LemMinX features (completion, validation, hover, etc).
	
	
## Endorsements

### [Paul Simons](https://www.linkedin.com/in/paulsimonscb/), Convenor TC434 WG1. Semantic data model

This work is important for the further development and standardisation of e-invoicing in general and more specific to the EN16931 developed by the CEN/TC434 Workgroup.
It will 
-	Enhance interoperability between the different ERP/Accounting software solutions in the market to the benefit of end-users
-	Increase the accuracy of calculations
-	Guarantee calculation results independent of the development tools and environment
-	Resolve rounding issues in a transparent and predictable way

### [Fred van Blommestein](https://www.linkedin.com/in/fred-van-blommestein-7871b43/), editor of EN16931-1 and convenor of CEN/TC434 WG3 (Syntax binding)

TC434 has limited resources, especially with regard to the very technical work of syntax binding of semantic standards, which needs highly specialized expertise. Two projects within TC434 soon will need this effort: the amendment of EN16931-1 (the semantic standard for an electronic invoice) and the semantic standard for an electronic receipt. The tooling that is developed in this solution is indispensable for this work.  	

## Supported by

<div style="display: table;">
	<div style="display: table-cell; float: left; margin-right: 10px;">
		<a href="https://www.ngi.eu/"><img alt="Image DAPSI - Data Portability & Services Incubator" src="https://dapsi.ngi.eu/wp-content/uploads/2020/01/NGI_DAPSI_Tag-color-positive-large.png" width="225" height="75"></a>
	</div>
	<div style="display: table-cell; vertical-align: middle;">
		<b>Data Portability & Services Incubator (DAPSI) program</b> - <a href="https://dapsi.ngi.eu/">https://dapsi.ngi.eu/</a> <br/>
		<b>EU Grant Agreement No.: 871498</b> - <a href="https://cordis.europa.eu/project/id/871498">https://cordis.europa.eu/project/id/871498</a> <br/>
		<b>Call: H2020-ICT-2018-2020</b>
	</div>
</div>
